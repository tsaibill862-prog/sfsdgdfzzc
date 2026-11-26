import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './style.css';
const root=document.querySelector('#game');
root.innerHTML="<div id='hud'><header><b>PROJECT BATTLE ROYALE</b><small>ALPHA 4.2 · ASSET PIPELINE</small></header><div class='stats'><span>生命 <b id='hp'>100</b></span><span>擊殺 <b id='kills'>0</b></span><span>敵人 <b id='left'>5</b></span><span id='timer'>00:00</span></div><div class='cross'>+</div><div id='pickupPrompt'></div><div class='help'>WASD 移動 · Shift 衝刺 · Space 跳躍／翻越 · Z 蹲下 · X 趴下 · 靠近梯子按住 Space 攀爬<br>左鍵射擊 · 右鍵瞄準 · F 拾取 · E 背包 · ESC 暫停／繼續 · R 裝填</div><div class='weapon'><b id='weapon'>突擊步槍</b><strong id='ammo'>30</strong><small id='reserve'>/ 150</small><p id='hint'>全自動 · 中距離</p></div><div id='hit'>✕</div><div id='damage'></div><div id='toast'></div></div><div id='inventory' aria-hidden='true'><div class='inventory-shell'><div class='inventory-head'><div><small>PLAYER EQUIPMENT</small><h2>背包</h2></div><button id='inventoryClose' type='button'>ESC 關閉</button></div><div class='inventory-layout'><section class='inventory-panel'><h3>裝備欄</h3><div id='equipmentSlots'></div></section><section class='inventory-panel'><h3>背包物品 <span id='bagCount'></span></h3><div id='backpackGrid'></div><p class='inventory-tip'>H 使用醫療包　·　E / ESC 關閉背包</p></section><section class='inventory-panel inventory-character'><h3>角色狀態</h3><div class='operator-silhouette'>●<br>╱│╲<br>╱ ╲</div><div id='inventoryStats'></div></section></div></div></div><div id='lobby' class='visible'><div class='lobby-top'><div class='lobby-brand'><b>PROJECT <em>BATTLE ROYALE</em></b><small>TACTICAL COMBAT EXPERIENCE</small></div><div class='lobby-profile'><span class='profile-avatar'>OP</span><span><b>PLAYER 001</b><small>新兵 · 等級 1</small></span><i>● ONLINE</i></div></div><nav class='lobby-nav'><button class='active' data-tab='home'>遊戲大廳</button><button data-tab='character'>角色</button><button data-tab='storage'>倉庫</button><button data-tab='settings'>設定</button></nav><div class='lobby-main'><section class='lobby-copy'><small class='eyebrow'>WELCOME TO THE BATTLEFIELD</small><h1>準備好<br><em>投入戰場了嗎？</em></h1><p>選擇你的作戰模式，整備裝備，加入戰鬥。</p><div class='lobby-feature'><span>01</span><div><b>戰術部署</b><small>探索軍事基地、建築與複雜地形</small></div></div><div class='lobby-feature'><span>02</span><div><b>武器搜刮</b><small>步槍、狙擊槍、手槍與霰彈槍</small></div></div><div class='lobby-feature'><span>03</span><div><b>生存到底</b><small>善用掩體，擊敗敵方作戰人員</small></div></div></section><section class='lobby-modes'><div class='mode-heading'><div><small class='eyebrow'>SELECT YOUR MODE</small><h2>選擇遊戲模式</h2></div><span class='online-pill'>● 戰場待命</span></div><button class='mode-card selected' data-mode='training'><span class='mode-number'>01</span><span class='mode-copy'><b>訓練場</b><small>單人練習 · AI 敵人 · 熟悉武器</small></span><strong>可遊玩</strong></button><button class='mode-card' data-mode='solo'><span class='mode-number'>02</span><span class='mode-copy'><b>單人大逃殺</b><small>最多 10 名玩家 · 最後生存者獲勝</small></span><strong>即將推出</strong></button><button class='mode-card' data-mode='squad'><span class='mode-number'>03</span><span class='mode-copy'><b>多人戰場</b><small>建立房間 · 邀請好友 · 最多 10 人</small></span><strong>即將推出</strong></button><button class='mode-card' data-mode='team'><span class='mode-number'>04</span><span class='mode-copy'><b>5 vs 5 團隊死鬥</b><small>兩隊交鋒 · 團隊合作</small></span><strong>即將推出</strong></button><div class='mode-footer'><span id='modeDescription'>單人訓練場，對抗 AI 敵人並熟悉戰場。</span><button id='lobbyStart'>開始遊戲 <b>➜</b></button></div></section></div><div class='lobby-bottom'><span>ALPHA 4.2 · BATTLE LOBBY</span><span>PC · KEYBOARD & MOUSE</span><span>© PROJECT BATTLE ROYALE · 3D ASSETS: POLY HAVEN (CC0)</span></div></div><div id='overlay'><section><small>TRAINING ARENA · BUILD 4.1</small><h1>PROJECT<br><em>BATTLE ROYALE</em></h1><p id='desc'>你一開始沒有武器，先搜尋建築與倉庫拾取槍枝，再利用掩體擊倒 AI 敵人。</p><div class='tags'>第三人稱射擊　·　場景搜刮　·　4 種槍枝　·　AI 敵人</div><button id='start'>開始戰鬥</button><small class='note'>建議使用電腦與滑鼠遊玩</small></section></div>";
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9aa99a);scene.fog=new THREE.Fog(0x9aa99a,52,145);
const camera=new THREE.PerspectiveCamera(67,innerWidth/innerHeight,.1,180);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;root.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xe2eaff,0x394537,1.65));const sun=new THREE.DirectionalLight(0xffe0b5,3.0);sun.position.set(-32,46,24);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-72;sun.shadow.camera.right=72;sun.shadow.camera.top=72;sun.shadow.camera.bottom=-72;sun.shadow.camera.near=1;sun.shadow.camera.far=125;sun.shadow.bias=-0.00025;scene.add(sun);

// Runtime GLB environment pipeline. Each model reports its real browser load result.
const environmentGLTFLoader=new GLTFLoader();
const environmentStatus=document.createElement('div');
environmentStatus.id='environmentAssetStatus';
environmentStatus.style.cssText='position:fixed;left:12px;top:12px;z-index:30;padding:7px 10px;background:rgba(8,16,13,.78);border:1px solid rgba(180,205,170,.35);border-radius:5px;color:#e8f0df;font:12px/1.45 system-ui;pointer-events:none;max-width:310px';
environmentStatus.textContent='環境模型：載入中…';
root.appendChild(environmentStatus);
async function loadEnvironmentAssetManifest(){
 let treeExpected=0,treeLoaded=0,treeFailed=0,otherLoaded=0,otherFailed=0;
 const refreshStatus=()=>{environmentStatus.textContent=`環境模型：樹木 ${treeLoaded}/${treeExpected} 棵（${treeFailed} 失敗） · 其他模型 ${otherLoaded} 成功（${otherFailed} 失敗）`;};
 const yieldFrame=()=>new Promise(resolve=>requestAnimationFrame(()=>resolve()));
 try{
  const response=await fetch('/assets/environment/manifest.json',{cache:'no-cache'});
  if(!response.ok)throw new Error(`manifest HTTP ${response.status}`);
  const manifest=await response.json();
  const assets=manifest.assets||[];
  treeExpected=assets.filter(a=>/tree/i.test(a.id||'')).reduce((n,a)=>n+(a.placements?.length||1),0);
  refreshStatus();
  // Load one source model at a time. This avoids simultaneous texture decoding spikes.
  for(const asset of assets){
   if(!asset.url)continue;
   try{
    const gltf=await environmentGLTFLoader.loadAsync(asset.url);
    if(asset.type==='ground-material'){
     let sourceMaterial=null;
     gltf.scene.traverse(node=>{if(!sourceMaterial&&node.isMesh)sourceMaterial=Array.isArray(node.material)?node.material[0]:node.material;});
     if(!sourceMaterial)throw new Error('Ground material has no mesh');
     const material=sourceMaterial.clone();
     for(const key of ['map','normalMap','roughnessMap','aoMap','metalnessMap']){
      const texture=material[key];
      if(texture){texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(asset.repeat||12,asset.repeat||12);texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());}
     }
     material.color.set(0xffffff);material.roughness=Math.max(material.roughness||0,.82);
     ground.material=material;ground.material.needsUpdate=true;otherLoaded++;refreshStatus();await yieldFrame();continue;
    }
    let meshCount=0;
    const placements=asset.placements||[{position:asset.position||[0,0,0],rotation:asset.rotation||[0,0,0],scale:asset.scale||1}];
    for(let index=0;index<placements.length;index++){
     const placement=placements[index];
     const model=gltf.scene.clone(true);
     model.rotation.set(...(placement.rotation||[0,0,0]));
     model.scale.setScalar(placement.scale||1);
     model.updateMatrixWorld(true);
     const bounds=new THREE.Box3().setFromObject(model);
     const x=placement.position?.[0]||0,z=placement.position?.[2]||0;
     const terrainY=typeof terrainHeightAt==='function'?terrainHeightAt(x,z):(placement.position?.[1]||0);
     if(Number.isFinite(bounds.min.y))model.position.y=terrainY-bounds.min.y;
     model.position.x=x;model.position.z=z;model.updateMatrixWorld(true);bounds.setFromObject(model);
     const isTree=/tree/i.test(asset.id||'');
     const modelSize=bounds.getSize(new THREE.Vector3());
     const modelCenter=bounds.getCenter(new THREE.Vector3());
     const modelMeshes=[];
     model.traverse(node=>{if(node.isMesh){meshCount++;modelMeshes.push(node);node.castShadow=!isTree&&asset.castShadow!==false;node.receiveShadow=asset.receiveShadow!==false;if(node.material){const materials=Array.isArray(node.material)?node.material:[node.material];for(const material of materials){if(material.map)material.map.colorSpace=THREE.SRGBColorSpace;if(material.normalMap)material.normalScale.setScalar(asset.normalScale||1);if(material.transparent||material.alphaTest>0){material.alphaTest=Math.max(material.alphaTest||0,.42);material.depthWrite=true;}}}}});
     // Imported meshes participate in bullet raycasts as well as actor collision.
     worldSolids.push(...modelMeshes);
     if(isTree){
      // A compact trunk collider avoids making the entire canopy an oversized wall.
      const trunkRadius=Math.max(.24,Math.min(.48,Math.max(modelSize.x,modelSize.z)*.075));
      obstacleColliders.push({kind:'cylinder',x:modelCenter.x,z:modelCenter.z,radius:trunkRadius,supportRadius:Math.max(trunkRadius,Math.max(modelSize.x,modelSize.z)*.42),minY:bounds.min.y,maxY:bounds.max.y,jumpable:false,mesh:model});
     }else if(/boulder|rock/i.test(asset.id||'')){
      const radius=Math.max(.45,Math.max(modelSize.x,modelSize.z)*.46);
      obstacleColliders.push({kind:'rock',x:modelCenter.x,z:modelCenter.z,radius,minY:bounds.min.y,maxY:bounds.max.y,jumpable:true,mesh:model});
     }else{
      // Give every imported mesh its own collider. A fort's full model bounds would
      // incorrectly fill courtyards and gaps between separate wall sections.
      let partCount=0;
      for(const part of modelMeshes){
       part.updateMatrixWorld(true);
       const partBounds=new THREE.Box3().setFromObject(part);
       if(!Number.isFinite(partBounds.min.x)||!Number.isFinite(partBounds.max.x))continue;
       const partSize=partBounds.getSize(new THREE.Vector3());
       if(partSize.x<.08||partSize.z<.08||partSize.y<.08)continue;
       const partCenter=partBounds.getCenter(new THREE.Vector3());
       obstacleColliders.push({kind:'box',x:partCenter.x,z:partCenter.z,halfX:Math.max(.06,partSize.x*.5),halfZ:Math.max(.06,partSize.z*.5),minY:partBounds.min.y,maxY:partBounds.max.y,jumpable:false});
       partCount++;
      }
      console.info(`Environment collision parts: ${asset.id}; colliders=${partCount}`);
     }
     scene.add(model);
     // Yield every two placed instances so the game loop and input remain responsive.
     if(index%2===1)await yieldFrame();
    }
    if(/tree/i.test(asset.id||''))treeLoaded+=placements.length;else otherLoaded++;
    refreshStatus();
    console.info(`Environment asset loaded: ${asset.id}; meshes=${meshCount}; instances=${placements.length}`);
    await yieldFrame();
   }catch(error){
    if(/tree/i.test(asset.id||''))treeFailed+=(asset.placements?.length||1);else otherFailed++;
    refreshStatus();console.error(`Environment asset failed: ${asset.id||asset.url}`,asset.url,error);
   }
  }
  refreshStatus();
 }catch(error){
  environmentStatus.textContent='環境模型載入失敗：'+error.message;
  console.error('Environment manifest failed',error);
 }
}
const materialCache=new Map();const mat=c=>{if(!materialCache.has(c)){const concreteColors=[0x777d76,0x9a927e,0x777b70,0x77796d,0x626b65,0x696f69,0x8c806d,0x77796f];const asphaltColors=[0x555e59,0x454b49];const map=concreteColors.includes(c)?surfaceMaps.concrete:asphaltColors.includes(c)?surfaceMaps.asphalt:null;materialCache.set(c,new THREE.MeshStandardMaterial({color:c,roughness:map?.98:.86,map}));}return materialCache.get(c);};
const worldSolids=[],solidBounds=[],pickupBounds=[],obstacleColliders=[],impactSurfaces=[];

