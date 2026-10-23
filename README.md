# Aranav Sharma Portfolio — Premium V8

A React + TypeScript + Vite portfolio with GSAP, Lenis, and a scroll-driven canvas character sequence.

## Run locally

1. Install Node.js (LTS) from https://nodejs.org/.
2. Extract this ZIP into a new folder.
3. Open a terminal in the folder where `package.json` is visible.
4. Run:
   ```bash
   npm install
   npm run build
   npm run dev
   ```
5. Open the localhost URL shown in the terminal.

## Deploy to Vercel

Push the project to your GitHub repository and import that repository in Vercel. Use the Vite defaults: build command `npm run build`, output directory `dist`.

## V8 refinements

- Obsidian, champagne, and warm-metal luxury visual system.
- More restrained accent color, layered glass panels, refined controls, project cards, timeline, awards and contact section.
- Responsive refinements for compact mobile and wide desktop screens.
- Updated dark theme and social preview metadata.
- Preserves the existing scroll-driven character and all original sections/assets.
- Retains the v7 single-source-frame renderer to avoid cross-pose compositing/ghost silhouettes.

## Validation note

The archive structure and asset presence were checked. A production build could not be run in the authoring environment because dependency installation did not finish; run `npm install` and `npm run build` locally before deploying.
