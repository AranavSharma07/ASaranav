# Vercel deployment

This archive is structured so `package.json` is at the project root.

## If deploying from GitHub
1. Ensure `package.json`, `index.html`, `src/`, `public/`, `vite.config.ts`, and `tsconfig.json` are at the repository root (not nested inside an extra folder).
2. In Vercel → Project → Settings → Build and Deployment, set **Root Directory** to `./` (repository root) if these files are at the root. If you intentionally keep the project inside a subfolder, set Root Directory to that exact subfolder instead.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`. Install command: `npm install` (or leave default).
4. Redeploy after saving.

The error `/vercel/path0/package.json` means Vercel could not find `package.json` at its configured root. It is not fixed by changing the build command.