function makeSurfaceMap(kind){
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');
 const palettes={asphalt:['#353a38','#454946','#292e2c'],concrete:['#77796f','#89877b','#62675f'],dirt:['#625b43','#776c4d','#4d4a38'],bark:['#493728','#68503a','#332b22']};
 const colors=palettes[kind];ctx.fillStyle=colors[0];ctx.fillRect(0,0,256,256);
 let seed=kind==='asphalt'?17:kind==='concrete'?31:kind==='dirt'?53:79;
 const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<5200;i++){const x=rand()*256,y=rand()*256,r=rand()*(kind==='bark'?2.8:1.8)+.3;ctx.globalAlpha=.08+rand()*.22;ctx.fillStyle=colors[1+Math.floor(rand()*2)];ctx.beginPath();ctx.ellipse(x,y,r*(kind==='bark'?.5:1),r,rand()*Math.PI,0,Math.PI*2);ctx.fill();}
 ctx.globalAlpha=1;
 if(kind==='concrete'){for(let i=0;i<13;i++){const x=rand()*256,y=rand()*256;ctx.strokeStyle='rgba(35,39,34,.25)';ctx.lineWidth=1+rand();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+rand()*18-9,y+rand()*24);ctx.stroke();}}
 if(kind==='asphalt'){for(let i=0;i<9;i++){const x=rand()*256,y=rand()*256;ctx.strokeStyle='rgba(15,18,17,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+rand()*24,y+rand()*16);ctx.stroke();}}
 if(kind==='bark'){for(let i=0;i<28;i++){const x=rand()*256;ctx.strokeStyle='rgba(20,14,10,.35)';ctx.lineWidth=1+rand()*2;ctx.beginPath();ctx.moveTo(x,rand()*256);ctx.lineTo(x+(rand()-.5)*7,256);ctx.stroke();}}
 const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(kind==='bark'?1.2:3,kind==='bark'?1.6:3);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();return tex;
}
const surfaceMaps={asphalt:makeSurfaceMap('asphalt'),concrete:makeSurfaceMap('concrete'),dirt:makeSurfaceMap('dirt'),bark:makeSurfaceMap('bark')};

// Procedural dirt-and-grass albedo: subtle mottling gives the terrain a natural surface.
const terrainSize=256,terrainPixels=new Uint8Array(terrainSize*terrainSize*4);
let terrainSeed=7391;const terrainRand=()=>{terrainSeed=(terrainSeed*1664525+1013904223)>>>0;return terrainSeed/4294967296;};
for(let y=0;y<terrainSize;y++)for(let x=0;x<terrainSize;x++){const i=(y*terrainSize+x)*4,n=(terrainRand()-.5)*22,macro=Math.sin(x*.027+y*.018)*8+Math.cos(y*.035-x*.021)*7,micro=(Math.sin(x*.31)*Math.cos(y*.27))*4,grain=(terrainRand()-.5)*13,v=macro+micro+n+grain;const damp=Math.max(0,Math.sin(x*.014+y*.023)-.48)*10;terrainPixels[i]=Math.max(0,102+v-damp);terrainPixels[i+1]=Math.max(0,116+v-damp*.5);terrainPixels[i+2]=Math.max(0,76+v*.68);terrainPixels[i+3]=255;}
const terrainTexture=new THREE.DataTexture(terrainPixels,terrainSize,terrainSize,THREE.RGBAFormat);terrainTexture.wrapS=terrainTexture.wrapT=THREE.RepeatWrapping;terrainTexture.repeat.set(22,22);terrainTexture.colorSpace=THREE.SRGBColorSpace;terrainTexture.magFilter=THREE.LinearFilter;terrainTexture.minFilter=THREE.LinearMipmapLinearFilter;terrainTexture.generateMipmaps=true;terrainTexture.needsUpdate=true;
// Walkable height field: rolling ridges, elevated plateaus, shallow gullies and a lake basin.
const smoothStep=(a,b,v)=>{const t=THREE.MathUtils.clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
function terrainHeightAt(x,z){
 const mound=(cx,cz,r,h)=>h*(1-smoothStep(r,r+6,Math.hypot(x-cx,z-cz)));
 let y=0;
 y+=mound(-23,-23,5.5,3.2);
 y+=mound(14,-35,5.2,4.1);
 y+=mound(-31,23,6.5,2.6);
 y+=mound(4,39,5.5,2.1);
 y-=1.65*(1-smoothStep(5.2,10.2,Math.hypot(x-32,z-28)));
 // Two shallow gullies create low ground and natural approaches between ridges.
 const gully1=Math.abs(z-(11+Math.sin(x*.12)*2.2));
 if(x>-25&&x<18)y-=.85*(1-smoothStep(2.1,5.2,gully1));
 const gully2=Math.abs(x-(-39+Math.sin(z*.1)*1.5));
 if(z>-20&&z<24)y-=.55*(1-smoothStep(1.5,4.2,gully2));
 return y;
}
const terrainGeo=new THREE.PlaneGeometry(180,180,150,150),terrainPos=terrainGeo.attributes.position;
for(let i=0;i<terrainPos.count;i++){const x=terrainPos.getX(i),z=-terrainPos.getY(i);terrainPos.setZ(i,terrainHeightAt(x,z));}
terrainGeo.computeVertexNormals();
const ground=new THREE.Mesh(terrainGeo,new THREE.MeshStandardMaterial({color:0xffffff,map:terrainTexture,roughness:1}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);impactSurfaces.push(ground);
let environmentAssetsLoaded=false;const environmentAssetsReady=loadEnvironmentAssetManifest().finally(()=>{environmentAssetsLoaded=true;});

// Low grass tufts are instanced to keep draw calls low while breaking up the flat ground.
const grassGeo=new THREE.ConeGeometry(.075,.42,3),grassMat=new THREE.MeshStandardMaterial({color:0x66794b,roughness:1,side:THREE.DoubleSide});
const grass=new THREE.InstancedMesh(grassGeo,grassMat,520),grassDummy=new THREE.Object3D();let grassCount=0;
for(let i=0;i<520;i++){const x=(terrainRand()-.5)*92,z=(terrainRand()-.5)*82;if(Math.abs(x)<5||Math.abs(z+30)<4||Math.abs(x+30)<4)continue;if(Math.hypot(x-32,z-28)<10)continue;const sc=.55+terrainRand()*.8;grassDummy.position.set(x,terrainHeightAt(x,z)+.18*sc,z);grassDummy.rotation.y=terrainRand()*Math.PI;grassDummy.scale.set(sc,sc,sc);grassDummy.updateMatrix();grass.setMatrixAt(grassCount++,grassDummy.matrix);}
grass.count=grassCount;grass.instanceMatrix.needsUpdate=true;grass.castShadow=false;grass.receiveShadow=true;scene.add(grass);
// The old flat grid floated above the uneven terrain, so it is omitted.
// Military training-ground surfacing, road paint and concrete firing lanes
function floorPatch(x,z,w,d,color,y=.022){const geo=new THREE.PlaneGeometry(w,d,Math.max(2,Math.ceil(w*2)),Math.max(2,Math.ceil(d*2)));const p=geo.attributes.position;for(let i=0;i<p.count;i++){const wx=x+p.getX(i),wz=z-p.getY(i);p.setZ(i,terrainHeightAt(wx,wz)+y);}geo.computeVertexNormals();const surfaceKind=color<0x600000?'asphalt':(color>0x700000?'concrete':'dirt');const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color,map:surfaceMaps[surfaceKind],roughness:surfaceKind==='asphalt'?.94:.98,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(x,0,z);m.receiveShadow=true;m.castShadow=false;scene.add(m);impactSurfaces.push(m);return m;}
floorPatch(0,-30,9,88,0x454b49);floorPatch(-30,0,8,86,0x55594f);
for(let z=-42;z<43;z+=8){floorPatch(0,z,.18,3.2,0xc5b98d,.04);}
for(let x=-3;x<=3;x+=1.5){floorPatch(x,0,.08,18,0x999582,.043);}
for(const x of [-34,-26,26,34])floorPatch(x,0,5,6,0x777b70,.028);
// Subtle perimeter gravel and scattered ground cover break up the flat arena
for(let i=0;i<46;i++){const a=i*2.399,rad=24+(i%7)*3,x=Math.cos(a)*rad,z=Math.sin(a)*rad;const pebble=new THREE.Mesh(new THREE.DodecahedronGeometry(.18+(i%3)*.08,0),mat(i%2?0x777966:0x91876e));pebble.position.set(x,terrainHeightAt(x,z)+.11,z);pebble.scale.y=.42;pebble.castShadow=false;scene.add(pebble);}
function block(x,y,z,w,h,d,c){const base=terrainHeightAt(x,z),worldY=base+y;const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,worldY,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);worldSolids.push(m);m.updateMatrixWorld(true);solidBounds.push(new THREE.Box3().setFromObject(m));obstacleColliders.push({kind:'box',x,z,halfX:w/2,halfZ:d/2,minY:base+y-h/2,maxY:base+y+h/2,jumpable:h<.9});}
for(let i=-3;i<=3;i++){block(i*15,2,-48,14,4,1.2,0x777d70);block(i*15,2,48,14,4,1.2,0x777d70);}
for(let i=-2;i<=2;i++){block(-53,2,i*18,1.2,4,17,0x777d70);block(53,2,i*18,1.2,4,17,0x777d70);}
for(let i=0;i<8;i++)block((i%4-1.5)*13,.8,9+Math.floor(i/4)*13,4,1.6,2.1,i%2?0x777b70:0x8c806d);
for(let i=0;i<12;i++){const a=i*Math.PI/6,g=new THREE.Group();const tr=new THREE.Mesh(new THREE.CylinderGeometry(.25,.35,2,7),mat(0x554735));tr.position.y=1;g.add(tr);const cr=new THREE.Mesh(new THREE.ConeGeometry(1.5,3.8,7),mat(0x455c45));cr.position.y=3.5;g.add(cr);g.position.set(Math.cos(a)*60,0,Math.sin(a)*60);scene.add(g);}
// Scenic low-poly hills around the arena perimeter
function hill(x,z,sx,sy,sz,color){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1,2),mat(color));m.scale.set(sx,sy,sz);m.position.set(x,sy*.48,z);m.receiveShadow=false;m.castShadow=false;scene.add(m);impactSurfaces.push(m);worldSolids.push(m);m.updateMatrixWorld(true);obstacleColliders.push({kind:'hill',x,z,rx:sx*.72,rz:sz*.72,minY:0,maxY:sy,jumpable:false});}
hill(-39,-35,13,8,11,0x65775b);hill(-25,-53,16,10,9,0x71815f);hill(5,-58,19,12,10,0x65765a);hill(39,-42,14,9,12,0x788364);hill(-42,38,15,9,12,0x68785b);hill(4,58,20,12,9,0x758365);hill(43,37,14,8,13,0x637657);
// Small lake, with a raised rocky shoreline; the water is deliberately outside the central combat lanes
const lakeX=32,lakeZ=28,lakeRadius=8.2;
const water=new THREE.Mesh(new THREE.CircleGeometry(lakeRadius,48),new THREE.MeshStandardMaterial({color:0x397f91,roughness:.24,metalness:.12,transparent:true,opacity:.9}));
water.rotation.x=-Math.PI/2;water.position.set(lakeX,-.08,lakeZ);scene.add(water);impactSurfaces.push(water);
const shore=new THREE.Mesh(new THREE.TorusGeometry(lakeRadius,.42,8,48),mat(0x827d62));shore.rotation.x=Math.PI/2;shore.position.set(lakeX,.08,lakeZ);shore.receiveShadow=true;scene.add(shore);impactSurfaces.push(shore);
for(let i=0;i<18;i++){const a=i*Math.PI*2/18,rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.42+((i*7)%4)*.09,0),mat(i%2?0x777967:0x91866e));rock.position.set(lakeX+Math.cos(a)*(lakeRadius+.35),.25,lakeZ+Math.sin(a)*(lakeRadius+.35));rock.scale.y=.65;rock.castShadow=false;scene.add(rock);impactSurfaces.push(rock);}
// More trees in small groves; trunks also block movement and bullets
function tree(x,z,scale=1){
 const g=new THREE.Group(),barkMat=new THREE.MeshStandardMaterial({color:0xb4a08a,map:surfaceMaps.bark,roughness:1});
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.22*scale,.34*scale,2.65*scale,9),barkMat);trunk.position.y=1.32*scale;trunk.castShadow=true;trunk.receiveShadow=true;g.add(trunk);
 for(let k=0;k<3;k++){const branch=new THREE.Mesh(new THREE.CylinderGeometry(.045*scale,.095*scale,1.15*scale,6),barkMat);branch.position.set((k-1)*.32*scale,(2.05+k*.22)*scale,0);branch.rotation.z=(k-1)*-.48;branch.castShadow=true;g.add(branch);}
 const leafMats=[0x344d35,0x405d3c,0x526b43,0x60734a].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:1}));
 for(let j=0;j<12;j++){const a=j*2.399,rad=(.35+(j%4)*.19)*scale,y=(2.35+(j%4)*.52)*scale,s=(.62+(j%3)*.15)*scale;const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),leafMats[j%leafMats.length]);crown.position.set(Math.cos(a)*rad,y,Math.sin(a)*rad);crown.scale.set(s*1.12,s*.9,s);crown.rotation.set(.2*j,.37*j,.13*j);crown.castShadow=true;crown.receiveShadow=true;g.add(crown);}
 const base=terrainHeightAt(x,z);g.position.set(x,base,z);scene.add(g);worldSolids.push(trunk);trunk.updateMatrixWorld(true);solidBounds.push(new THREE.Box3().setFromObject(trunk));obstacleColliders.push({kind:'circle',x,z,radius:.34*scale,minY:base,maxY:base+2.65*scale,jumpable:false});
}
[[-34,-12],[-39,-4],[-31,1],[-42,12],[-35,17],[-25,34],[-18,38],[-8,34],[13,37],[20,42],[42,12],[43,2],[37,-10],[29,-39],[17,-42],[-14,-39]].forEach((p,i)=>tree(p[0],p[1],.85+(i%3)*.12));
// Low crates and fallen logs can be cleared with a jump; taller cover remains solid
for(let i=0;i<6;i++){const x=-18+i*7,z=(i%2===0? -7:7);block(x,.34,z,1.35,.68,1.05,i%2?0x786448:0x8b7655);}
for(let i=0;i<4;i++){const x=-29+i*5,z=25;const log=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,2.8,9),mat(0x6b5037));log.rotation.z=Math.PI/2;const base=terrainHeightAt(x,z);log.position.set(x,base+.34,z);log.castShadow=true;log.receiveShadow=true;scene.add(log);worldSolids.push(log);log.updateMatrixWorld(true);solidBounds.push(new THREE.Box3().setFromObject(log));obstacleColliders.push({kind:'box',x,z,halfX:1.4,halfZ:.34,minY:base,maxY:base+.68,jumpable:true});}
// A compact concrete outpost with an open entrance and firing windows.
floorPatch(38,-24,12,10,0x77796d,.035);
block(32.5,1.55,-24, .55,3.1,9,0x777b70);block(43.5,1.55,-24,.55,3.1,9,0x777b70);
block(38,1.55,-28.25,11,.55,.5,0x777b70);
block(34.1,1.55,-19.5,3.2,3.1,.55,0x777b70);block(41.9,1.55,-19.5,3.2,3.1,.55,0x777b70);
block(38,3.2,-24,11.5,.45,9.5,0x696f69);
for(const x of [34.5,37.8,41.1]){block(x,.55,-18.55,1.1,1.1,.42,0x9a8d70);}
for(let i=0;i<5;i++){const x=25+i*2.2;block(x,.48,-11,1.8,.96,.72,0x8b806b);}
for(let i=0;i<4;i++){const x=25+i*2.4;const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.95,12),mat(i%2?0x59645b:0x6e5540));const base=terrainHeightAt(x,-14.5);barrel.position.set(x,base+.475,-14.5);barrel.castShadow=true;barrel.receiveShadow=true;scene.add(barrel);worldSolids.push(barrel);barrel.updateMatrixWorld(true);solidBounds.push(new THREE.Box3().setFromObject(barrel));obstacleColliders.push({kind:'cylinder',x,z:-14.5,radius:.4,minY:base,maxY:base+.95,jumpable:true,mesh:barrel});}
// Additional traversable military buildings: grounded foundations, doorway gaps and solid wall colliders.
function addCombatBuilding(x,z,style='house'){
 const warehouse=style==='warehouse',base=terrainHeightAt(x,z);
 const w=warehouse?11:8.4,d=warehouse?9:8,h=warehouse?3.5:2.8,t=.42;
 floorPatch(x,z,w+1.1,d+1.1,warehouse?0x77796d:0x777b70,.045);
 // Rear and side walls.
 block(x, h/2,z-d/2+t/2,w,h,t,warehouse?0x777d76:0x9a927e);
 block(x-w/2+t/2,h/2,z,t,h,d-2*t,warehouse?0x777d76:0x9a927e);
 block(x+w/2-t/2,h/2,z,t,h,d-2*t,warehouse?0x777d76:0x9a927e);
 // Front wall leaves a proper entrance; the lintel sits above the opening.
 const doorW=warehouse?2.2:1.55,frontZ=z+d/2-t/2,sideW=(w-doorW)/2;
 block(x-w/2+sideW/2,h/2,frontZ,sideW,h,t,warehouse?0x777d76:0x9a927e);
 block(x+w/2-sideW/2,h/2,frontZ,sideW,h,t,warehouse?0x777d76:0x9a927e);
 block(x,h-.22,frontZ,doorW,.44,t,warehouse?0x626b65:0x77796d);
 // Flat reinforced roof and a raised ridge cap give each silhouette a distinct profile.
 block(x,h+.18,z,w+.55,.36,d+.55,warehouse?0x555e59:0x626a5d);
 if(!warehouse)block(x,h+.43,z, .24,.18,d+.25,0x4d594e);
 // Dark inset doorway and small awning are visual details; the opening remains walkable.
 const door=new THREE.Mesh(new THREE.PlaneGeometry(doorW-.18,h-.42),new THREE.MeshStandardMaterial({color:0x292f2a,roughness:1}));
 door.position.set(x, (h-.42)/2+.04, z+d/2+.012);scene.add(door);
 if(!warehouse){
  const awning=new THREE.Mesh(new THREE.BoxGeometry(doorW+.8,.16,.85),mat(0x59645a));
  awning.position.set(x,h-.12,z+d/2+.38);awning.castShadow=true;scene.add(awning);
  for(const sx of [-1,1]){
   const win=new THREE.Mesh(new THREE.PlaneGeometry(.95,.72),new THREE.MeshStandardMaterial({color:0x8ba6a4,roughness:.16,metalness:.32,transparent:true,opacity:.48,depthWrite:false,side:THREE.DoubleSide}));
   win.position.set(x+sx*2.35,1.75,z+d/2+.018);scene.add(win);
   const frameMat=mat(0xb1a78d);
   for(const [ox,oy,ww,hh] of [[0,.39,1.08,.09],[0,-.39,1.08,.09],[-.5,0,.09,.86],[.5,0,.09,.86]]){
    const frame=new THREE.Mesh(new THREE.BoxGeometry(ww,hh,.08),frameMat);frame.position.set(x+sx*2.35+ox,1.75+oy,z+d/2+.025);scene.add(frame);
   }
  }
 }
 // Surface wear, roof seams and reinforced window details add believable military architecture.
 const concreteDetail=new THREE.MeshStandardMaterial({color:0x77796f,map:surfaceMaps.concrete,roughness:.98});
 const metalDetail=new THREE.MeshStandardMaterial({color:0x46514d,roughness:.72,metalness:.28});
 for(const side of [-1,1]){
  const corner=new THREE.Mesh(new THREE.BoxGeometry(.12,h-.18,.12),metalDetail);corner.position.set(x+side*(w/2-.18),h/2,z-d/2-.025);corner.castShadow=true;scene.add(corner);
  if(!warehouse){const sill=new THREE.Mesh(new THREE.BoxGeometry(1.18,.09,.16),concreteDetail);sill.position.set(x+side*2.35,1.34,z+d/2+.07);sill.castShadow=true;scene.add(sill);}
 }
 for(let k=0;k<(warehouse?6:4);k++){const seam=new THREE.Mesh(new THREE.BoxGeometry(warehouse?1.45:1.15,.035,d+.25),metalDetail);seam.position.set(x-w/2+.8+k*(w-1.6)/Math.max(1,(warehouse?5:3)),h+.39,z);scene.add(seam);}
 const vent=new THREE.Mesh(new THREE.BoxGeometry(warehouse?1.5:.8,.55,.08),metalDetail);vent.position.set(x-w*.28,h*.72,z+d/2+.035);scene.add(vent);
 for(let q=0;q<3;q++){const slat=new THREE.Mesh(new THREE.BoxGeometry(warehouse?1.28:.62,.035,.1),concreteDetail);slat.position.set(x-w*.28,h*.72-.16+q*.14,z+d/2+.09);scene.add(slat);}

 // Furnished, traversable interiors: timber desks, storage racks, lamps and stair flights.
 const wood=new THREE.MeshStandardMaterial({color:0x72563a,roughness:.88,map:surfaceMaps.bark});
 const metal=new THREE.MeshStandardMaterial({color:0x4a514c,roughness:.72,metalness:.32});
 const furniture=(geo,material,px,py,pz)=>{const m=new THREE.Mesh(geo,material);m.position.set(x+px,base+py,z+pz);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;};
 if(!warehouse){
  furniture(new THREE.BoxGeometry(1.65,.12,.78),wood,-1.8,.88,-.75);
  for(const sx of [-.68,.68])for(const sz of [-.27,.27])furniture(new THREE.BoxGeometry(.09,.86,.09),metal,-1.8+sx,.42,-.75+sz);
  furniture(new THREE.BoxGeometry(.62,.58,.58),wood,2.55,.31,-1.15);
  furniture(new THREE.BoxGeometry(.62,.58,.58),wood,2.55,.31,.05);
  furniture(new THREE.BoxGeometry(.12,.9,.12),metal,-3.15,.45,-2.2);
  furniture(new THREE.SphereGeometry(.16,10,8),new THREE.MeshStandardMaterial({color:0xe5c78a,emissive:0x8b6937,emissiveIntensity:.5}),-3.15,1.02,-2.2);
  for(let k=0;k<4;k++)furniture(new THREE.BoxGeometry(.72,.18,.38),wood,3.1-k*.18,.09+k*.18,-2.45-k*.42);
 }else{
  for(const side of [-1,1]){furniture(new THREE.BoxGeometry(.85,1.65,3.8),metal,side*4.1,.85,-.3);for(let k=0;k<4;k++)furniture(new THREE.BoxGeometry(.95,.07,3.9),wood,side*4.1,.35+k*.38,-.3);}
  furniture(new THREE.BoxGeometry(2.1,.12,1.1),wood,-1.9,.8,-1.9);
  for(let k=0;k<5;k++)furniture(new THREE.BoxGeometry(.48,.48,.48),metal,-2.55+(k%3)*.58,.3+Math.floor(k/3)*.48,-1.9);
  for(let k=0;k<6;k++)furniture(new THREE.BoxGeometry(.85,.16,.42),wood,-3.6+k*.62,.08+k*.16,2.45-k*.28);
 }
 // Building foundation colliders are handled by the same solid block helper above.
}
addCombatBuilding(-14,-34,'house');
addCombatBuilding(15,17,'house');
addCombatBuilding(-37,5,'warehouse');

