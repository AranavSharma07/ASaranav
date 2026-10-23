import React, { useEffect, useRef } from 'react';
import { FrameLoader, type Shot } from '../engine/frames';
import { scenes } from '../data';
import type { SceneState } from '../engine/director';

const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));

type DrawScene = (index: number, frame: number, opacity?: number, shift?: number) => void;

export function Stage({ loader, statesRef }: { loader: FrameLoader; statesRef: React.MutableRefObject<SceneState[]> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d', { alpha: true, desynchronized: true });
    if (!canvas || !ctx) return;

    let raf = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    const lastImageByShot = new Map<number, HTMLImageElement>();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width || window.innerWidth));
      height = Math.max(1, Math.round(rect.height || window.innerHeight));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };


    const shotFor = (frame: number): Shot | undefined =>
      loader.manifest?.shots.find((shot) => frame >= Math.min(shot.from, shot.to) && frame <= Math.max(shot.from, shot.to));

    const drawScene: DrawScene = (sceneIndex, frame, opacity = 1, shift = 0) => {
      const scene = scenes[sceneIndex];
      const shot = shotFor(frame);
      if (!shot || !loader.manifest || opacity <= 0.005) return;

      const mobile = width < 820;
      const state = statesRef.current[sceneIndex];
      const previousScene = scenes[Math.max(sceneIndex - 1, 0)];
      const p = clamp(state?.p ?? 0);
      // Move the character into each section's authored anchor during the first
      // part of that section. This keeps the pose aligned with the active text
      // panel without blending two different character silhouettes together.
      const transition = sceneIndex === 0 ? 1 : clamp(p / 0.22);
      const easedTransition = transition * transition * (3 - 2 * transition);
      const anchorX = mobile
        ? 0.5
        : previousScene.x + (scene.x - previousScene.x) * easedTransition;
      const sceneScale = previousScene.k + (scene.k - previousScene.k) * easedTransition;
      const scale = mobile
        ? Math.min(height * 0.69 / 900, width * 0.94 / Math.max(1, shot.box[2]))
        : height * sceneScale / 900;
      const offY = height - 900 * scale;
      const offX = anchorX * width - shot.cx * 1600 * scale;
      const frames = loader.get(frame, shot);
      const exactImage = frames.a;
      if (exactImage) lastImageByShot.set(shot.from, exactImage);
      const stableImage = exactImage ?? lastImageByShot.get(shot.from);

      // Only blend exact neighbouring frames from the same shot. The frame loader
      // deliberately refuses to blend distant fallback frames, which prevents
      // doubled silhouettes while assets are still loading.
      const paint = (image: HTMLImageElement | undefined, alpha: number) => {
        if (!image || alpha <= 0.001) return;
        ctx.globalAlpha = clamp(alpha) * opacity;
        ctx.drawImage(
          image,
          offX + shot.box[0] * scale,
          offY + shot.box[1] * scale,
          shot.box[2] * scale,
          shot.box[3] * scale,
        );
      };

      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      // One source frame per draw. Avoid alpha blending poses whose cutout
      // silhouette or camera position differs from the current frame.
      paint(stableImage, 1);
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const draw = () => {
      const states = statesRef.current;
      if (states.length && loader.manifest) {
        const y = window.scrollY;
        // Pick a single active scene. Do not composite the previous scene on top:
        // the source frames have different silhouettes and overlapping them creates
        // the large rectangular/ghosted areas seen during scroll transitions.
        let active = 0;
        for (let i = 0; i < states.length; i++) {
          if (y >= states[i].top - height * 0.08) active = i;
        }
        const current = states[active];
        const scene = scenes[active];
        const progress = clamp(current.p);
        const rawFrame = scene.from + (scene.to - scene.from) * progress;
        const shot = shotFor(rawFrame);
        const frame = shot
          ? Math.max(Math.min(shot.from, shot.to), Math.min(Math.max(shot.from, shot.to), rawFrame))
          : rawFrame;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, width, height);
        // Use one decoded frame at a time. Adjacent-frame crossfades caused doubled
        // silhouettes where the cutout position changes between source frames.
        drawScene(active, Math.round(frame), 1);
      }


      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [loader, statesRef]);

  return <canvas ref={ref} className="stage" aria-hidden="true" />;
}
