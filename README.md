# ASaranav Ultra-Luxury V8 — Scroll/Character Alignment Fix

This package retains the existing React + TypeScript + Vite portfolio, all seven sections, and the original character frame assets.

## Changes in this revision
- Character anchor now transitions into each section's intended position during the first 22% of that section, rather than drifting toward the *next* section near the end of the current section.
- The canvas renders one source frame at a time; it does not composite adjacent poses, preventing duplicate silhouettes from alpha blending.
- Contact now holds the last source pose (frame 238) instead of jumping from frame 238 back to frame 71 when entering Contact.
- Existing premium obsidian/champagne styling and responsive CSS are retained.

## Run locally
Install Node.js LTS, extract this ZIP, open a terminal in the folder containing `package.json`, then run:

```bash
npm install
npm run build
npm run dev
```

Open the local URL printed by Vite. If the build succeeds, upload/commit the extracted source to the GitHub repository connected to Vercel, then wait for a successful production deployment.

## Verification status
The ZIP structure and source edits were checked. A production build could not be verified in the authoring environment because dependencies were not installed successfully (the install timed out). Run `npm install` and `npm run build` locally before deploying.