// Scenic road network: terrain-conforming asphalt ribbons, gravel shoulders and worn lane markings.
function terrainRoad(points,width=4,material=surfaceMaps.asphalt){
 const verts=[],uv=[],indices=[],steps=points.length*12;
 for(let i=0;i<=steps;i++){
  const t=i/steps*(points.length-1),seg=Math.min(points.length-2,Math.floor(t)),u=t-seg;
  const ax=points[seg][0],az=points[seg][1],bx=points[seg+1][0],bz=points[seg+1][1];
  const x=THREE.MathUtils.lerp(ax,bx,u),z=THREE.MathUtils.lerp(az,bz,u),dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz)||1,nx=-dz/len,nz=dx/len;
  for(const side of [-1,1]){const px=x+nx*width*.5*side,pz=z+nz*width*.5*side;verts.push(px,terrainHeightAt(px,pz)+.045,pz);uv.push(i/steps*5,side*.5+.5);}
  if(i<steps){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
 }
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
 const road=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0xffffff,map:material,roughness:.97,side:THREE.DoubleSide}));road.receiveShadow=true;scene.add(road);impactSurfaces.push(road);
}
terrainRoad([[-48,31],[-37,19],[-28,4],[-20,-9],[-7,-22],[8,-28],[23,-22],[36,-10],[47,5]],4.6);
terrainRoad([[-39,-29],[-26,-27],[-13,-31],[0,-38],[16,-40],[31,-34],[45,-27]],3.1);
terrainRoad([[-43,37],[-29,32],[-16,28],[-3,22],[10,18],[24,12],[39,5]],2.5);
function roadsideMarker(x,z,label){
 const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');
 ctx.fillStyle='#202923';ctx.fillRect(0,0,512,128);ctx.strokeStyle='#b9b18e';ctx.lineWidth=7;ctx.strokeRect(5,5,502,118);
 ctx.fillStyle='#e1ddc9';ctx.font='bold 42px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,256,66);
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
 const board=new THREE.Mesh(new THREE.PlaneGeometry(4.8,1.2),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));
 board.position.set(x,terrainHeightAt(x,z)+2.65,z);board.rotation.y=-.25;scene.add(board);
 for(const dx of [-1.8,1.8]){const post=new THREE.Mesh(new THREE.BoxGeometry(.12,2.4,.12),mat(0x4a5148));post.position.set(x+dx,terrainHeightAt(x,z)+1.2,z);post.castShadow=true;scene.add(post);}
}
roadsideMarker(-27,-12,'NORTH RIDGE');roadsideMarker(22,-31,'FIELD DEPOT');roadsideMarker(-24,30,'WEST OUTPOST');
// A timber-and-steel observation tower creates a strong skyline landmark and a new sightline.
let towerClimb=null,towerClimbActive=false,towerClimbSpaceHeld=false;
function observationTower(x,z){
 const base=terrainHeightAt(x,z),steel=mat(0x414b47),wood=mat(0x66543d);
 for(const dx of [-1.65,1.65])for(const dz of [-1.5,1.5]){
  const leg=new THREE.Mesh(new THREE.BoxGeometry(.22,6.2,.22),steel);leg.position.set(x+dx,base+3.1,z+dz);leg.rotation.z=dx*.055;leg.castShadow=true;leg.receiveShadow=true;scene.add(leg);
 }
 const deck=new THREE.Mesh(new THREE.BoxGeometry(4.1,.28,3.8),wood);deck.position.set(x,base+5.8,z);deck.castShadow=true;deck.receiveShadow=true;scene.add(deck);
 obstacleColliders.push({kind:'box',x,z,halfX:2.05,halfZ:1.9,minY:base+5.66,maxY:base+5.94,jumpable:false});
 towerClimb={x,z,base,ladderX:x+2.05,deckY:base+5.94};
 for(const y of [6.35,7.45])for(const side of [-1,1]){const rail=new THREE.Mesh(new THREE.BoxGeometry(4.05,.12,.12),steel);rail.position.set(x,base+y,z+side*1.82);scene.add(rail);}
 for(let i=0;i<9;i++){const rung=new THREE.Mesh(new THREE.BoxGeometry(.9,.09,.12),steel);rung.position.set(x+2.05,base+.55+i*.58,z);scene.add(rung);}
 const roof=new THREE.Mesh(new THREE.BoxGeometry(4.6,.2,4.2),mat(0x46534b));roof.position.set(x,base+7.8,z);roof.castShadow=true;scene.add(roof);
 const beacon=new THREE.Mesh(new THREE.SphereGeometry(.18,10,8),new THREE.MeshStandardMaterial({color:0xe1a35d,emissive:0x8d4c20,emissiveIntensity:.7}));beacon.position.set(x,base+8.05,z);scene.add(beacon);
}
observationTower(-5,-43);
// Ruined perimeter walls and stacked supply pallets add layered cover between the named areas.
for(let i=0;i<7;i++){const x=-46+i*2.1,z=22+(i%2)*.8;block(x,.48,z,1.9,.96,.38,i%2?0x77796f:0x8c806d);}
for(let i=0;i<5;i++){const x=27+i*1.45,z=34-(i%2)*1.1;block(x,.42,z,1.25,.84,.95,0x786448);}

