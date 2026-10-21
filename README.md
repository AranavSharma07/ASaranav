# Aranav Sharma — Scroll-driven portfolio

A Vite + React + TypeScript portfolio with Lenis smooth scrolling, GSAP ticker integration, a canvas frame stage, scene-based layouts, and CSS 3D effects. The source résumé is copied to `public/resume.pdf`.

## Run locally

```bash
npm install
npm run dev
```

Production check:

```bash
npm run typecheck
npm run build
npm run preview
```

## Personalise before publishing

Edit `src/data.ts`:
- Replace `YOUR EMAIL HERE`, `YOUR-USERNAME`, and `YOUR-PROFILE` with verified contact links.
- Replace the sample portfolio projects and skill counters with public URLs and confirmed metrics where available. The current project cards are presentation case studies based on résumé experience, not claims of shipped client websites.
- The résumé currently contains no email address, GitHub URL, LinkedIn URL, CGPA, or coding-platform totals; these are intentionally not fabricated.

## Video frames

`public/frames/manifest.json` indexes 239 frame files at 1600×900 virtual coordinates, with `lg/` and half-size `sm/` WebP versions. The source clip is 9.96 seconds long. Frames were cut out locally using OpenCV GrabCut and a manually cleaned torso mask because the environment had no network access to install `rembg`/download the `u2net_human_seg` model. This is a best-effort fallback rather than a verified rembg matte; inspect the supplied red-background composite test if you intend to use the frames in a production campaign.

## Notes

- Vite uses `base: './'` for relative deployment paths.
- React StrictMode is not enabled.
- Frame loading and rendering run outside React's scroll render cycle; section state is held in a ref.
- `public/resume.pdf` is the original uploaded résumé, copied without editing.

## Validation status

TypeScript/TSX syntax transpilation passed in the available environment. A full `npm run typecheck`, production Vite build, and headless Chromium screenshots at desktop/mobile section and blade-transition checkpoints could not be completed here because the npm registry was unreachable and the project dependencies were not installed. Run the commands above in an internet-connected environment, then review `qa/red-background-composite.jpg` for the current frame matte. The current video matte is a best-effort OpenCV fallback and needs a final visual pass before public launch.
