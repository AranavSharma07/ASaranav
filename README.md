# ASaranav portfolio — repaired source package

This is the React + TypeScript + Vite source project. It retains the existing seven sections and the original character frame assets.

## Changes in this package
- Restores the desktop `f192.webp` frame at its original 817×900 size; the prior repair accidentally used the 408×450 mobile frame.
- Uses one source frame per canvas draw rather than compositing two different poses, avoiding doubled/ghosted silhouettes caused by pose blending.
- Keeps the last available frame within the active shot while the requested frame is not yet decoded.
- Constrains the Work project deck to the left side on desktop so it is less likely to cover the character.
- Retains the existing dark charcoal and champagne-gold design system and responsive layout.

## Build and run
From the folder containing `package.json`:

```bash
npm install
npm run build
npm run dev
```

## Verification status — please read
- ZIP structure and frame dimensions were checked.
- I attempted `npm install` in the build environment, but it timed out. Therefore I cannot claim that `npm run build` passed or that a browser-based scroll test passed.
- The supplied red-background QA composite shows pale background remnants around some character cutouts. These are present in the source frame alpha/matte data; CSS layering alone cannot remove them safely because the shirt and other clothing also contain white areas. This package does **not** claim those matte halos are fully repaired.
- Do not deploy to production until `npm run build` succeeds and the scroll animation has been checked locally.