// Jagged boulder fields on the ridge approaches; each rock has a matching movement collider.
function boulderField(cx,cz,count,spread,seed=1){for(let i=0;i<count;i++){const a=i*2.399+seed,r=spread*(.22+.78*((i*7%13)/13)),x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r,base=terrainHeightAt(x,z),sx=.65+(i%3)*.28,sy=.7+(i%4)*.25,sz=.6+(i%2)*.35;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(1,1),mat(i%3===0?0x77786b:0x686d62));rock.scale.set(sx,sy,sz);rock.position.set(x,base+sy*.72,z);rock.rotation.set(.1*i,.37*i,.08*i);rock.castShadow=true;rock.receiveShadow=true;scene.add(rock);worldSolids.push(rock);rock.updateMatrixWorld(true);solidBounds.push(new THREE.Box3().setFromObject(rock));obstacleColliders.push({kind:'rock',x,z,radius:Math.max(sx,sz)*.72,minY:base,maxY:base+sy*1.72,jumpable:true,mesh:rock});impactSurfaces.push(rock);}}
boulderField(-23,-23,11,8,2);boulderField(14,-35,9,7,4);boulderField(-31,23,10,8,6);
// Additional waist-high barriers, broken walls and staggered concrete blocks.
for(let i=0;i<5;i++){const x=-7+i*3.1,z=-17+(i%2)*1.2;block(x,.62,z,2.35,1.24,.62,0x77796f);}
for(let i=0;i<4;i++){const x=19+i*2.2,z=5+(i%2)*1.5;block(x,.9,z,1.1,1.8,1.1,0x777b70);}
for(let i=0;i<3;i++){const x=-43+i*2.4,z=-5+i*2.8;block(x,1.05,z,1.7,2.1,1.2,0x827b68);}



