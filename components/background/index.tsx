"use client";

import { useTheme } from "next-themes";
import "./background.css";
import { useEffect, useRef, useState } from "react";
import {
  DarkColorPalette,
  LightColorPalette,
  IconNames,
} from "@/lib/constants";
import { Segment, IconDatum } from "@/lib/types";

const CELL_DESKTOP = 80;
const CELL_MOBILE = 48;
const MOBILE_BREAKPOINT = 640;
const DECAY = 0.0012;
const OMEGA = 0.0022;

function cellSize(W: number): number {
  return W < MOBILE_BREAKPOINT ? CELL_MOBILE : CELL_DESKTOP;
}

function buildSegments(W: number, H: number): Segment[] {
  const cell = cellSize(W);
  const segs: Segment[] = [];
  const diag = Math.ceil(Math.sqrt(W * W + H * H));
  const extra = 3;
  const cols = Math.ceil(diag / cell) + extra * 2;
  const rows = cols;
  const cx = W / 2;
  const cy = H / 2;
  const cos45 = Math.cos(Math.PI / 4);
  const sin45 = Math.sin(Math.PI / 4);

  const toScreen = (gx: number, gy: number) => {
    const ux = gx - cx;
    const uy = gy - cy;
    return {
      x: cx + ux * cos45 - uy * sin45,
      y: cy + ux * sin45 + uy * cos45,
    };
  };

  const sx = W / 2 - (cols / 2) * cell;
  const sy = H / 2 - (rows / 2) * cell;
  const randStyle = () => ({
    paletteIndex: Math.floor(Math.random() * 4),
    lineWidth: 1 + Math.random() * 2,
  });

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = sx + c * cell;
      const y0 = sy + r * cell;
      const x1 = x0 + cell;
      const y1 = y0 + cell;

      const a0 = toScreen(x0, y0);
      const b0 = toScreen(x1, y0);
      segs.push({ x1: a0.x, y1: a0.y, x2: b0.x, y2: b0.y, ...randStyle() });

      const a1 = toScreen(x0, y0);
      const b1 = toScreen(x0, y1);
      segs.push({ x1: a1.x, y1: a1.y, x2: b1.x, y2: b1.y, ...randStyle() });

      if (r === rows - 1) {
        const a = toScreen(x0, y1);
        const b = toScreen(x1, y1);
        segs.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, ...randStyle() });
      }

      if (c === cols - 1) {
        const a = toScreen(x1, y0);
        const b = toScreen(x1, y1);
        segs.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, ...randStyle() });
      }
    }
  }
  return segs;
}

function drawSegments(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  segments: Segment[],
  palette: string[],
) {
  ctx.clearRect(0, 0, W, H);
  for (const seg of segments) {
    ctx.beginPath();
    ctx.strokeStyle = palette[seg.paletteIndex];
    ctx.lineWidth = seg.lineWidth;
    ctx.moveTo(seg.x1, seg.y1);
    ctx.lineTo(seg.x2, seg.y2);
    ctx.stroke();
  }
}

export default function Background() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const iconDataRef = useRef<IconDatum[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const settledRef = useRef(false);

  const builtSegmentsRef = useRef<Segment[] | null>(null);
  const shuffledIconsRef = useRef<string[] | null>(null);
  const startSwingRef = useRef<(() => void) | null>(null);
  const isDarkRef = useRef<boolean>(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : true;
  isDarkRef.current = isDark;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = canvas.parentElement as HTMLElement;

    if (!shuffledIconsRef.current) {
      shuffledIconsRef.current = [...IconNames].sort(() => Math.random() - 0.5);
    }

    function placeIcons(W: number, H: number) {
      container.querySelectorAll(".bg-icon").forEach((el) => el.remove());
      iconDataRef.current = [];

      const cell = cellSize(W);
      const iconSize = Math.round(cell * 0.55);
      const diag = Math.ceil(Math.sqrt(W * W + H * H));
      const extra = 3;
      const count = Math.ceil(diag / cell) + extra * 2 + 1;
      const sx = W / 2 - (count / 2) * cell;
      const sy = H / 2 - (count / 2) * cell;
      const cx = W / 2;
      const cy = H / 2;
      const cos45 = Math.cos(Math.PI / 4);
      const sin45 = Math.sin(Math.PI / 4);
      const BLEED = iconSize;
      const icons = shuffledIconsRef.current!;
      let idx = 0;

      for (let r = 0; r <= count; r++) {
        for (let c = 0; c <= count; c++) {
          const ux = sx + c * cell - cx;
          const uy = sy + r * cell - cy;
          const screenX = cx + ux * cos45 - uy * sin45;
          const screenY = cy + ux * sin45 + uy * cos45;

          if (
            screenX < -BLEED ||
            screenX > W + BLEED ||
            screenY < -BLEED ||
            screenY > H + BLEED
          )
            continue;

          const img = document.createElement("img");
          img.src = `/icons/${icons[idx % icons.length]}.png`;
          img.className = "bg-icon";
          img.dataset.iconIdx = String(idx);
          img.style.cssText = `
            position: absolute;
            left: ${screenX - iconSize / 2}px;
            top: ${screenY - iconSize / 2}px;
            width: ${iconSize}px;
            height: ${iconSize}px;
            transform-origin: center top;
            will-change: transform;
            pointer-events: none;
            user-select: none;
            opacity: 0.85;
          `;
          container.appendChild(img);

          iconDataRef.current.push({
            amplitude: (Math.random() * 2 - 1) * 25,
            phase: Math.random() * Math.PI * 2,
          });
          idx++;
        }
      }
    }

    function startSwing() {
      cancelAnimationFrame(rafRef.current);
      const icons = Array.from(
        container.querySelectorAll<HTMLImageElement>(".bg-icon"),
      );
      const data = iconDataRef.current;
      startTimeRef.current = null;
      settledRef.current = false;

      const loop = (time: number) => {
        if (startTimeRef.current === null) startTimeRef.current = time;
        const elapsed = time - startTimeRef.current;
        const envelope = Math.exp(-DECAY * elapsed);

        if (envelope < 0.005) {
          icons.forEach((el) => {
            el.style.transform = "rotate(0deg)";
          });
          settledRef.current = true;
          return;
        }

        for (let i = 0; i < icons.length; i++) {
          const { amplitude, phase } = data[i] ?? { amplitude: 0, phase: 0 };
          const angle =
            amplitude * Math.sin(OMEGA * elapsed + phase) * envelope;
          icons[i].style.transform = `rotate(${angle}deg)`;
        }
        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    }

    startSwingRef.current = startSwing;

    function init() {
      const W = container.offsetWidth;
      const H = container.offsetHeight;
      canvas.width = W;
      canvas.height = H;

      builtSegmentsRef.current = buildSegments(W, H);

      const palette = isDarkRef.current ? DarkColorPalette : LightColorPalette;
      drawSegments(ctx, W, H, builtSegmentsRef.current, palette);

      placeIcons(W, H);
      startSwing();
    }

    init();

    const ro = new ResizeObserver(() => {
      builtSegmentsRef.current = null;
      init();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      container.querySelectorAll(".bg-icon").forEach((el) => el.remove());
      builtSegmentsRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    if (!builtSegmentsRef.current || W === 0 || H === 0) return;

    const palette = isDark ? DarkColorPalette : LightColorPalette;
    drawSegments(ctx, W, H, builtSegmentsRef.current, palette);

    startSwingRef.current?.();
  }, [isDark, mounted]);

  return (
    <div className="background-root">
      <canvas
        ref={canvasRef}
        className="background-canvas"
        aria-hidden="true"
      />
    </div>
  );
}
