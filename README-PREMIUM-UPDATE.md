# ASaranav Premium Update

This update preserves the original scroll-driven character sequence and frame artwork while improving frame loading reliability and responsive presentation.

## Important changes
- Frame requests use the Vite base path, load in a bounded worker pool, and fall back from small-screen frames to desktop frames.
- Animation startup no longer depends on every image loading successfully; it starts once enough frames are ready, with a fail-safe to avoid an indefinite preloader.
- Frame interpolation is clamped to prevent invalid alpha values.
- Responsive refinements cover compact phones, landscape mobile, touch interactions, keyboard focus, and reduced-motion preferences.

## Deploy
1. Back up the current GitHub branch or create a new branch before replacing files.
2. Upload the contents of this project folder to the repository root (not the ZIP file itself).
3. Keep `public/frames/` and `public/resume.pdf`/the existing resume asset in place. Do not rename frame files.
4. Vercel should use `npm run build` as the build command and `dist` as the output directory.
5. Verify the deployment on mobile and desktop before promoting it to production.

The `cache-dir` npm warning shown in the supplied screenshot is a configuration warning, not by itself a build failure. Check the final build log for `Build Completed` or a red error to determine deployment status.