/* ALPHA 4.0 — atmospheric sky, distant ridges and environmental detail */
const skyCanvas=document.createElement('canvas');skyCanvas.width=512;skyCanvas.height=256;
const skyCtx=skyCanvas.getContext('2d'),skyGrad=skyCtx.createLinearGradient(0,0,0,256);
skyGrad.addColorStop(0,'#527b9a');skyGrad.addColorStop(.58,'#b8c6c2');skyGrad.addColorStop(1,'#e0d8bd');skyCtx.fillStyle=skyGrad;skyCtx.fillRect(0,0,512,256);
for(let i=0;i<18;i++){const x=(i*83)%512,y=32+(i*47)%115;skyCtx.fillStyle='rgba(255,255,255,.10)';skyCtx.beginPath();skyCtx.ellipse(x,y,35+(i%4)*13,8+(i%3)*5,0,0,Math.PI*2);skyCtx.fill();}
const skyTex=new THREE.CanvasTexture(skyCanvas);skyTex.colorSpace=THREE.SRGBColorSpace;
const skyDome=new THREE.Mesh(new THREE.SphereGeometry(170,32,18),new THREE.MeshBasicMaterial({map:skyTex,side:THREE.BackSide,depthWrite:false}));scene.add(skyDome);
function distantRidge(x,z,sx,sy,sz,color,seed){const m=new THREE.Mesh(new THREE.ConeGeometry(1,1,7,3),new THREE.MeshStandardMaterial({color,roughness:1,flatShading:true}));m.scale.set(sx,sy,sz);m.position.set(x,sy*.43,z);m.rotation.y=seed;scene.add(m);}
for(let i=0;i<18;i++){const a=i*Math.PI*2/18,r=112+(i%4)*5;distantRidge(Math.cos(a)*r,-Math.sin(a)*r,12+(i%5)*5,17+(i%4)*8,15+(i%3)*6,i%2?0x65766f:0x78877e,i*.37);}
const windParticles=[];
for(let i=0;i<36;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.045,4,4),new THREE.MeshBasicMaterial({color:0xc5c6a5,transparent:true,opacity:.12}));m.position.set((Math.random()-.5)*95,1+Math.random()*8,(Math.random()-.5)*95);scene.add(m);windParticles.push(m);}
function makeRifle(color=0x202723){const g=new THREE.Group();const add=(geo,c,p)=>{const m=new THREE.Mesh(geo,mat(c));m.position.set(...p);m.castShadow=true;g.add(m);};add(new THREE.BoxGeometry(.14,.14,.92),color,[0,0,0]);add(new THREE.BoxGeometry(.11,.22,.17),0x171d1a,[0,-.16,.12]);add(new THREE.BoxGeometry(.1,.18,.13),0x252c27,[0,-.14,-.2]);add(new THREE.CylinderGeometry(.035,.035,.42,8),0x111715,[0,0,-.65]);add(new THREE.BoxGeometry(.22,.055,.12),0x171d1a,[0,.1,-.05]);return g;}
function soldierVisual(g,uniformColor=0x35483b,vestColor=0x26352d,skinColor=0xb58d70){const visual=new THREE.Group();g.add(visual);const body=new THREE.Group();visual.add(body);const add=(geo,color,pos,rot)=>{const m=new THREE.Mesh(geo,mat(color));m.position.set(...pos);if(rot)m.rotation.set(...rot);m.castShadow=true;m.receiveShadow=true;body.add(m);return m;};
 // Layered torso, neck and tactical armor.
 add(new THREE.CapsuleGeometry(.34,.68,5,9),uniformColor,[0,1.05,0]);
 add(new THREE.CylinderGeometry(.13,.15,.18,9),skinColor,[0,1.53,0]);
 // Legs, knee pads and boots make the full soldier silhouette read clearly at distance.
 const legs=[];
 for(const side of [-1,1]){
   const pivot=new THREE.Group();pivot.position.set(side*.19,.72,.015);visual.add(pivot);
   const upper=new THREE.Mesh(new THREE.CapsuleGeometry(.145,.56,4,8),mat(uniformColor));upper.position.y=-.29;upper.castShadow=true;upper.receiveShadow=true;pivot.add(upper);
   const knee=new THREE.Mesh(new THREE.BoxGeometry(.23,.16,.31),mat(0x303b32));knee.position.set(0,-.33,-.12);knee.castShadow=true;pivot.add(knee);
   const boot=new THREE.Mesh(new THREE.BoxGeometry(.25,.16,.42),mat(0x242a25));boot.position.set(0,-.62,-.055);boot.castShadow=true;pivot.add(boot);
   const pad=new THREE.Mesh(new THREE.BoxGeometry(.16,.22,.12),mat(0x4a5546));pad.position.set(0,-.03,-.12);pad.castShadow=true;pivot.add(pad);
   legs.push({pivot,side});
 }
 add(new THREE.BoxGeometry(.66,.62,.34),vestColor,[0,1.13,-.025]);
 add(new THREE.BoxGeometry(.7,.12,.38),0x17231e,[0,.78,0]);
 add(new THREE.SphereGeometry(.215,12,10),skinColor,[0,1.77,-.015]);
 add(new THREE.SphereGeometry(.265,12,9,0,Math.PI*2,0,Math.PI*.58),0x344238,[0,1.88,0]);
 add(new THREE.BoxGeometry(.44,.09,.31),0x202b25,[0,1.78,-.17]);
 add(new THREE.BoxGeometry(.31,.075,.035),0x8b9a8b,[0,1.77,-.193]);
 add(new THREE.BoxGeometry(.34,.42,.2),0x26362e,[0,1.18,.29]);
 add(new THREE.BoxGeometry(.09,.48,.045),0x9b875e,[-.19,1.18,-.205]);
 add(new THREE.BoxGeometry(.09,.48,.045),0x9b875e,[.19,1.18,-.205]);
 for(let j=0;j<3;j++)add(new THREE.BoxGeometry(.14,.16,.1),0x4b5b45,[(j-1)*.17,.94,-.23]);
 // Shoulder plates, radio, utility belt and small field equipment.
 for(const side of [-1,1]){add(new THREE.SphereGeometry(.19,9,7),0x465345,[side*.39,1.42,-.02]);add(new THREE.BoxGeometry(.16,.22,.13),0x4c5945,[side*.37,1.02,.2]);}
 add(new THREE.BoxGeometry(.16,.3,.12),0x202a25,[.23,1.42,.22]);
 add(new THREE.BoxGeometry(.12,.08,.08),0xb49a63,[0,.78,-.22]);
 // Arms pivot at shoulders: relaxed at the sides, then swing forward to hold the rifle
 const arms=[],elbows=[];
 for(const side of [-1,1]){const pivot=new THREE.Group();pivot.position.set(side*.39,1.43,-.015);visual.add(pivot);const upper=new THREE.Mesh(new THREE.CapsuleGeometry(.125,.48,4,8),uniformColor);upper.position.y=-.29;upper.castShadow=true;pivot.add(upper);const glove=new THREE.Mesh(new THREE.SphereGeometry(.13,9,7),mat(0x303b33));glove.position.set(0,-.59,-.015);glove.castShadow=true;pivot.add(glove);arms.push({pivot,side});}
 const backRifle=makeRifle(0x202723);backRifle.position.set(-.23,1.38,.28);backRifle.rotation.set(.12,0,-.22);visual.add(backRifle);
 const heldRifle=makeRifle(0x202723);heldRifle.position.set(.34,1.27,-.39);heldRifle.rotation.set(0,0,0);heldRifle.visible=false;visual.add(heldRifle);
 return {arms,elbows,legs,backRifle,heldRifle,gait:0,body,visual};
}
function setSoldierPose(rig,active,dt,hasWeapon=true,moving=false,sprinting=false,airborne=false,stanceMode='stand'){if(!rig)return;const target=active&&hasWeapon?1:0;const speed=Math.min(1,dt*11);rig.backRifle.visible=hasWeapon&&target<.5;rig.heldRifle.visible=hasWeapon&&target>=.5;const gait=moving?Math.sin(rig.gait):0,amp=airborne?.18:(sprinting?.82:.58),crouch=stanceMode==='crouch',prone=stanceMode==='prone';for(const a of rig.arms){const aimX=active?(prone?1.65:crouch?1.32:1.12):.08-gait*amp*.62,aimZ=active?-a.side*.34:-a.side*.08;a.pivot.rotation.x=THREE.MathUtils.lerp(a.pivot.rotation.x,aimX,speed);a.pivot.rotation.z=THREE.MathUtils.lerp(a.pivot.rotation.z,aimZ,speed);}for(const leg of rig.legs||[]){const swing=moving?Math.sin(rig.gait+(leg.side<0?Math.PI:0))*amp:0;leg.pivot.rotation.x=THREE.MathUtils.lerp(leg.pivot.rotation.x,airborne?-.28:(prone?1.35:crouch?1.02:swing),speed);leg.pivot.rotation.z=THREE.MathUtils.lerp(leg.pivot.rotation.z,moving?leg.side*.035:0,speed);}for(const e of rig.elbows||[]){const bend=active?(stanceMode==='prone'?.72:stanceMode==='crouch'?.58:.48):.12;e.pivot.rotation.x=THREE.MathUtils.lerp(e.pivot.rotation.x,bend,speed);e.pivot.rotation.z=THREE.MathUtils.lerp(e.pivot.rotation.z,e.side*.035,speed);}if(rig.body){rig.body.position.y=THREE.MathUtils.lerp(rig.body.position.y,prone?-.62:crouch?-.28:moving?Math.abs(Math.sin(rig.gait*2))*(sprinting?.055:.028):0,speed);rig.body.rotation.x=THREE.MathUtils.lerp(rig.body.rotation.x,prone?1.12:crouch?.28:sprinting?-.085:(moving?-.025:0),speed);rig.body.rotation.z=THREE.MathUtils.lerp(rig.body.rotation.z,moving?Math.sin(rig.gait)*.018:0,speed);} }
const player=new THREE.Group();scene.add(player);const playerRig=soldierVisual(player,0x46594a,0x293a31,0xb58d70);playerRig.visual.scale.setScalar(.44);let weaponOutUntil=0,moveBlend=0,gaitTime=0;const lobbyOperator=new THREE.Group();const lobbyRig=soldierVisual(lobbyOperator,0x46594a,0x293a31,0xb58d70);lobbyRig.visual.scale.setScalar(.44);lobbyOperator.position.set(0,terrainHeightAt(0,0),0);lobbyRig.backRifle.visible=true;lobbyRig.heldRifle.visible=false;scene.add(lobbyOperator);player.visible=false;const defs=[['突擊步槍',30,150,25,115,1450,.012,1,'全自動 · 中距離'],['狙擊步槍',5,35,100,900,1900,.001,1,'高傷害 · 精準射擊'],['手槍',12,72,34,280,1050,.018,1,'半自動 · 快速切換'],['霰彈槍',6,36,17,650,1550,.075,8,'近距離 · 8 發散射']];
const weapons=defs.map(a=>({name:a[0],mag:a[1],ammo:0,reserve:0,damage:a[3],rate:a[4],reload:a[5],spread:a[6],pellets:a[7],hint:a[8]}));
const ownedWeapons=[false,false,false,false];
let wi=0,hp=100,kills=0,medKits=0,inventoryOpen=false,paused=false,pickupRequested=false,yaw=0,pitch=-.08,vy=0,grounded=true,supportY=0,supportRock=null,aim=false,locked=false,hadLock=false,started=false,dead=false,reloading=false,lastShot=0,elapsed=0,fireHeld=false,scopeUpgrade=false;
let stance='stand',recoil=0,footstepClock=0,audioCtx=null,masterGain=null,vaultTime=0,damageFlash=0,hitReact=0;const tracers=[];
const keys={},enemies=[],bullets=[],pickups=[],ray=new THREE.Raycaster();
setSoldierPose(playerRig,false,1,false);
const supportRay=new THREE.Raycaster();const supportDown=new THREE.Vector3(0,-1,0);
function rockTopAt(o,x,z){if(!o.mesh)return null;const dx=x-o.x,dz=z-o.z,reach=(o.supportRadius||o.radius)+.72;if(dx*dx+dz*dz>reach*reach)return null;o.mesh.updateMatrixWorld(true);supportRay.set(new THREE.Vector3(x,o.maxY+2,z),supportDown);supportRay.far=o.maxY-o.minY+4;const hit=supportRay.intersectObject(o.mesh,true)[0];return hit?hit.point.y:null;}
// Sample the whole foot area, not only the actor's center. This prevents edge pixels
// and corners of irregular boulders from dropping support for a single frame.
function rockSupportAt(o,x,z,referenceY){const samples=[[0,0],[.27,0],[-.27,0],[0,.27],[0,-.27],[.19,.19],[.19,-.19],[-.19,.19],[-.19,-.19]];let best=null;for(const [sx,sz] of samples){const top=rockTopAt(o,x+sx,z+sz);if(top===null||Math.abs(top-referenceY)>.82)continue;if(best===null||top>best)best=top;}return best;}
const impactEffects=[];const sparkGeo=new THREE.SphereGeometry(.035,5,5),flashGeo=new THREE.SphereGeometry(.12,7,6),impactRingGeo=new THREE.RingGeometry(.09,.2,12);const sparkMat=new THREE.MeshBasicMaterial({color:0xffc56b}),flashMat=new THREE.MeshBasicMaterial({color:0xffefc2,transparent:true,opacity:.95}),ringMat=new THREE.MeshBasicMaterial({color:0xffa94d,transparent:true,opacity:.8,side:THREE.DoubleSide});
function spawnImpact(point,normal=new THREE.Vector3(0,1,0),kind='solid'){const group=new THREE.Group();group.position.copy(point);const flash=new THREE.Mesh(flashGeo,flashMat.clone());flash.material.opacity=kind==='enemy'?.9:.8;group.add(flash);const ring=new THREE.Mesh(impactRingGeo,ringMat.clone());ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),normal.clone().normalize());group.add(ring);scene.add(group);const sparks=[];const count=kind==='enemy'?5:7;for(let i=0;i<count;i++){const mesh=new THREE.Mesh(sparkGeo,sparkMat);mesh.position.set((Math.random()-.5)*.12,(Math.random()-.5)*.12,(Math.random()-.5)*.12);group.add(mesh);const dir=normal.clone().add(new THREE.Vector3((Math.random()-.5)*1.8,Math.random()*.9,(Math.random()-.5)*1.8)).normalize();sparks.push({mesh,velocity:dir.multiplyScalar(2+Math.random()*4)});}impactEffects.push({group,flash,ring,sparks,life:.24,maxLife:.24});}
function updateImpacts(dt){for(let i=impactEffects.length-1;i>=0;i--){const e=impactEffects[i];e.life-=dt;const t=Math.max(0,e.life/e.maxLife);e.flash.scale.setScalar(1+(1-t)*1.8);e.flash.material.opacity=t*.9;e.ring.scale.setScalar(1+(1-t)*1.8);e.ring.material.opacity=t*.8;for(const p of e.sparks){p.mesh.position.addScaledVector(p.velocity,dt);p.velocity.y-=9*dt;p.mesh.scale.setScalar(Math.max(.08,t));}if(e.life<=0){scene.remove(e.group);e.group.traverse(o=>{if(o.material&&o.material!==sparkMat)o.material.dispose();});impactEffects.splice(i,1);}}}
const pickupDefs=[{type:'mag',color:0xd6b34d,pos:[-8,0,4]},{type:'scope',color:0x70b6c8,pos:[8,0,5]},{type:'med',color:0x9cce78,pos:[0,0,20]},
 {type:'weapon',weaponIndex:0,color:0x9b9b62,pos:[-37,0,5]},{type:'weapon',weaponIndex:1,color:0x7b8e9d,pos:[-34.2,0,4.1]},{type:'weapon',weaponIndex:2,color:0x9b7956,pos:[-39.5,0,3.4]},{type:'weapon',weaponIndex:3,color:0x7e805c,pos:[-36.8,0,7.3]},
 {type:'weapon',weaponIndex:0,color:0x9b9b62,pos:[-14,0,-34]},{type:'weapon',weaponIndex:2,color:0x9b7956,pos:[15,0,17]},{type:'weapon',weaponIndex:1,color:0x7b8e9d,pos:[-30,0,-13]},{type:'weapon',weaponIndex:3,color:0x7e805c,pos:[21,0,7]}];
