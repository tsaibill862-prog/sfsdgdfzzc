# Environment asset pipeline

The game loads optimized GLB environment props from `manifest.json` through Three.js `GLTFLoader`. Existing procedural terrain remains the fallback, so the map still works when the asset list is empty or a model fails to load.

## Asset intake rules

- Prefer **Poly Haven** models and PBR materials: all assets on the source site are CC0 and permitted for commercial use. Verify the individual asset page before importing: https://polyhaven.com/license
- Keep the original asset page, creator, license, download date, and any conversion/optimization notes in the project asset register.
- Only add assets whose license is explicitly CC0-1.0 or otherwise approved for commercial game distribution. Check Sketchfab licenses per model; do not assume the whole site is commercially reusable.
- Convert source models to GLB, apply transforms, pack textures, and optimize geometry before committing. Use 1K/2K textures for the playable map; reserve 4K for hero props only.
- Avoid copying PUBG-owned models, textures, sounds, maps, logos, or other proprietary content.

## Add a model

1. Put the optimized file in `public/assets/environment/models/`.
2. Add an entry to `manifest.json`:

```json
{
  "id": "rock-cluster-a",
  "url": "/assets/environment/models/rock-cluster-a.glb",
  "position": [12, 0, -8],
  "rotation": [0, 0.4, 0],
  "scale": 1,
  "castShadow": true,
  "receiveShadow": true
}
```

3. Test the asset in the target area, check collision separately, and profile draw calls/texture memory before expanding placement.

## First showcase area

Start with a compact ridge/outpost zone rather than replacing the entire battlefield at once. Priority order: ground/rock materials, scanned rock clusters, trees and shrubs, then the outpost building and small military props. Keep the existing Alpha 4.0 lighting setup unchanged while art assets are integrated.


## Integrated CC0 assets

- [Namaqualand Boulder 02](https://polyhaven.com/a/namaqualand_boulder_02) — Greg Zaal and Rico Cilliers, CC0-1.0. Downloaded as 2K glTF at build time; one loaded model is reused for several placements.
- [Modular Fort 01](https://polyhaven.com/a/modular_fort_01) — Rico Cilliers, CC0-1.0. Downloaded as 2K glTF at build time and scaled as a compact outpost showcase.

The build script uses the official Poly Haven API with a project-specific User-Agent and downloads each glTF dependency beside the model. The UI credits Poly Haven as requested by its API terms.
