import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const publicRoot = path.join(root, 'public');
const userAgent = 'ProjectBattleRoyale/1.0 (CC0 game asset build)';
const models = ['namaqualand_boulder_02', 'modular_fort_01', 'fir_tree_01', 'tree_small_02', 'pine_tree_01'];
const materials = ['forrest_ground_01'];

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
async function downloadGltf(id, kind) {
  const files = await getJson(`https://api.polyhaven.com/files/${id}`);
  const gltf = (kind === 'model' ? files?.gltf : files?.gltf)?.['2k']?.gltf;
  if (!gltf?.url) throw new Error(`No 2K glTF download available for ${id}`);
  const dir = path.join(publicRoot, 'assets', 'environment', 'models', id);
  const sourceName = path.basename(new URL(gltf.url).pathname);
  const mainName = `${id}.gltf`;
  await saveRemoteFile(gltf, path.join(dir, mainName));
  for (const [relativeName, dependency] of Object.entries(gltf.include || {})) {
    const safeName = path.normalize(relativeName).replace(/^\.\.(?:[\\/]|$)/, '');
    await saveRemoteFile(dependency, path.join(dir, safeName));
  }
  console.log(`Downloaded Poly Haven CC0 ${kind}: ${id}`);
}
for (const id of models) await downloadGltf(id, 'model');
for (const id of materials) await downloadGltf(id, 'ground material');