function addPickup(def){const g=new THREE.Group(),base=terrainHeightAt(def.pos[0],def.pos[2]);if(def.type==='weapon'){const gun=makeRifle(def.color);gun.scale.set(.8,.8,.8);gun.rotation.y=Math.PI/2;gun.position.y=.42;g.add(gun);}else{const box=new THREE.Mesh(new THREE.BoxGeometry(.72,.38,.55),mat(def.color));box.position.y=.35;box.castShadow=false;g.add(box);const band=new THREE.Mesh(new THREE.BoxGeometry(.12,.4,.58),mat(0x263129));band.position.y=.35;g.add(band);}const ring=new THREE.Mesh(new THREE.TorusGeometry(.58,.035,6,16),new THREE.MeshBasicMaterial({color:def.color}));ring.rotation.x=Math.PI/2;ring.position.y=.06;g.add(ring);g.position.set(def.pos[0],base+def.pos[1],def.pos[2]);scene.add(g);const collider=new THREE.Mesh(new THREE.BoxGeometry(.92,1.05,.82),new THREE.MeshBasicMaterial({visible:false}));collider.position.set(def.pos[0],base+.52,def.pos[2]);scene.add(collider);const pickupBox=new THREE.Box3().setFromCenterAndSize(collider.position.clone(),new THREE.Vector3(.92,1.05,.82));pickupBounds.push({collider,box:pickupBox});pickups.push({def,group:g,collider,active:true});}
pickupDefs.forEach(addPickup);
const enemyMats=[0x665448,0x4c5d50,0x625c4b,0x4c5257,0x66504a];
function addEnemy(x,z,i){const g=new THREE.Group();const rig=soldierVisual(g,enemyMats[i%5],i%2?0x303b35:0x3b3930,0x9c765e);rig.visual.scale.setScalar(.44);const hitbox=new THREE.Mesh(new THREE.BoxGeometry(.42,.9,.36),new THREE.MeshBasicMaterial({visible:false}));hitbox.position.y=.46;hitbox.userData.enemy=g;g.add(hitbox);const floor=terrainHeightAt(x,z);g.position.set(x,floor,z);scene.add(g);const e={group:g,rig,weaponOutUntil:0,hitbox,hp:100,alive:true,cooldown:1+Math.random()*1.4,phase:Math.random()*6,spawn:new THREE.Vector3(x,floor,z)};g.userData.enemy=e;hitbox.userData.enemy=e;enemies.push(e);}
[[-19,-22],[19,-23],[-25,18],[25,17],[0,-36]].forEach((p,i)=>addEnemy(p[0],p[1],i));
function hud(){const w=weapons[wi],has=ownedWeapons[wi];document.querySelector('#hp').textContent=Math.ceil(hp);document.querySelector('#kills').textContent=kills;document.querySelector('#left').textContent=enemies.filter(e=>e.alive).length;document.querySelector('#weapon').textContent=has?w.name:'尚未取得武器';document.querySelector('#ammo').textContent=has?w.ammo:'—';document.querySelector('#reserve').textContent=has?'/ '+w.reserve+(reloading?' · 裝填中':''):'/ —';document.querySelector('#hint').textContent=has?w.hint:'探索建築與倉庫，按 F 拾取武器';document.querySelector('#damage').style.opacity=hp<45?String((45-hp)/60):'0';}
let toastTimer;function toast(s){const el=document.querySelector('#toast');el.textContent=s;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),1100);}

function initAudio(){
 if(audioCtx){if(audioCtx.state==='suspended')audioCtx.resume();return;}
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audioCtx=new AC();masterGain=audioCtx.createGain();masterGain.gain.value=.28;masterGain.connect(audioCtx.destination);
 const length=audioCtx.sampleRate*2,buffer=audioCtx.createBuffer(1,length,audioCtx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*.22;
 const noise=audioCtx.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=360;const wind=audioCtx.createGain();wind.gain.value=.055;noise.connect(filter);filter.connect(wind);wind.connect(masterGain);noise.start();
}
function tone(freq,duration,type='sine',gain=.12,slide=0){if(!audioCtx)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,audioCtx.currentTime);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,freq+slide),audioCtx.currentTime+duration);g.gain.setValueAtTime(gain,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(masterGain);o.start();o.stop(audioCtx.currentTime+duration);}
function noiseBurst(duration=.12,gain=.16,cutoff=1800){if(!audioCtx)return;const n=audioCtx.createBufferSource(),b=audioCtx.createBuffer(1,Math.floor(audioCtx.sampleRate*duration),audioCtx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);n.buffer=b;const f=audioCtx.createBiquadFilter();f.type='lowpass';f.frequency.value=cutoff;const g=audioCtx.createGain();g.gain.value=gain;n.connect(f);f.connect(g);g.connect(masterGain);n.start();}
function playGunshot(index=0){noiseBurst(.19,index===1?.28:.2,index===1?850:2400);tone(index===1?58:82,.18,'sawtooth',.2,-42);tone(index===1?125:185,.07,'triangle',.12,-90);if(audioCtx){const delay=audioCtx.createDelay(.35);delay.delayTime.value=.095;const echo=audioCtx.createGain();echo.gain.value=.16;masterGain.connect(delay);delay.connect(echo);echo.connect(masterGain);setTimeout(()=>{try{delay.disconnect();echo.disconnect();}catch{}},420);}}function playImpactThud(){noiseBurst(.09,.12,520);tone(48,.11,'sine',.12,-40);}
function playFootstep(sprint=false){noiseBurst(.055,sprint?.09:.055,420);tone(sprint?68:54,.07,'sine',.08,-18);}
function playReload(){tone(520,.045,'square',.045,-150);setTimeout(()=>tone(360,.06,'square',.05,-100),240);setTimeout(()=>tone(620,.055,'square',.05,-240),700);}
function addTracer(from,to){const geo=new THREE.BufferGeometry().setFromPoints([from,to]),material=new THREE.LineBasicMaterial({color:0xffd69a,transparent:true,opacity:.85});const line=new THREE.Line(geo,material);scene.add(line);tracers.push({line,life:.095,max:.095});}
function updateTracers(dt){for(let i=tracers.length-1;i>=0;i--){const t=tracers[i];t.life-=dt;t.line.material.opacity=Math.max(0,t.life/t.max);if(t.life<=0){scene.remove(t.line);t.line.geometry.dispose();t.line.material.dispose();tracers.splice(i,1);}}}
function reload(){if(inventoryOpen||paused||!ownedWeapons[wi])return;const w=weapons[wi];weaponOutUntil=performance.now()+1700;if(reloading||w.ammo===w.mag||!w.reserve||dead)return;reloading=true;playReload();hud();toast('重新裝填…');setTimeout(()=>{if(!started)return;const n=Math.min(w.mag-w.ammo,w.reserve);w.ammo+=n;w.reserve-=n;reloading=false;hud();},w.reload);}
function shoot(){const w=weapons[wi],now=performance.now();if(!started||dead||inventoryOpen||paused||!ownedWeapons[wi]||reloading||now-lastShot<w.rate)return;lastShot=now;weaponOutUntil=now+1450;recoil=Math.min(.11,recoil+(wi===1?.075:.032));playGunshot(wi);if(!w.ammo){if(fireHeld&&wi===0)toast('彈匣已空 · 按 R 裝填');return;}w.ammo--;const dir=new THREE.Vector3();camera.getWorldDirection(dir);for(let i=0;i<w.pellets;i++){const d=dir.clone(),stanceAccuracy=stance==='prone'?.48:stance==='crouch'?.76:1;d.x+=(Math.random()-.5)*w.spread*(scopeUpgrade ? .62 : 1)*stanceAccuracy;d.y+=(Math.random()-.5)*w.spread*(scopeUpgrade ? .62 : 1)*stanceAccuracy;ray.set(camera.position,d.normalize());ray.far=90;const wallHit=ray.intersectObjects([...worldSolids,...impactSurfaces],false)[0];const enemyHit=ray.intersectObjects(enemies.filter(e=>e.alive).map(e=>e.hitbox))[0];const tracerEnd=enemyHit&&(!wallHit||enemyHit.distance<wallHit.distance)?enemyHit.point:(wallHit?wallHit.point:camera.position.clone().addScaledVector(d,55));addTracer(camera.position,tracerEnd);if(enemyHit&&(!wallHit||enemyHit.distance<wallHit.distance)){const e=enemyHit.object.userData.enemy;spawnImpact(enemyHit.point,d.clone().negate(),'enemy');e.hp-=w.damage;const mark=document.querySelector('#hit');mark.classList.add('show');setTimeout(()=>mark.classList.remove('show'),100);if(e.hp<=0){e.alive=false;e.group.visible=false;kills++;toast('敵人已擊倒');}}else if(wallHit){const normal=wallHit.face?wallHit.face.normal.clone().transformDirection(wallHit.object.matrixWorld):d.clone().negate();spawnImpact(wallHit.point,normal,'solid');}}hud();}
function enemyShoot(e){e.weaponOutUntil=performance.now()+850;const start=e.group.position.clone().add(new THREE.Vector3(0,1.2,0)),target=player.position.clone().add(new THREE.Vector3(0,1,0));const mesh=new THREE.Mesh(new THREE.SphereGeometry(.085,6,6),new THREE.MeshBasicMaterial({color:0xffbd68}));mesh.position.copy(start);scene.add(mesh);bullets.push({mesh,dir:target.sub(start).normalize(),life:2.6});}
function hurt(n){if(dead)return;hp=Math.max(0,hp-n);damageFlash=Math.min(1,damageFlash+.72);hitReact=.28;playImpactThud();hud();if(hp===0){dead=true;playerRig.body.rotation.x=-.85;playerRig.body.position.y=-.28;playerRig.legs.forEach(l=>l.pivot.rotation.x=1.15);document.querySelector('#desc').textContent='本次擊倒 '+kills+' 名敵人。重新部署，再試一次。';document.querySelector('#start').textContent='重新開始';document.querySelector('#overlay').classList.add('visible');document.exitPointerLock?.();}}
function canActorStep(x,z,currentY,radius=.38,height=1.8,canJump=true){if(x< -49||x>49||z< -44||z>44)return false;const nextFloor=terrainHeightAt(x,z);if(nextFloor-currentY>.62)return false;const bottom=currentY,top=bottom+height;for(const o of obstacleColliders){if(top<=o.minY+.02||bottom>=o.maxY-.02)continue;if(o.kind==='rock'||o.kind==='cylinder'){const dx=x-o.x,dz=z-o.z,reach=radius+o.radius+.12;if(dx*dx+dz*dz>reach*reach)continue;const footTop=rockSupportAt(o,x,z,bottom);if(footTop!==null&&bottom>=footTop-.24)continue;}else if(o.jumpable&&bottom>=o.maxY-.04)continue;if(o.kind==='hill'){const nx=(x-o.x)/o.rx,nz=(z-o.z)/o.rz;if(nx*nx+nz*nz<1)return false;}else if(o.kind==='circle'||o.kind==='rock'||o.kind==='cylinder'){const rr=radius+o.radius;if((x-o.x)**2+(z-o.z)**2<rr*rr)return false;}else{const cx=Math.max(o.x-o.halfX,Math.min(x,o.x+o.halfX)),cz=Math.max(o.z-o.halfZ,Math.min(z,o.z+o.halfZ));if((x-cx)**2+(z-cz)**2<radius*radius)return false;}}return true;}
function ai(dt){for(const e of enemies){if(!e.alive)continue;const p=e.group.position,dx=player.position.x-p.x,dz=player.position.z-p.z,d=Math.hypot(dx,dz);e.phase+=dt;e.cooldown-=dt;e.group.rotation.y=Math.atan2(dx,dz);let mx=0,mz=0;if(d>9){const speed=d>28?2.4:1.1;mx=dx/Math.max(d,.001)*speed*dt;mz=dz/Math.max(d,.001)*speed*dt;}else{mx=Math.sin(e.phase*1.7)*.5*dt;mz=Math.cos(e.phase*1.4)*.5*dt;}if(canActorStep(p.x+mx,p.z,p.y,.34,1.9,false))p.x+=mx;if(canActorStep(p.x,p.z+mz,p.y,.34,1.9,false))p.z+=mz;p.y=terrainHeightAt(p.x,p.z);if(d<32&&e.cooldown<=0){enemyShoot(e);e.cooldown=1.5+Math.random()*.8;}setSoldierPose(e.rig,performance.now()<e.weaponOutUntil,dt);}}
function updateBullets(dt){for(let i=bullets.length-1;i>=0;i--){const b=bullets[i],from=b.mesh.position.clone(),travel=b.dir.clone().multiplyScalar(dt*19),to=from.clone().add(travel);ray.set(from,b.dir);ray.far=travel.length();const wall=ray.intersectObjects([...worldSolids,...impactSurfaces],false)[0];if(wall){spawnImpact(wall.point,wall.face?wall.face.normal.clone().transformDirection(wall.object.matrixWorld):b.dir.clone().negate(),'solid');b.life=0;}else{b.mesh.position.copy(to);b.life-=dt;if(b.mesh.position.distanceTo(player.position.clone().add(new THREE.Vector3(0,1,0)))<.8){spawnImpact(b.mesh.position,b.dir.clone().negate(),'enemy');hurt(7);b.life=0;}}if(b.life<=0){scene.remove(b.mesh);bullets.splice(i,1);}}}
function collectPickups(){let nearest=null,nearestD=2.8;for(const p of pickups){if(!p.active)continue;const d=player.position.distanceTo(p.group.position);if(d<nearestD){nearest=p;nearestD=d;}}const prompt=document.querySelector('#pickupPrompt');if(prompt)prompt.textContent=nearest?(nearest.def.type==='weapon'?'按 F 拾取 '+defs[nearest.def.weaponIndex][0]:'按 F 拾取 '+({mag:'擴容彈匣',scope:'二倍鏡',med:'醫療包'}[nearest.def.type])):'';if(!nearest){pickupRequested=false;return;}if(!pickupRequested)return;pickupRequested=false;const p=nearest;p.active=false;p.group.visible=false;const pi=pickupBounds.findIndex(v=>v.collider===p.collider);if(pi>=0)pickupBounds.splice(pi,1);if(p.def.type==='weapon'){const i=p.def.weaponIndex,w=weapons[i];if(ownedWeapons[i]){w.reserve+=Math.round(w.mag*.75);toast('已拾取 '+w.name+' 彈藥');}else{ownedWeapons[i]=true;w.ammo=w.mag;w.reserve=Math.round(defs[i][2]*.4);wi=i;toast('已裝備 '+w.name+'！');}setSoldierPose(playerRig,false,1,ownedWeapons[wi]);}else if(p.def.type==='mag'){weapons.forEach((w,i)=>{if(ownedWeapons[i]){w.mag=Math.round(defs[i][1]*1.5);w.ammo=Math.min(w.mag,w.ammo+Math.round(w.mag*.5));w.reserve+=Math.round(w.mag*.5);}});toast('已拾取：擴容彈匣');}else if(p.def.type==='scope'){scopeUpgrade=true;toast('已拾取：二倍鏡（瞄準時 2 倍）');}else{medKits++;toast('已拾取：醫療包 ×1（按 H 使用）');}hud();renderInventory();}
function resetPickups(){medKits=0;pickupBounds.length=0;pickups.forEach(p=>{p.active=true;p.group.visible=true;pickupBounds.push({collider:p.collider,box:new THREE.Box3().setFromCenterAndSize(p.collider.position.clone(),new THREE.Vector3(.92,1.05,.82))});});scopeUpgrade=false;ownedWeapons.fill(false);weapons.forEach(w=>{w.ammo=0;w.reserve=0;});wi=0;setSoldierPose(playerRig,false,1,false);}
let startingGame=false;async function start(){if(startingGame)return;startingGame=true;initAudio();const lobbyStartButton=document.querySelector('#lobbyStart');const modeDescription=document.querySelector('#modeDescription');if(!started&&!environmentAssetsLoaded){if(lobbyStartButton){lobbyStartButton.disabled=true;lobbyStartButton.textContent='載入戰場…';}if(modeDescription)modeDescription.textContent='戰場已開始；環境素材正在背景分批載入，不會阻擋操作。';}if(lobbyStartButton){lobbyStartButton.disabled=false;lobbyStartButton.textContent='開始遊戲 ➜';}if(!started){lobbyOperator.visible=false;player.visible=true;document.querySelector('#lobby').classList.remove('visible');}if(dead){hp=100;kills=0;elapsed=0;resetPickups();enemies.forEach(e=>{e.alive=true;e.hp=100;e.group.visible=true;e.group.position.copy(e.spawn);});}started=true;dead=false;paused=false;document.querySelector('#overlay').classList.remove('visible');document.querySelector('#desc').textContent='先搜尋建築與倉庫取得武器，再利用掩體擊倒 AI 敵人。';document.querySelector('#start').textContent='開始戰鬥';hud();renderer.domElement.requestPointerLock?.();startingGame=false;}

