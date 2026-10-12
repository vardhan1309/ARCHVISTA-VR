# ARCHVISTA VR

A high-fidelity, browser-based architectural 360° virtual-tour prototype, designed for **Meta Quest 3** and **monoscopic Enscape equirectangular panoramas**. GitHub Pages hosts the public frontend and committed tour image/configuration assets.

## Included
- Dark charcoal/teal responsive project dashboard
- A-Frame 360° panorama viewer with mouse/touch look controls
- World-anchored hotspots for room navigation
- Interactive floor-plan overlay
- Tour editor: add scene, edit scene metadata, link navigation hotspots, preview
- Import/export tour configuration (`archvista-tour.json`)
- Meta Quest 3 WebXR immersive mode, controller-ray hotspots and VR scene selection menu
- Four **illustrative** 2048 × 1024 panoramic demo images (not user Enscape output)

## Preview locally

Use a local web server, not `file://`:

```bash
python -m http.server 8080
```

Open http://localhost:8080 . The A-Frame library and fonts are fetched from CDNs. Internet is required. For VR, access via a published HTTPS URL on Quest Browser.

## Publish to GitHub Pages

1. Create a **public** GitHub repository named `archvista-vr`.
2. Upload all files from this folder **including `.github/workflows/deploy.yml`** to the repository root, or push with Git:

```bash
git init
git add .
git commit -m "Initial ARCHVISTA VR prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/archvista-vr.git
git push -u origin main
```

3. In GitHub **Settings → Pages**, select **GitHub Actions** as build/deployment source.
4. After the `Deploy ARCHVISTA` workflow completes, open `https://YOUR_USERNAME.github.io/archvista-vr/` in Quest Browser.
5. Select a tour and press **Enter VR**. If the immersive menu is not centered, look forward and tap A/X or thumbstick for toggle. Controller pointer trigger activates hotspots.

The files use relative paths, so they work under a GitHub Pages repository subpath.

## Use your Enscape panoramas

1. Export an **equirectangular monoscopic** 360° JPEG panorama (approximately **2:1** aspect ratio), e.g. 4096 × 2048.
2. Add the image to the repository's `assets/` folder, e.g. `assets/living-room.jpg`.
3. Open **Tour Editor**, choose a scene, set image path `assets/living-room.jpg`, and save scene details.
4. Add more scenes and navigation hotspots (yaw/pitch), preview and export `archvista-tour.json`.
5. **To publish persistent changes**, commit both the panoramas and configuration to GitHub. The site does not have a backend; editing inside your browser does not write to GitHub.

To publish an exported tour automatically as the site's default, rename your exported JSON to `tour.json` and commit it to the repository root. The app loads that file on startup. Local file uploads only exist until the browser tab is reloaded. The exported JSON replaces temporary `blob:` image URLs with `assets/<scene-id>.jpg` placeholders; rename your committed files or update paths to match.

## Limits

- Mono panoramas allow look-around orientation, not real 6DoF movement or realistic head translation.
- VR rendering depends on browser/WebXR compatibility and image GPU memory limits.
- High-resolution Enscape exports should be tested on actual Quest 3 hardware.
- GitHub Pages is static hosting; **no permanent uploads, accounts, access controls or cloud-backed scene editing**.
- This is an MVP prototype, not a completed production tour publishing service.

## Structure

- `index.html`: application UI and embedded A-Frame scene
- `styles.css`: shared design system
- `app.js`: viewer, VR menu, navigation, editor and export logic
- `assets/`: sample panoramic imagery
- `.github/workflows/deploy.yml`: GitHub Pages workflow

## Troubleshooting

If the panorama viewer is blank, check internet connectivity (A-Frame CDN) and browser Console. If VR entry does not work, use Meta Quest Browser over HTTPS rather than `file://` or plain HTTP. If a hotspot is missing, check its target scene ID and yaw/pitch. If a local image vanishes after refresh, upload it to your repo's `assets/` folder and set a persistent relative URL.


## Poorna Market hybrid interface (2026 update)

The default project is **Poorna Market — The Living Market Spine**. Its eight provisional viewpoints are organized into Street, Interior and Facilities zones. The dashboard offers Guided Walkthrough and Explore Freely; the viewer provides a contextual chapter panel, categories, and a market map with example camera positions. The VR menu includes a mode toggle and viewpoint controls.

**Important:** All supplied panoramas are re-used architectural demo photographs, NOT actual Poorna Market renders. The schematic floor/map and coordinate percentages are illustrative, NOT the final site plan or measured camera locations. Replace each scene's `image`, `x`, `y` and hotspot `yaw`/`pitch` values with your Enscape panoramas and finalized coordinates when they become available. Retain `zone`, `chapter` and `info` fields for the UI.

The editor remains a local browser editor. Export JSON, then commit it as `tour.json` and upload image files to `assets/` to publish them.
