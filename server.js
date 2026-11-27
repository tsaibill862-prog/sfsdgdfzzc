import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { randomUUID } from 'node:crypto';

const PORT=Number(process.env.PORT||10000);
const MAX_PLAYERS=10, MIN_PLAYERS=2, MATCH_JOIN_WINDOW=90_000;
const server=http.createServer((req,res)=>{
 if(req.url==='/health'){res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify({ok:true,service:'battle-royale-matchmaking'}));return;}
 res.writeHead(200,{'content-type':'text/plain'});res.end('Battle Royale WebSocket server');
});
const wss=new WebSocketServer({server});
const waiting=[], rooms=new Map(), clients=new Map();
let activeRoom=null;
const send=(ws,data)=>{if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(data));};
const broadcast=(room,data,except=null)=>{for(const p of room.players.values())if(p.ws!==except)send(p.ws,data);};
const publicPlayers=room=>[...room.players.values()].map(p=>({id:p.id,name:p.name,x:p.x,y:p.y,z:p.z,yaw:p.yaw,hp:p.hp,alive:p.alive}));
function removeFromQueue(ws){const i=waiting.findIndex(p=>p.ws===ws);if(i>=0)waiting.splice(i,1);}
function makeRoom(){
 const room={id:randomUUID(),players:new Map(),startedAt:Date.now(),lastTick:Date.now(),ended:false};
 rooms.set(room.id,room);activeRoom=room;
 const chosen=waiting.splice(0,MAX_PLAYERS);
 const spawns=[[-34,0,-34],[34,0,-34],[-34,0,34],[34,0,34],[0,0,-40],[0,0,40],[-42,0,0],[42,0,0],[-20,0,0],[20,0,0]];
 chosen.forEach((entry,i)=>{
  const p={id:entry.id,ws:entry.ws,name:entry.name,x:spawns[i][0],y:0,z:spawns[i][2],yaw:0,hp:100,alive:true,lastState:0,lastShot:0,kills:0};
  p.ws.roomId=room.id;room.players.set(p.id,p);clients.set(p.ws,p);
 });
 const payload={type:'matchFound',roomId:room.id,players:publicPlayers(room),you:null};
 for(const p of room.players.values())send(p.ws,{...payload,you:p.id,spawn:{x:p.x,y:p.y,z:p.z}});
 broadcast(room,{type:'system',message:'戰局開始！'});
}
function joinActive(entry){
 const room=activeRoom;
 if(!room||room.ended||room.players.size>=MAX_PLAYERS||Date.now()-room.startedAt>MATCH_JOIN_WINDOW)return false;
 const i=room.players.size,spawns=[[-34,-34],[34,-34],[-34,34],[34,34],[0,-40],[0,40],[-42,0],[42,0],[-20,0],[20,0]];
 const [x,z]=spawns[i]||[0,0],p={id:entry.id,ws:entry.ws,name:entry.name,x,y:0,z,yaw:0,hp:100,alive:true,lastState:0,lastShot:0,kills:0};
 p.ws.roomId=room.id;room.players.set(p.id,p);clients.set(p.ws,p);
 send(p.ws,{type:'matchFound',roomId:room.id,players:publicPlayers(room),you:p.id,spawn:{x,y:0,z}});
 broadcast(room,{type:'playerJoined',player:{id:p.id,name:p.name,x:p.x,y:p.y,z:p.z,yaw:0,hp:100,alive:true}},p.ws);
 return true;
}
function queuePlayer(ws,name){
 if(clients.has(ws)||waiting.some(p=>p.ws===ws))return;
 const entry={id:randomUUID(),ws,name:String(name||'玩家').slice(0,16)};
 if(joinActive(entry))return;
 waiting.push(entry);
 for(const p of waiting)send(p.ws,{type:'queueStatus',waiting:waiting.length,minimum:MIN_PLAYERS,maximum:MAX_PLAYERS});
 if(waiting.length>=MIN_PLAYERS)makeRoom();
}
function leave(ws){
 removeFromQueue(ws);
 const p=clients.get(ws);if(!p)return;
 clients.delete(ws);
 const room=rooms.get(ws.roomId);if(!room)return;
 room.players.delete(p.id);
 broadcast(room,{type:'playerLeft',id:p.id,name:p.name});
 const alive=[...room.players.values()].filter(v=>v.alive);
 if(alive.length===1&&!room.ended){room.ended=true;send(alive[0].ws,{type:'victory',kills:alive[0].kills});broadcast(room,{type:'matchEnded',winner:alive[0].id},alive[0].ws);}
 if(room.players.size===0){rooms.delete(room.id);if(activeRoom===room)activeRoom=null;}
}
function applyShot(p,msg){
 const now=Date.now();if(!p.alive||now-p.lastShot<180)return;p.lastShot=now;
 const o=msg.origin||{},d=msg.direction||{};
 const ox=Number(o.x),oy=Number(o.y),oz=Number(o.z),dx=Number(d.x),dy=Number(d.y),dz=Number(d.z);
 if(![ox,oy,oz,dx,dy,dz].every(Number.isFinite))return;
 const len=Math.hypot(dx,dy,dz)||1,dir={x:dx/len,y:dy/len,z:dz/len};
 let best=null,bestT=90;
 const room=rooms.get(p.ws.roomId);if(!room)return;
 for(const target of room.players.values()){
  if(target.id===p.id||!target.alive)continue;
  const tx=target.x-ox,ty=target.y+0.95-oy,tz=target.z-oz;
  const t=tx*dir.x+ty*dir.y+tz*dir.z;if(t<0||t>bestT)continue;
  const px=tx-dir.x*t,py=ty-dir.y*t,pz=tz-dir.z*t;
  if(px*px+py*py+pz*pz<1.15*1.15){best=target;bestT=t;}
 }
 broadcast(room,{type:'shot',id:p.id,origin:{x:ox,y:oy,z:oz},direction:dir});
 if(best){
  const damage=Math.max(1,Math.min(120,Number(msg.damage)||25));
  best.hp=Math.max(0,best.hp-damage);
  if(best.hp===0){best.alive=false;p.kills++;broadcast(room,{type:'playerEliminated',id:best.id,by:p.id,kills:p.kills});}
  else send(best.ws,{type:'damaged',hp:best.hp,by:p.id});
  send(p.ws,{type:'hitConfirmed',target:best.id,eliminated:!best.alive,kills:p.kills});
  broadcast(room,{type:'playerHealth',id:best.id,hp:best.hp,alive:best.alive},best.ws);
  const survivors=[...room.players.values()].filter(v=>v.alive);
  if(survivors.length===1&&!room.ended){room.ended=true;send(p.ws,{type:'victory',kills:p.kills});broadcast(room,{type:'matchEnded',winner:p.id},p.ws);}
 }
}
wss.on('connection',ws=>{
 send(ws,{type:'connected',maxPlayers:MAX_PLAYERS});
 ws.on('message',raw=>{
  let msg;try{msg=JSON.parse(raw.toString());}catch{return;}
  if(msg.type==='queue'){queuePlayer(ws,msg.name);return;}
  const p=clients.get(ws);if(!p)return;
  if(msg.type==='state'&&p.alive){
   const s=msg.state||{},x=Number(s.x),y=Number(s.y),z=Number(s.z),yaw=Number(s.yaw);
   if(![x,y,z,yaw].every(Number.isFinite)||Math.abs(x)>52||Math.abs(z)>48||Math.abs(y)>40)return;
   const now=Date.now();if(now-p.lastState<25)return;p.lastState=now;
   p.x=x;p.y=y;p.z=z;p.yaw=yaw;
   const room=rooms.get(ws.roomId);if(room)broadcast(room,{type:'playerState',id:p.id,x,y,z,yaw,hp:p.hp,alive:p.alive},ws);
  }else if(msg.type==='fire')applyShot(p,msg);
  else if(msg.type==='leave')leave(ws);
 });
 ws.on('close',()=>leave(ws));
 ws.on('error',()=>leave(ws));
});
server.listen(PORT,'0.0.0.0',()=>console.log('Multiplayer server listening on '+PORT));