function renderInventory(){
 const eq=document.querySelector('#equipmentSlots'),grid=document.querySelector('#backpackGrid');
 if(!eq||!grid)return;
 const slots=weapons.map((w,i)=>({name:ownedWeapons[i]?w.name:'空武器槽',sub:'武器槽 '+(i+1),value:ownedWeapons[i]?w.ammo+' / '+w.reserve:'未拾取',active:i===wi,icon:ownedWeapons[i]?['▰','⌖','◈','▥'][i]:'＋'}));
 eq.innerHTML=slots.map(v=>"<div class='equipment-slot "+(v.active?"equipped":"")+"'><span class='slot-icon'>"+v.icon+"</span><div><b>"+v.name+"</b><small>"+v.sub+"</small></div><strong>"+v.value+"</strong></div>").join('');
 const items=[{name:'醫療包',desc:'恢復 50 點生命值',count:medKits,icon:'✚'},{name:'擴容彈匣',desc:'所有武器彈匣容量提升',count:weapons[0].mag>30?1:0,icon:'▤'},{name:'二倍瞄準鏡',desc:'瞄準時縮放倍率提升',count:scopeUpgrade?1:0,icon:'⌖'}];
 const carried=items.filter(v=>v.count>0);
 grid.innerHTML=Array.from({length:20},(_,i)=>{const v=carried[i];return v?"<div class='bag-slot filled'><span>"+v.icon+"</span><b>"+v.name+"</b><small>"+v.desc+"</small><em>×"+v.count+"</em></div>":"<div class='bag-slot empty'><span>"+(i+1).toString().padStart(2,'0')+"</span></div>";}).join('');
 document.querySelector('#bagCount').textContent=carried.reduce((n,v)=>n+v.count,0)+' / 20';
 document.querySelector('#inventoryStats').innerHTML="<p>生命 <b>"+Math.ceil(hp)+" / 100</b></p><p>擊殺 <b>"+kills+"</b></p><p>武器 <b>"+ownedWeapons.filter(Boolean).length+" / 4</b></p><p>醫療包 <b>"+medKits+"</b></p>";
}
function toggleInventory(force){
 if(!started||dead)return;
 inventoryOpen=typeof force==='boolean'?force:!inventoryOpen;
 const panel=document.querySelector('#inventory');
 panel.classList.toggle('open',inventoryOpen);
 panel.setAttribute('aria-hidden',String(!inventoryOpen));
 if(inventoryOpen){fireHeld=false;aim=false;renderInventory();if(document.pointerLockElement)document.exitPointerLock?.();}
 else if(started&&!dead){renderer.domElement.requestPointerLock?.();}
}
document.querySelector('#inventoryClose').addEventListener('click',()=>toggleInventory(false));

