import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const publicRoot = path.join(root, 'public');
const userAgent = 'ProjectBattleRoyale/1.0 (CC0 game asset build)';
const assets = ['namaqualand_boulder_02', 'modular_fort_01'];

async function getJson(url) {
  const response = await fetch(url, { headers: { 'User-Agent': userAgent } });
  if (!response.ok) throw new Error(`Poly Haven API ${response.status}: ${url}`);
  return response.json();
}
async function saveRemoteFile(file, destination) {
  const response = await fetch(file.url, { headers: { 'User-Agent': userAgent } });
  if (!response.ok) throw new Error(`Asset download ${response.status}: ${file.url}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (file.size && bytes.byteLength !== file.size) throw new Error(`Size mismatch for ${destination}`);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
}
for (const id of assets) {
  const files = await getJson(`https://api.polyhaven.com/files/${id}`);
  const gltf = files?.gltf?.['2k']?.gltf;
  if (!gltf?.url) throw new Error(`No 2K glTF download available for ${id}`);
  const dir = path.join(publicRoot, 'assets', 'environment', 'models', id);
  const mainName = path.basename(new URL(gltf.url).pathname);
  await saveRemoteFile(gltf, path.join(dir, mainName));
  for (const [relativeName, dependency] of Object.entries(gltf.include || {})) {
    const safeName = path.normalize(relativeName).replace(/^\.\.(?:[\\/]|$)/, '');
    await saveRemoteFile(dependency, path.join(dir, safeName));
  }
  console.log(`Downloaded Poly Haven CC0 model: ${id}`);
}