document.querySelector('#start').onclick=start;
let selectedMode='training';
const modeDescriptions={training:'單人訓練場，對抗 AI 敵人並熟悉戰場。',solo:'單人大逃殺模式尚在開發，完成後可挑戰最多 10 人戰場。',squad:'多人房間與即時連線伺服器尚在建置中。',team:'5 vs 5 團隊模式尚在開發中。'};
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{selectedMode=button.dataset.mode;document.querySelectorAll('[data-mode]').forEach(v=>v.classList.toggle('selected',v===button));document.querySelector('#modeDescription').textContent=modeDescriptions[selectedMode];document.querySelector('#lobbyStart').textContent=selectedMode==='training'?'開始遊戲 ➜':'尚未開放';}));
document.querySelector('#lobbyStart').addEventListener('click',()=>{if(selectedMode==='training')start();else{const el=document.querySelector('#modeDescription');el.textContent=modeDescriptions[selectedMode]+' 目前請先選擇訓練場遊玩。';}});
document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(v=>v.classList.toggle('active',v===button));if(button.dataset.tab!=='home'){document.querySelector('#modeDescription').textContent=button.dataset.tab==='character'?'角色外觀與造型系統即將推出。':button.dataset.tab==='storage'?'武器與裝備倉庫系統即將推出。':'畫面與操作設定即將推出。';}else document.querySelector('#modeDescription').textContent=modeDescriptions[selectedMode];}));
function pauseGame(){if(!started||dead||inventoryOpen||paused)return;paused=true;fireHeld=false;aim=false;document.querySelector('#overlay').classList.add('visible');document.querySelector('#desc').textContent='遊戲已暫停。按 ESC 或點擊按鈕繼續。';document.querySelector('#start').textContent='繼續戰鬥';if(document.pointerLockElement)document.exitPointerLock?.();}
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===renderer.domElement;if(locked){hadLock=true;}else if(hadLock&&started&&!dead&&!inventoryOpen&&!paused){paused=true;fireHeld=false;document.querySelector('#overlay').classList.add('visible');document.querySelector('#desc').textContent='遊戲已暫停。按 ESC 或點擊按鈕繼續。';document.querySelector('#start').textContent='繼續戰鬥';}});
document.addEventListener('mousemove',e=>{if(!locked)return;const mx=e.movementX,my=e.movementY;if(Math.abs(mx)>100||Math.abs(my)>100)return;const horizontalSensitivity=.0023,verticalSensitivity=.00125;yaw-=mx*horizontalSensitivity;pitch=THREE.MathUtils.clamp(pitch-my*verticalSensitivity,-.28,.24);});
const keyAliases={KeyW:['w','ArrowUp'],KeyA:['a','ArrowLeft'],KeyS:['s','ArrowDown'],KeyD:['d','ArrowRight']};
function setKey(e,value){const code=e.code||'';keys[code]=value;const key=(e.key||'').toLowerCase();if(key)keys[key]=value;for(const [physical,aliases] of Object.entries(keyAliases)){if(code===physical||aliases.includes(key)){keys[physical]=value;for(const alias of aliases)keys[alias]=value;}}}
window.addEventListener('keydown',e=>{setKey(e,true);if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='KeyE'&&started&&!dead){e.preventDefault();toggleInventory();}if(e.code==='Escape'){e.preventDefault();if(inventoryOpen){toggleInventory(false);}else if(started&&!dead){if(paused)start();else pauseGame();}}if(e.code==='KeyF'&&started&&!dead&&!paused&&!inventoryOpen){pickupRequested=true;}if(e.code==='KeyZ'&&started&&!dead&&!inventoryOpen){stance=stance==='crouch'?'stand':'crouch';toast(stance==='crouch'?'蹲下':'站立');}if(e.code==='KeyX'&&started&&!dead&&!inventoryOpen){stance=stance==='prone'?'stand':'prone';toast(stance==='prone'?'趴下':'站立');}if(e.code==='KeyH'&&started&&!dead&&!inventoryOpen&&medKits>0&&hp<100){medKits--;hp=Math.min(100,hp+50);toast('使用醫療包：生命 +50');hud();renderInventory();}if(e.code==='Space'&&started&&!dead&&!paused&&!inventoryOpen&&towerClimb){if(towerClimbActive){towerClimbSpaceHeld=true;}else if(Math.hypot(player.position.x-towerClimb.ladderX,player.position.z-towerClimb.z)<1.65&&Math.abs(player.position.y-towerClimb.base)<1.25){player.position.x=towerClimb.ladderX;player.position.z=towerClimb.z;towerClimbActive=true;towerClimbSpaceHeld=true;grounded=false;vy=0;toast('按住空白鍵向上攀爬，放開後自動下滑');}else if(grounded){const fwd=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));const fx=player.position.x+fwd.x*1.15,fz=player.position.z+fwd.z*1.15;const low=obstacleColliders.some(o=>o.jumpable&&Math.abs(fx-o.x)<(o.halfX||o.radius||.7)+.55&&Math.abs(fz-o.z)<(o.halfZ||o.radius||.7)+.55&&player.position.y<o.maxY+.35);vaultTime=low?.62:0;vy=low?8.25:7;grounded=false;supportRock=null;if(low)toast('翻越');}}else if(e.code==='Space'&&grounded&&started&&!dead&&!inventoryOpen){const fwd=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));const fx=player.position.x+fwd.x*1.15,fz=player.position.z+fwd.z*1.15;const low=obstacleColliders.some(o=>o.jumpable&&Math.abs(fx-o.x)<(o.halfX||o.radius||.7)+.55&&Math.abs(fz-o.z)<(o.halfZ||o.radius||.7)+.55&&player.position.y<o.maxY+.35);vaultTime=low?.62:0;vy=low?8.25:7;grounded=false;supportRock=null;if(low)toast('翻越');}if(e.code==='KeyR'&&!inventoryOpen)reload();if(/^Digit[1-4]$/.test(e.code)){const next=Number(e.code.slice(-1))-1;if(ownedWeapons[next]){wi=next;reloading=false;hud();setSoldierPose(playerRig,false,1,ownedWeapons[wi]);}}},true);
window.addEventListener('keyup',e=>{setKey(e,false);if(e.code==='Space')towerClimbSpaceHeld=false;},true);
window.addEventListener('blur',()=>{for(const k of Object.keys(keys))keys[k]=false;towerClimbSpaceHeld=false;});document.addEventListener('mousedown',e=>{initAudio();if(inventoryOpen)return;if(e.button===0){fireHeld=true;if(!locked&&started)renderer.domElement.requestPointerLock?.();else shoot();}if(e.button===2)aim=true;});document.addEventListener('mouseup',e=>{if(e.button===0)fireHeld=false;if(e.button===2)aim=false;});document.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
const clock=new THREE.Clock();function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.04);if(started&&!dead&&!inventoryOpen&&!paused){elapsed+=dt;document.querySelector('#timer').textContent=String(Math.floor(elapsed/60)).padStart(2,'0')+':'+String(Math.floor(elapsed%60)).padStart(2,'0');const f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),r=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw)),m=new THREE.Vector3();if(keys.KeyW||keys.w||keys.ArrowUp)m.add(f);if(keys.KeyS||keys.s||keys.ArrowDown)m.sub(f);if(keys.KeyD||keys.d||keys.ArrowRight)m.add(r);if(keys.KeyA||keys.a||keys.ArrowLeft)m.sub(r);const moving=m.lengthSq()>0;const sprinting=!!(keys.ShiftLeft||keys.ShiftRight)&&moving;moveBlend=THREE.MathUtils.lerp(moveBlend,moving?1:0,1-Math.exp(-dt*(moving?10:7)));if(moving&&!towerClimbActive){m.normalize();const stanceSpeed=stance==='prone'?2.0:stance==='crouch'?3.35:1;const step=m.multiplyScalar((sprinting&&stance==='stand'?9.2:5.7)*stanceSpeed*moveBlend*dt);gaitTime+=dt*(sprinting?14:9.5)*moveBlend;const canStep=(dx,dz)=>canActorStep(player.position.x+dx,player.position.z+dz,player.position.y,.38,1.8,true);const canStepZ=(dx,dz)=>canActorStep(player.position.x+dx,player.position.z+dz,player.position.y,.38,1.8,true);if(canStep(step.x,0))player.position.x+=step.x;if(canStepZ(0,step.z))player.position.z+=step.z;player.rotation.y=yaw;}player.position.x=THREE.MathUtils.clamp(player.position.x,-49,49);player.position.z=THREE.MathUtils.clamp(player.position.z,-44,44);if(grounded){let supported=false;for(const o of obstacleColliders){let onTop=false;if(o.kind==='box'){if(Math.abs(supportY-o.maxY)>.08)continue;const withinX=player.position.x+.38>o.x-o.halfX&&player.position.x-.38<o.x+o.halfX;const withinZ=player.position.z+.38>o.z-o.halfZ&&player.position.z-.38<o.z+o.halfZ;onTop=withinX&&withinZ;if(onTop)supportRock=null;}else if(o.kind==='rock'||o.kind==='cylinder'){const dx=player.position.x-o.x,dz=player.position.z-o.z,reach=(o.supportRadius||o.radius)+.72;if(dx*dx+dz*dz<=reach*reach){const top=rockSupportAt(o,player.position.x,player.position.z,supportY);if(top!==null&&(o===supportRock||Math.abs(supportY-top)<.82)){supportY=top;supportRock=o;onTop=true;}}}if(onTop){supported=true;break;}}if(!supported){supportRock=null;supportY=terrainHeightAt(player.position.x,player.position.z);}player.position.y=supportY;}if(towerClimbActive){player.position.x=towerClimb.ladderX;player.position.z=towerClimb.z;if(towerClimbSpaceHeld)player.position.y=Math.min(towerClimb.deckY,player.position.y+2.45*dt);else player.position.y=Math.max(towerClimb.base,player.position.y-2.8*dt);vy=0;grounded=false;if(player.position.y>=towerClimb.deckY-.015&&towerClimbSpaceHeld){player.position.y=towerClimb.deckY;player.position.x=towerClimb.x+1.25;supportY=towerClimb.deckY;grounded=true;towerClimbActive=false;towerClimbSpaceHeld=false;toast('已抵達觀測平台');}else if(player.position.y<=towerClimb.base+.015&&!towerClimbSpaceHeld){player.position.y=towerClimb.base;supportY=towerClimb.base;grounded=true;towerClimbActive=false;toast('已回到地面');}}else{const previousY=player.position.y;vy-=19*dt;let nextY=previousY+vy*dt;if(vy<=0){for(const o of obstacleColliders){let landingY=null;if(o.kind==='box'){const withinX=player.position.x+.38>o.x-o.halfX&&player.position.x-.38<o.x+o.halfX;const withinZ=player.position.z+.38>o.z-o.halfZ&&player.position.z-.38<o.z+o.halfZ;if(withinX&&withinZ)landingY=o.maxY;}else if(o.kind==='rock'||o.kind==='cylinder'){const dx=player.position.x-o.x,dz=player.position.z-o.z,reach=(o.supportRadius||o.radius)+.72;if(dx*dx+dz*dz<=reach*reach)landingY=rockSupportAt(o,player.position.x,player.position.z,(previousY+nextY)*.5);}if(landingY!==null&&previousY>=landingY-.06&&nextY<=landingY){nextY=landingY;supportY=landingY;supportRock=o.kind==='rock'?o:null;vy=0;grounded=true;break;}}}const floorY=terrainHeightAt(player.position.x,player.position.z);if(vy<=0&&previousY>=floorY-.08&&nextY<=floorY){nextY=floorY;supportY=floorY;supportRock=null;vy=0;grounded=true;}player.position.y=nextY;if(player.position.y<floorY){player.position.y=floorY;supportY=floorY;supportRock=null;vy=0;grounded=true;}}ai(dt);playerRig.gait=gaitTime;vaultTime=Math.max(0,vaultTime-dt);hitReact=Math.max(0,hitReact-dt);damageFlash=Math.max(0,damageFlash-dt*1.65);const damageEl=document.querySelector('#damage');if(damageEl)damageEl.style.opacity=String(damageFlash*.72);setSoldierPose(playerRig,aim||fireHeld||performance.now()<weaponOutUntil,dt,ownedWeapons[wi],moveBlend>.08,sprinting&&stance==='stand',!grounded,stance);if(vaultTime>0){playerRig.body.rotation.x=THREE.MathUtils.lerp(playerRig.body.rotation.x,-.42,Math.min(1,dt*12));for(const arm of playerRig.arms)arm.pivot.rotation.x=THREE.MathUtils.lerp(arm.pivot.rotation.x,-.9,Math.min(1,dt*12));}else if(hitReact>0){playerRig.body.rotation.z=THREE.MathUtils.lerp(playerRig.body.rotation.z,.13,Math.min(1,dt*15));}updateImpacts(dt);updateBullets(dt);updateTracers(dt);collectPickups();if(moving){footstepClock-=dt;if(footstepClock<=0){playFootstep(sprinting);footstepClock=sprinting?.29:.46;}}else footstepClock=0;for(const p of windParticles){p.position.x+=dt*.32;if(p.position.x>49)p.position.x=-49;}if(fireHeld&&wi===0)shoot();}if(!started){lobbyOperator.rotation.y+=dt*.12;camera.position.set(4.2,3.15,8.6);camera.lookAt(0,1.15,0);camera.fov=THREE.MathUtils.lerp(camera.fov,43,.08);}else{const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));player.rotation.y=yaw;const followDistance=2.2;const followHeight=stance==='prone'?.42:stance==='crouch'?.72:1.12;const followPosition=player.position.clone().addScaledVector(forward,-followDistance).addScaledVector(right,.58);followPosition.y+=followHeight;camera.position.copy(followPosition);const look=player.position.clone().addScaledVector(forward,2.2);look.y=player.position.y+(stance==='prone'?.28:stance==='crouch'?.48:.7)+Math.tan(pitch)*3.8;recoil=Math.max(0,recoil-dt*.24);camera.lookAt(look);camera.fov=THREE.MathUtils.lerp(camera.fov,aim?(scopeUpgrade?35:53):67,.16);}camera.updateProjectionMatrix();renderer.render(scene,camera);}hud();loop();
