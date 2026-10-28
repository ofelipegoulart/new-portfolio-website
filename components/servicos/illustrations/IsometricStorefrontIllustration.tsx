"use client";

import React, { useEffect, useRef } from 'react';

type Point = [number, number];
type PrismColors = {
  top: string;
  right: string;
  left: string;
  stroke?: string;
  lineWidth?: number;
};
type CharacterOptions = {
  x: number;
  y: number;
  z: number;
  scaleFactor?: number;
  role: string;
  wavePhase?: number;
  stride?: number;
  wrenchAngle?: number;
  opacity?: number;
};

export interface IsometricStorefrontHeroProps {
  /** Background color of the square illustration. Defaults to "#f3f0e8" */
  backgroundColor?: string;
  /** Accessible SEO description read by screen readers and search engines */
  alt?: string;
  /** Playback speed multiplier (default 1.0 for 4.00s loop) */
  speed?: number;
  /** Visual scale applied inside the clipped illustration frame. */
  zoom?: number;
  /** Optional className for sizing container */
  className?: string;
}

/**
 * Lightweight, SEO-friendly Next.js Isometric Storefront Component (~14 KB, 0 network requests)
 * Background: #f3f0e8
 */
export default function IsometricStorefrontHero({
  backgroundColor = '#f3f0e8',
  alt = 'Isometric neighborhood brick storefront with a roof crane lowering a website wireframe browser window, a worker adjusting it with a wrench, a customer holding a smartphone, and a friendly shop owner waving inside.',
  speed = 1,
  zoom = 1,
  className = 'w-full max-w-[640px] aspect-square mx-auto',
}: IsometricStorefrontHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let isVisible = true;
    let animTime = 2.35; // Render settled lit keyframe immediately on first paint for instant LCP
    let lastTs: number | null = null;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Draw initial settled keyframe immediately
    drawIsometricScene(ctx, canvas.width, canvas.height, animTime, false, backgroundColor);

    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastTs = null;
          rafId = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    function loop(ts: number) {
      if (!isVisible || !canvas || !ctx) return;
      if (lastTs !== null) {
        const dt = (ts - lastTs) / 1000;
        animTime = (animTime + dt * speed) % 4;
      } else {
        animTime = 0;
      }
      lastTs = ts;
      drawIsometricScene(ctx, canvas.width, canvas.height, animTime, false, backgroundColor);
      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [backgroundColor, speed]);

  return (
    <figure
      role="img"
      aria-label={alt}
      className={`relative block h-full w-full overflow-hidden select-none bg-[#f3f0e8] ${className}`}
      style={{ backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        width={1000}
        height={1000}
        className="w-full h-full object-contain block"
        style={{
          transform: `scale(${Math.max(1, Math.min(2, zoom))})`,
          transformOrigin: "center center",
        }}
      />
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}

const STYLE_PALETTE = {
  "seoWarmBg": "#f3f0e8",
  "terracottaBrick": "#D96B43",
  "terracottaBrickDark": "#B8502B",
  "terracottaMortar": "#F3D5C5",
  "creamStucco": "#F7F2E7",
  "creamStuccoShade": "#E5DCCB",
  "navyRoof": "#162B6F",
  "navyDeep": "#0F1F52",
  "royalFacade": "#1849C6",
  "royalBright": "#235AE4",
  "cyanHighlight": "#38BDF8",
  "warmInteriorFloor": "#FDE047",
  "warmInteriorWall": "#FEF08A",
  "warmWoodDoor": "#C26A2D",
  "warmWoodDoorDark": "#9A4E1C",
  "warmWoodLight": "#F59E0B",
  "warmWoodMid": "#D97706",
  "warmWoodDark": "#B45309",
  "pureWhite": "#FFFFFF",
  "lightGrey": "#CBD5E1",
  "midGrey": "#94A3B8",
  "strokeDark": "#1E293B",
  "strokeNavy": "#15275E",
  "orangeAccent": "#F97316",
  "orangeShade": "#EA580C",
  "orangeDeep": "#C2410C",
  "plantGreenLight": "#4ADE80",
  "plantGreenMid": "#22C55E",
  "plantGreenDark": "#15803D",
  "potTerracotta": "#D97706",
  "potTerracottaDark": "#B45309"
};
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOutCubic = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const easeOutBackPop = (t: number) => {
  const x = clamp01(t);
  if (x === 0 || x === 1) return x;
  const c1 = 2.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

function computeBrowserCraneLower(tSec: number) {
  if (tSec < 0.15) return { heightOffsetZ: 24, jibDeflection: 0, wrenchTurnAngle: 0 };
  if (tSec < 1.15) {
    const p = easeInOutCubic((tSec - 0.15) / 1.0);
    const settle = Math.sin(p * Math.PI) * 0.9;
    return {
      heightOffsetZ: 24 * (1 - p),
      jibDeflection: -settle,
      wrenchTurnAngle: p > 0.7 ? Math.sin((p - 0.7) * Math.PI * 10) * 0.6 : 0,
    };
  }
  if (tSec < 3.40) {
    const isTightening = tSec < 2.65;
    const wrench = isTightening ? Math.sin((tSec - 1.15) * Math.PI * 6) : 0;
    return { heightOffsetZ: 0, jibDeflection: 0, wrenchTurnAngle: wrench };
  }
  const r = easeInOutCubic((tSec - 3.40) / 0.60);
  return { heightOffsetZ: 24 * r, jibDeflection: 0, wrenchTurnAngle: 0 };
}

function computeWireframeLighting(tSec: number) {
  const fadeOut = tSec >= 3.40 ? 1 - easeInOutCubic((tSec - 3.40) / 0.55) : 1;
  const headerLit = easeOutCubic((tSec - 1.05) / 0.25) * fadeOut;
  const imageLit = easeOutCubic((tSec - 1.25) / 0.25) * fadeOut;
  const textBarsLit = easeOutCubic((tSec - 1.45) / 0.30) * fadeOut;
  const buttonPop = easeOutBackPop((tSec - 1.70) / 0.28) * fadeOut;
  const pinPop = easeOutBackPop((tSec - 1.90) / 0.28) * fadeOut;
  const chatPop = easeOutBackPop((tSec - 2.10) / 0.28) * fadeOut;
  let litCount = 0;
  if (headerLit > 0.5) litCount++;
  if (imageLit > 0.5) litCount++;
  if (textBarsLit > 0.5) litCount++;
  if (buttonPop > 0.5) litCount++;
  if (pinPop > 0.5) litCount++;
  if (chatPop > 0.5) litCount++;
  return { headerLit, imageLit, textBarsLit, buttonPop, pinPop, chatPop, litCount };
}

function computeCustomerWalk(tSec: number) {
  const doorCenterX = 52;
  if (tSec < 0.20) {
    const fadeIn = easeOutCubic(tSec / 0.20);
    return { x: doorCenterX, y: -60, z: 0, stridePhase: tSec * 4, opacity: fadeIn, doorSwing: 0.25 };
  }
  if (tSec < 3.05) {
    const p = easeInOutCubic((tSec - 0.20) / 2.85);
    const yPos = -60 + p * 68;
    const distToDoor = Math.abs(yPos - (-4));
    const doorOpen = distToDoor < 34 ? 0.25 + 0.75 * Math.cos((distToDoor / 34) * (Math.PI / 2)) : 0.25;
    return { x: doorCenterX, y: yPos, z: 0, stridePhase: tSec * 3.4, opacity: 1, doorSwing: doorOpen };
  }
  if (tSec < 3.50) {
    return { x: doorCenterX, y: 8, z: 0, stridePhase: 0, opacity: 1, doorSwing: 0.5 };
  }
  const r = easeInOutCubic((tSec - 3.50) / 0.50);
  return { x: doorCenterX, y: 8, z: 0, stridePhase: 0, opacity: 1 - r, doorSwing: 0.25 };
}

const drawIsometricScene = function drawIsometricScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tSec: number,
  showGuides: boolean,
  canvasBackground = "#f3f0e8",
) {
	ctx.save();
	ctx.clearRect(0, 0, width, height);
	// 1. Background fill (#f3f0e8 default as requested for Next.js app)
	if (canvasBackground !== "transparent") {
		ctx.fillStyle = canvasBackground;
		ctx.fillRect(0, 0, width, height);
	}
	const scale = width / 1e3;
	ctx.scale(scale, scale);
	// Origin (0,0,0) is the bottom-front apex of the cutaway building
	const originX = 505;
	const originY = 745;
	const iso = (x: number, y: number, z: number): Point => [originX + (x - y) * COS30, originY - (x + y) * SIN30 - z];
	const drawPoly = (pts: Point[], fill?: string, stroke?: string, lineWidth = 1.6, lineJoin: CanvasLineJoin = "round") => {
		if (pts.length === 0) return;
		ctx.beginPath();
		ctx.moveTo(pts[0][0], pts[0][1]);
		for (let i = 1; i < pts.length; i++) {
			ctx.lineTo(pts[i][0], pts[i][1]);
		}
		ctx.closePath();
		if (fill) {
			ctx.fillStyle = fill;
			ctx.fill();
		}
		if (stroke) {
			ctx.strokeStyle = stroke;
			ctx.lineWidth = lineWidth;
			ctx.lineJoin = lineJoin;
			ctx.stroke();
		}
	};
	const drawLine = (p1: Point, p2: Point, stroke: string, lineWidth = 1.5, dash?: number[]) => {
		ctx.save();
		if (dash) ctx.setLineDash(dash);
		ctx.beginPath();
		ctx.moveTo(p1[0], p1[1]);
		ctx.lineTo(p2[0], p2[1]);
		ctx.strokeStyle = stroke;
		ctx.lineWidth = lineWidth;
		ctx.lineCap = "round";
		ctx.stroke();
		ctx.restore();
	};
	const drawPrism = (x0: number, y0: number, z0: number, dx: number, dy: number, dz: number, colors: PrismColors) => {
		const x1 = x0 + dx;
		const y1 = y0 + dy;
		const z1 = z0 + dz;
		const lw = colors.lineWidth ?? 1.4;
		const st = colors.stroke ?? STYLE_PALETTE.strokeDark;
		// Front-Left face (x = x0)
		drawPoly([
			iso(x0, y0, z0),
			iso(x0, y1, z0),
			iso(x0, y1, z1),
			iso(x0, y0, z1)
		], colors.left, st, lw);
		// Front-Right face (y = y0)
		drawPoly([
			iso(x0, y0, z0),
			iso(x1, y0, z0),
			iso(x1, y0, z1),
			iso(x0, y0, z1)
		], colors.right, st, lw);
		// Top face (z = z1)
		drawPoly([
			iso(x0, y0, z1),
			iso(x1, y0, z1),
			iso(x1, y1, z1),
			iso(x0, y1, z1)
		], colors.top, st, lw);
	};
	const craneState = computeBrowserCraneLower(tSec);
	const wfState = computeWireframeLighting(tSec);
	const customerState = computeCustomerWalk(tSec);
	const harmonic = Math.sin(tSec / 4 * Math.PI * 2);
	const waveHarmonic = Math.sin(tSec / 4 * Math.PI * 8);
	const drawCharacter = (opts: CharacterOptions) => {
		const { x, y, z, scaleFactor = 1, role, wavePhase = 0, stride = 0, wrenchAngle = 0, opacity = 1 } = opts;
		ctx.save();
		ctx.globalAlpha = opacity;
		const s = scaleFactor;
		const legSpread = stride * 3.6 * s;
		// Ground contact shadow
		drawPoly([
			iso(x - 6 * s, y - 6 * s, z + .3),
			iso(x + 6 * s, y - 6 * s, z + .3),
			iso(x + 6 * s, y + 6 * s, z + .3),
			iso(x - 6 * s, y + 6 * s, z + .3)
		], "rgba(21, 39, 94, 0.20)");
		// Left leg
		drawPrism(x - 3.8 * s, y - 2.4 * s + legSpread, z, 3.4 * s, 4.4 * s, 2.5 * s, {
			top: "#FFFFFF",
			right: "#E2E8F0",
			left: "#FFFFFF",
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		drawPrism(x - 3.8 * s, y - 2.4 * s + legSpread, z + 2.5 * s, 3.4 * s, 4.4 * s, 8.8 * s, {
			top: STYLE_PALETTE.royalBright,
			right: STYLE_PALETTE.navyRoof,
			left: STYLE_PALETTE.royalFacade,
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		// Right leg
		drawPrism(x + .4 * s, y - 2.4 * s - legSpread, z, 3.4 * s, 4.4 * s, 2.5 * s, {
			top: "#FFFFFF",
			right: "#CBD5E1",
			left: "#FFFFFF",
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		drawPrism(x + .4 * s, y - 2.4 * s - legSpread, z + 2.5 * s, 3.4 * s, 4.4 * s, 8.8 * s, {
			top: STYLE_PALETTE.royalBright,
			right: STYLE_PALETTE.navyRoof,
			left: STYLE_PALETTE.royalFacade,
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		// Torso
		drawPrism(x - 4.8 * s, y - 3.4 * s, z + 11.3 * s, 9.6 * s, 6.8 * s, 13 * s, {
			top: STYLE_PALETTE.royalBright,
			right: STYLE_PALETTE.royalFacade,
			left: "#FFFFFF",
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.4
		});
		// Collar strip
		drawPrism(x - 4.9 * s, y - 3.5 * s, z + 22.8 * s, 9.8 * s, 7 * s, 1.8 * s, {
			top: "#FFFFFF",
			right: "#E2E8F0",
			left: "#FFFFFF",
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.2
		});
		// Left Arm
		if (role === "roof-wrench-worker") {
			const armZ = z + 16.5 * s + wrenchAngle * 1.8;
			drawPrism(x - 9.2 * s, y - 2.2 * s, armZ, 5 * s, 4 * s, 3.8 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: STYLE_PALETTE.strokeNavy,
				lineWidth: 1.25
			});
			const wrX = x - 11.5 * s;
			const wrY = y - 1 * s;
			const wrZ = armZ + 2.5 * s;
			drawLine(iso(wrX + 2.5 * s, wrY, wrZ - 2 * s), iso(wrX - 3.5 * s, wrY, wrZ + 6.5 * s + wrenchAngle * 2.5), STYLE_PALETTE.strokeNavy, 4.2);
			drawLine(iso(wrX + 2.5 * s, wrY, wrZ - 2 * s), iso(wrX - 3.5 * s, wrY, wrZ + 6.5 * s + wrenchAngle * 2.5), "#E2E8F0", 2.4);
			const headX = wrX - 3.8 * s;
			const headZ = wrZ + 7 * s + wrenchAngle * 2.5;
			drawPoly([
				iso(headX - 2.5, wrY, headZ + 2.5),
				iso(headX + 2.5, wrY, headZ + 2.5),
				iso(headX + 2.5, wrY, headZ - 2.5),
				iso(headX - 2.5, wrY, headZ - 2.5)
			], "#CBD5E1", STYLE_PALETTE.strokeNavy, 1.2);
		} else {
			drawPrism(x - 7.4 * s, y - 2.4 * s, z + 13.8 * s, 2.6 * s, 4.8 * s, 9 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: STYLE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		}
		// Right Arm
		if (role === "owner-waving") {
			const waveLift = (4.8 + wavePhase * 2.4) * s;
			const waveOut = (1.6 + wavePhase * 1.9) * s;
			drawPrism(x + 4.8 * s, y - 2.4 * s, z + 19.5 * s, 4.2 * s, 4.2 * s, 4 * s, {
				top: "#FFFFFF",
				right: STYLE_PALETTE.royalFacade,
				left: "#FFFFFF",
				stroke: STYLE_PALETTE.strokeNavy,
				lineWidth: 1.35
			});
			drawPrism(x + 6.4 * s + waveOut * .4, y - 2.2 * s, z + 21.5 * s + waveLift * .4, 3.2 * s, 3.8 * s, 8.4 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: STYLE_PALETTE.strokeNavy,
				lineWidth: 1.4
			});
		} else if (role === "customer-smartphone") {
			drawPrism(x + 4.8 * s, y - 3.2 * s, z + 16.5 * s, 4.5 * s, 5.2 * s, 4.2 * s, {
				top: "#FFFFFF",
				right: STYLE_PALETTE.royalFacade,
				left: "#FFFFFF",
				stroke: STYLE_PALETTE.strokeNavy,
				lineWidth: 1.35
			});
			const phX0 = x + 9.5 * s;
			const phW = 16.5;
			const phY = y - 6 * s;
			const phZ0 = z + 11 * s;
			const phH = 25;
			drawPrism(phX0, phY, phZ0, phW, 2.2, phH, {
				top: STYLE_PALETTE.royalBright,
				right: STYLE_PALETTE.navyRoof,
				left: STYLE_PALETTE.navyDeep,
				stroke: STYLE_PALETTE.strokeNavy,
				lineWidth: 1.4
			});
			const scX0 = phX0 + 1.8;
			const scX1 = phX0 + phW - 1.8;
			const scY = phY - .2;
			const scZ0 = phZ0 + 2.4;
			const scZ1 = phZ0 + phH - 2.4;
			drawPoly([
				iso(scX0, scY, scZ0),
				iso(scX1, scY, scZ0),
				iso(scX1, scY, scZ1),
				iso(scX0, scY, scZ1)
			], "#FFFFFF", STYLE_PALETTE.strokeNavy, 1.1);
			const hdrFill = wfState.headerLit > .2 ? STYLE_PALETTE.navyRoof : "#E2E8F0";
			drawPoly([
				iso(scX0 + 1.2, scY - .1, scZ1 - 3.5),
				iso(scX1 - 1.2, scY - .1, scZ1 - 3.5),
				iso(scX1 - 1.2, scY - .1, scZ1 - 1.2),
				iso(scX0 + 1.2, scY - .1, scZ1 - 1.2)
			], hdrFill);
			const imgFill = wfState.imageLit > .2 ? STYLE_PALETTE.royalBright : "#E2E8F0";
			drawPoly([
				iso(scX0 + 1.2, scY - .1, scZ1 - 10.5),
				iso(scX0 + 7.2, scY - .1, scZ1 - 10.5),
				iso(scX0 + 7.2, scY - .1, scZ1 - 4.5),
				iso(scX0 + 1.2, scY - .1, scZ1 - 4.5)
			], imgFill);
			const txtFill = wfState.textBarsLit > .2 ? "#94A3B8" : "#E2E8F0";
			drawLine(iso(scX0 + 8.2, scY - .1, scZ1 - 5.5), iso(scX1 - 1.2, scY - .1, scZ1 - 5.5), txtFill, 1.5);
			drawLine(iso(scX0 + 8.2, scY - .1, scZ1 - 7.5), iso(scX1 - 1.8, scY - .1, scZ1 - 7.5), txtFill, 1.5);
			drawLine(iso(scX0 + 1.2, scY - .1, scZ1 - 12.8), iso(scX1 - 1.5, scY - .1, scZ1 - 12.8), txtFill, 1.4);
			if (wfState.buttonPop > .1) {
				drawPoly([
					iso(scX0 + 8.2, scY - .1, scZ1 - 10.5),
					iso(scX1 - 1.5, scY - .1, scZ1 - 10.5),
					iso(scX1 - 1.5, scY - .1, scZ1 - 8.8),
					iso(scX0 + 8.2, scY - .1, scZ1 - 8.8)
				], STYLE_PALETTE.orangeAccent);
			}
			if (wfState.pinPop > .1) {
				drawPoly([
					iso(scX0 + 3.5, scY - .15, scZ0 + 1.8),
					iso(scX0 + 6.2, scY - .15, scZ0 + 1.8),
					iso(scX0 + 6.2, scY - .15, scZ0 + 4.5),
					iso(scX0 + 3.5, scY - .15, scZ0 + 4.5)
				], STYLE_PALETTE.orangeAccent);
			}
			if (wfState.chatPop > .1) {
				drawPoly([
					iso(scX0 + 8, scY - .15, scZ0 + 1.8),
					iso(scX0 + 10.8, scY - .15, scZ0 + 1.8),
					iso(scX0 + 10.8, scY - .15, scZ0 + 4.5),
					iso(scX0 + 8, scY - .15, scZ0 + 4.5)
				], STYLE_PALETTE.plantGreenMid);
			}
		} else {
			drawPrism(x + 4.8 * s, y - 2.4 * s, z + 13.8 * s, 2.6 * s, 4.8 * s, 9 * s, {
				top: "#FFFFFF",
				right: "#CBD5E1",
				left: "#FFFFFF",
				stroke: STYLE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		}
		// Head
		drawPrism(x - 4 * s, y - 3.3 * s, z + 24.6 * s, 8 * s, 6.6 * s, 8.8 * s, {
			top: "#FFFFFF",
			right: "#F1F5F9",
			left: "#FFFFFF",
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.4
		});
		// Cap / Helmet top
		const isHardHat = role === "roof-wrench-worker";
		drawPrism(x - 4.4 * s, y - 3.7 * s, z + 32.5 * s, 8.8 * s, 7.4 * s, 3 * s, {
			top: isHardHat ? STYLE_PALETTE.royalBright : STYLE_PALETTE.navyRoof,
			right: STYLE_PALETTE.navyDeep,
			left: STYLE_PALETTE.royalFacade,
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.35
		});
		ctx.restore();
	};
	const drawPottedPlant = (px: number, py: number, pz: number, sway: number) => {
		drawPoly([
			iso(px - 8, py - 8, pz + .2),
			iso(px + 8, py - 8, pz + .2),
			iso(px + 8, py + 8, pz + .2),
			iso(px - 8, py + 8, pz + .2)
		], "rgba(15, 23, 42, 0.16)");
		drawPrism(px - 6.5, py - 6.5, pz, 13, 13, 11, {
			top: STYLE_PALETTE.potTerracotta,
			right: STYLE_PALETTE.potTerracottaDark,
			left: STYLE_PALETTE.orangeAccent,
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		drawPrism(px - 7.8, py - 7.8, pz + 10, 15.6, 15.6, 3.5, {
			top: STYLE_PALETTE.orangeAccent,
			right: STYLE_PALETTE.potTerracottaDark,
			left: STYLE_PALETTE.potTerracotta,
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		const leafZ = pz + 13.5;
		drawPoly([
			iso(px, py, leafZ),
			iso(px - 10 + sway, py + 4, leafZ + 8),
			iso(px - 8 + sway, py - 2, leafZ + 17),
			iso(px - 1, py - 2, leafZ + 10)
		], STYLE_PALETTE.plantGreenMid, STYLE_PALETTE.strokeNavy, 1.3);
		drawPoly([
			iso(px, py, leafZ),
			iso(px + 10 + sway, py - 4, leafZ + 8),
			iso(px + 8 + sway, py + 2, leafZ + 17),
			iso(px + 1, py + 2, leafZ + 10)
		], STYLE_PALETTE.plantGreenDark, STYLE_PALETTE.strokeNavy, 1.3);
		drawPoly([
			iso(px - 4, py - 3, leafZ + 2),
			iso(px + sway * 1.2, py, leafZ + 23),
			iso(px + 4, py + 3, leafZ + 2)
		], STYLE_PALETTE.plantGreenLight, STYLE_PALETTE.strokeNavy, 1.35);
	};
	// ============================================================================
	// BUILDING DIMENSIONS & GEOMETRY
	// ============================================================================
	const BX = 148;
	const BY = 118;
	const FLOOR2_Z = 98;
	const TOP_BAND_Z = 186;
	const ROOF_Z = 212;
	const WALL_THICK = 6;
	// ============================================================================
	// 1. GROUND PLATFORM & SIDEWALK
	// ============================================================================
	const GX0 = -30;
	const GX1 = BX + 42;
	const GY0 = -74;
	const GY1 = BY + 86;
	const SLAB_H = 6;
	drawPoly([
		iso(GX0, GY0, 0),
		iso(GX1, GY0, 0),
		iso(GX1, GY1, 0),
		iso(GX0, GY1, 0)
	], "#FFFFFF", "#64748B", 1.5);
	drawPoly([
		iso(GX0, GY0, -SLAB_H),
		iso(GX0, GY1, -SLAB_H),
		iso(GX0, GY1, 0),
		iso(GX0, GY0, 0)
	], "#CBD5E1", "#475569", 1.4);
	drawPoly([
		iso(GX0, GY0, -SLAB_H),
		iso(GX1, GY0, -SLAB_H),
		iso(GX1, GY0, 0),
		iso(GX0, GY0, 0)
	], "#E2E8F0", "#475569", 1.4);
	drawLine(iso(0, 0, .2), iso(GX0, 0, .2), "#CBD5E1", 1.2);
	drawLine(iso(0, -38, .2), iso(GX1, -38, .2), "#E2E8F0", 1.1);
	for (let sx = 0; sx <= GX1; sx += 37) {
		drawLine(iso(sx, 0, .2), iso(sx, GY0, .2), "#E2E8F0", 1);
	}
	if (showGuides) {
		for (let gx = GX0; gx <= GX1; gx += 25) {
			drawLine(iso(gx, GY0, 0), iso(gx, GY1, 0), "rgba(37, 99, 235, 0.14)", 1, [3, 3]);
		}
		for (let gy = GY0; gy <= GY1; gy += 25) {
			drawLine(iso(GX0, gy, 0), iso(GX1, gy, 0), "rgba(37, 99, 235, 0.14)", 1, [3, 3]);
		}
	}
	// ============================================================================
	// 2. WARM YELLOW-LIT CUTAWAY INTERIOR ON THE LEFT SIDE
	// ============================================================================
	drawPoly([
		iso(0, BY, 0),
		iso(BX, BY, 0),
		iso(BX, BY, ROOF_Z),
		iso(0, BY, ROOF_Z)
	], STYLE_PALETTE.warmInteriorWall, STYLE_PALETTE.strokeNavy, 1.5);
	drawPoly([
		iso(0, 0, 1),
		iso(BX, 0, 1),
		iso(BX, BY, 1),
		iso(0, BY, 1)
	], STYLE_PALETTE.warmInteriorFloor, STYLE_PALETTE.strokeNavy, 1.3);
	drawPoly([
		iso(26, 0, .3),
		iso(136, 0, .3),
		iso(142, -30, .3),
		iso(20, -30, .3)
	], "rgba(254, 240, 138, 0.48)");
	const drawWarmShelvingUnit = (sx: number, sy: number, sz: number, shelfCount: number) => {
		const unitW = 54;
		const unitD = 15;
		const unitH = shelfCount * 19 + 7;
		drawPrism(sx, sy, sz, unitW, unitD, unitH, {
			top: "#FDE68A",
			right: STYLE_PALETTE.warmWoodMid,
			left: STYLE_PALETTE.warmWoodLight,
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.25
		});
		for (let level = 0; level < shelfCount; level++) {
			const lz = sz + 4 + level * 19;
			drawPrism(sx - 1, sy - 2, lz, unitW + 2, unitD + 2, 2.8, {
				top: "#FEF9C3",
				right: STYLE_PALETTE.warmWoodDark,
				left: STYLE_PALETTE.warmWoodLight,
				stroke: STYLE_PALETTE.strokeNavy,
				lineWidth: 1.1
			});
			for (let b = 0; b < 3; b++) {
				const bx = sx + 5 + b * 16;
				const by = sy - 1;
				const bz = lz + 2.8;
				const isOrangeBox = (level + b) % 2 === 0;
				drawPrism(bx, by, bz, 10, 10, 9.5, {
					top: "#FFFFFF",
					right: isOrangeBox ? STYLE_PALETTE.orangeShade : STYLE_PALETTE.royalFacade,
					left: isOrangeBox ? STYLE_PALETTE.orangeAccent : STYLE_PALETTE.cyanHighlight,
					stroke: STYLE_PALETTE.strokeNavy,
					lineWidth: 1.05
				});
			}
		}
	};
	drawWarmShelvingUnit(16, BY - 22, 2, 3);
	drawWarmShelvingUnit(80, BY - 22, 2, 3);
	drawCharacter({
		x: 42,
		y: 66,
		z: 2,
		scaleFactor: 1.08,
		role: "owner-waving",
		wavePhase: waveHarmonic,
		stride: 0
	});
	drawPrism(18, 38, 2, 54, 18, 20, {
		top: "#FEF3C7",
		right: STYLE_PALETTE.warmWoodDark,
		left: STYLE_PALETTE.warmWoodLight,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	drawPrism(52, 41, 22, 13, 11, 9.5, {
		top: "#FFFFFF",
		right: STYLE_PALETTE.navyRoof,
		left: STYLE_PALETTE.royalFacade,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.2
	});
	drawPrism(26, 42, 22, 6, 6, 7.5, {
		top: "#FFFFFF",
		right: STYLE_PALETTE.orangeShade,
		left: STYLE_PALETTE.orangeAccent,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.1
	});
	if (customerState.y >= -3) {
		drawCharacter({
			x: customerState.x,
			y: customerState.y,
			z: 2,
			scaleFactor: 1.08,
			role: "customer-smartphone",
			stride: Math.sin(customerState.stridePhase * Math.PI * 2),
			opacity: customerState.opacity
		});
	}
	// ============================================================================
	// 3. SECOND FLOOR WARM-LIT SLAB, SHELVES & WORKER
	// ============================================================================
	drawPoly([
		iso(0, 0, FLOOR2_Z),
		iso(BX, 0, FLOOR2_Z),
		iso(BX, BY, FLOOR2_Z),
		iso(0, BY, FLOOR2_Z)
	], STYLE_PALETTE.warmInteriorFloor, STYLE_PALETTE.strokeNavy, 1.5);
	drawPoly([
		iso(0, 0, FLOOR2_Z - 5),
		iso(0, BY, FLOOR2_Z - 5),
		iso(0, BY, FLOOR2_Z),
		iso(0, 0, FLOOR2_Z)
	], STYLE_PALETTE.creamStuccoShade, STYLE_PALETTE.strokeNavy, 1.3);
	drawWarmShelvingUnit(22, BY - 22, FLOOR2_Z + 1, 2);
	drawCharacter({
		x: 50 + harmonic * 5,
		y: 66,
		z: FLOOR2_Z + 1,
		scaleFactor: 1,
		role: "shelf-worker",
		stride: Math.cos(tSec / 4 * Math.PI * 2) * .5
	});
	// ============================================================================
	// 4. CUTAWAY STRUCTURAL FRAME ON LEFT SIDE
	// ============================================================================
	drawPrism(-WALL_THICK, BY - WALL_THICK, 0, WALL_THICK, WALL_THICK, ROOF_Z, {
		top: STYLE_PALETTE.creamStucco,
		right: STYLE_PALETTE.creamStuccoShade,
		left: STYLE_PALETTE.creamStucco,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	drawPrism(-WALL_THICK, -2, 0, WALL_THICK, WALL_THICK + 2, ROOF_Z, {
		top: STYLE_PALETTE.creamStucco,
		right: STYLE_PALETTE.creamStuccoShade,
		left: STYLE_PALETTE.creamStucco,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	drawPrism(-WALL_THICK, 0, TOP_BAND_Z, WALL_THICK, BY, ROOF_Z - TOP_BAND_Z, {
		top: STYLE_PALETTE.creamStucco,
		right: STYLE_PALETTE.navyRoof,
		left: STYLE_PALETTE.creamStuccoShade,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	// ============================================================================
	// 5. WARM NEIGHBORHOOD SHOP FACADE IN EXPOSED TERRACOTTA BRICK & CREAM STUCCO
	// ============================================================================
	drawPoly([
		iso(0, 0, 0),
		iso(BX, 0, 0),
		iso(BX, 0, TOP_BAND_Z),
		iso(0, 0, TOP_BAND_Z)
	], STYLE_PALETTE.terracottaBrick, STYLE_PALETTE.strokeNavy, 1.8);
	for (let bz = 14; bz < TOP_BAND_Z; bz += 10) {
		drawLine(iso(4, -.1, bz), iso(BX - 4, -.1, bz), "rgba(247, 242, 231, 0.38)", 1);
		const offset = bz / 10 % 2 === 0 ? 0 : 9;
		for (let bx = 12 + offset; bx < BX - 10; bx += 18) {
			drawLine(iso(bx, -.1, bz), iso(bx, -.1, bz + 10), "rgba(184, 80, 43, 0.45)", 1);
		}
	}
	for (let qz = 8; qz < TOP_BAND_Z - 8; qz += 16) {
		drawPrism(0, -1.8, qz, 11, 1.8, 11, {
			top: STYLE_PALETTE.creamStucco,
			right: STYLE_PALETTE.creamStucco,
			left: STYLE_PALETTE.creamStuccoShade,
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.15
		});
		drawPrism(BX - 11, -1.8, qz, 11, 1.8, 11, {
			top: STYLE_PALETTE.creamStucco,
			right: STYLE_PALETTE.creamStucco,
			left: STYLE_PALETTE.creamStuccoShade,
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.15
		});
	}
	drawPrism(0, -2.2, FLOOR2_Z - 4, BX, 2.2, 8, {
		top: "#FFFFFF",
		right: STYLE_PALETTE.creamStucco,
		left: STYLE_PALETTE.creamStuccoShade,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.35
	});
	// ============================================================================
	// 6. GROUND-FLOOR LARGE SHOP DISPLAY WINDOW & WOODEN DOOR
	// ============================================================================
	const WIN_X0 = 68;
	const WIN_X1 = 134;
	const WIN_Z0 = 18;
	const WIN_Z1 = 74;
	drawPrism(WIN_X0 - 2, -2.5, 0, WIN_X1 - WIN_X0 + 4, 2.5, WIN_Z0, {
		top: STYLE_PALETTE.royalBright,
		right: STYLE_PALETTE.navyRoof,
		left: STYLE_PALETTE.royalFacade,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	drawPrism(WIN_X0 - 2, -2, WIN_Z0, WIN_X1 - WIN_X0 + 4, 2, WIN_Z1 - WIN_Z0 + 2, {
		top: STYLE_PALETTE.royalBright,
		right: STYLE_PALETTE.navyRoof,
		left: STYLE_PALETTE.royalFacade,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	drawPoly([
		iso(WIN_X0 + 1, -2.2, WIN_Z0 + 2),
		iso(WIN_X1 - 1, -2.2, WIN_Z0 + 2),
		iso(WIN_X1 - 1, -2.2, WIN_Z1 - 1),
		iso(WIN_X0 + 1, -2.2, WIN_Z1 - 1)
	], STYLE_PALETTE.warmInteriorFloor, STYLE_PALETTE.strokeNavy, 1.3);
	for (let tier = 0; tier < 2; tier++) {
		const shelfZ = WIN_Z0 + 6 + tier * 22;
		drawPoly([
			iso(WIN_X0 + 4, -2.3, shelfZ),
			iso(WIN_X1 - 4, -2.3, shelfZ),
			iso(WIN_X1 - 4, -2.3, shelfZ + 3.5),
			iso(WIN_X0 + 4, -2.3, shelfZ + 3.5)
		], STYLE_PALETTE.warmWoodLight, STYLE_PALETTE.strokeNavy, 1.1);
		for (let p = 0; p < 4; p++) {
			const px = WIN_X0 + 8 + p * 14;
			const pz = shelfZ + 3.5;
			const itemColors = [
				{
					top: "#FFFFFF",
					right: STYLE_PALETTE.orangeAccent,
					left: STYLE_PALETTE.orangeShade
				},
				{
					top: "#FFFFFF",
					right: STYLE_PALETTE.royalBright,
					left: STYLE_PALETTE.navyRoof
				},
				{
					top: "#FFFFFF",
					right: STYLE_PALETTE.plantGreenMid,
					left: STYLE_PALETTE.plantGreenDark
				},
				{
					top: "#FEF9C3",
					right: STYLE_PALETTE.warmWoodMid,
					left: STYLE_PALETTE.warmWoodDark
				}
			][(p + tier) % 4];
			drawPrism(px, -2.4, pz, 9.5, 2.2, 11.5, {
				...itemColors,
				stroke: STYLE_PALETTE.strokeNavy,
				lineWidth: 1.05
			});
		}
	}
	drawPoly([
		iso(WIN_X0 + 10, -2.5, WIN_Z0 + 2),
		iso(WIN_X0 + 24, -2.5, WIN_Z0 + 2),
		iso(WIN_X0 + 50, -2.5, WIN_Z1 - 1),
		iso(WIN_X0 + 36, -2.5, WIN_Z1 - 1)
	], "rgba(255, 255, 255, 0.35)");
	// Wooden Entrance Door
	const DOOR_X0 = 28;
	const DOOR_X1 = 62;
	const DOOR_Z1 = 74;
	drawPrism(DOOR_X0 - 2.5, -2, 0, DOOR_X1 - DOOR_X0 + 5, 2, DOOR_Z1 + 2, {
		top: STYLE_PALETTE.royalBright,
		right: STYLE_PALETTE.navyRoof,
		left: STYLE_PALETTE.royalFacade,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	drawPoly([
		iso(DOOR_X0, -2.1, 0),
		iso(DOOR_X1, -2.1, 0),
		iso(DOOR_X1, -2.1, DOOR_Z1),
		iso(DOOR_X0, -2.1, DOOR_Z1)
	], STYLE_PALETTE.warmInteriorFloor, STYLE_PALETTE.strokeNavy, 1.4);
	const doorSwingY = -2.2 - 11 * customerState.doorSwing;
	const doorSwingX = DOOR_X0 + (DOOR_X1 - DOOR_X0) * (1 - customerState.doorSwing * .22);
	drawPoly([
		iso(DOOR_X0, -2.2, 0),
		iso(doorSwingX, doorSwingY, 0),
		iso(doorSwingX, doorSwingY, DOOR_Z1),
		iso(DOOR_X0, -2.2, DOOR_Z1)
	], STYLE_PALETTE.warmWoodDoor, STYLE_PALETTE.strokeNavy, 1.6);
	const lerpIso = (fx: number, z: number): Point => {
		const x = DOOR_X0 + (doorSwingX - DOOR_X0) * fx;
		const y = -2.2 + (doorSwingY - -2.2) * fx;
		return iso(x, y, z);
	};
	drawPoly([
		lerpIso(.16, 36),
		lerpIso(.84, 36),
		lerpIso(.84, 66),
		lerpIso(.16, 66)
	], "#FEF08A", STYLE_PALETTE.strokeNavy, 1.3);
	drawPoly([
		lerpIso(.16, 7),
		lerpIso(.84, 7),
		lerpIso(.84, 29),
		lerpIso(.16, 29)
	], STYLE_PALETTE.warmWoodDoorDark, STYLE_PALETTE.strokeNavy, 1.2);
	drawLine(lerpIso(.88, 28), lerpIso(.88, 40), "#FACC15", 2.2);
	// ============================================================================
	// 7. UPPER-FLOOR NEIGHBORHOOD WINDOWS
	// ============================================================================
	const upperWinCenters = [
		32,
		74,
		116
	];
	for (const wx of upperWinCenters) {
		const w0 = wx - 11;
		const w1 = wx + 11;
		const wz0 = FLOOR2_Z + 18;
		const wz1 = FLOOR2_Z + 62;
		drawPrism(w0 - 2.5, -2.8, wz0 - 4, 27, 2.8, 4, {
			top: "#FFFFFF",
			right: STYLE_PALETTE.creamStucco,
			left: STYLE_PALETTE.creamStuccoShade,
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.2
		});
		drawPrism(w0 - 2.5, -2.8, wz1, 27, 2.8, 5, {
			top: "#FFFFFF",
			right: STYLE_PALETTE.creamStucco,
			left: STYLE_PALETTE.creamStuccoShade,
			stroke: STYLE_PALETTE.strokeNavy,
			lineWidth: 1.2
		});
		drawPoly([
			iso(w0, -1.5, wz0),
			iso(w1, -1.5, wz0),
			iso(w1, -1.5, wz1),
			iso(w0, -1.5, wz1)
		], STYLE_PALETTE.royalBright, STYLE_PALETTE.strokeNavy, 1.35);
		drawPoly([
			iso(w0 + 2.5, -1.6, wz0 + 2.5),
			iso(w1 - 2.5, -1.6, wz0 + 2.5),
			iso(w1 - 2.5, -1.6, wz1 - 2.5),
			iso(w0 + 2.5, -1.6, wz1 - 2.5)
		], "#FEF08A", STYLE_PALETTE.strokeNavy, 1.15);
		drawLine(iso(wx, -1.7, wz0 + 2), iso(wx, -1.7, wz1 - 2), STYLE_PALETTE.royalBright, 2.2);
		drawLine(iso(w0 + 2, -1.7, wz0 + 26), iso(w1 - 2, -1.7, wz0 + 26), STYLE_PALETTE.royalBright, 2.2);
	}
	// ============================================================================
	// 8. THIN TOP CORNICE BAND
	// ============================================================================
	const barZ0 = TOP_BAND_Z;
	const barZ1 = ROOF_Z - 4;
	drawPrism(0, -2.6, barZ0, BX, 2.6, barZ1 - barZ0, {
		top: "#FFFFFF",
		right: STYLE_PALETTE.creamStucco,
		left: STYLE_PALETTE.creamStuccoShade,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.6
	});
	drawPoly([
		iso(6, -2.8, barZ0 + 5),
		iso(BX - 6, -2.8, barZ0 + 5),
		iso(BX - 6, -2.8, barZ1 - 5),
		iso(6, -2.8, barZ1 - 5)
	], STYLE_PALETTE.creamStuccoShade, STYLE_PALETTE.navyRoof, 1.5);
	drawLine(iso(8, -2.9, (barZ0 + barZ1) / 2), iso(BX - 8, -2.9, (barZ0 + barZ1) / 2), STYLE_PALETTE.royalBright, 2.2);
	// ============================================================================
	// 9. POTTED PLANTS, CUSTOMER HOLDING SMARTPHONE & STRIPED AWNING
	// ============================================================================
	const plantSway = Math.sin(tSec / 4 * Math.PI * 2) * 1.2;
	drawPottedPlant(12, -14, 0, plantSway);
	if (customerState.y < -3) {
		drawCharacter({
			x: customerState.x,
			y: customerState.y,
			z: 0,
			scaleFactor: 1.08,
			role: "customer-smartphone",
			stride: Math.sin(customerState.stridePhase * Math.PI * 2),
			opacity: customerState.opacity
		});
	}
	drawPottedPlant(140, -14, 0, -plantSway);
	const AWNING_X0 = 20;
	const AWNING_X1 = 140;
	const AWNING_Z_WALL = 94;
	const AWNING_Z_FRONT = 72;
	const AWNING_Y_FRONT = -24;
	const STRIPE_COUNT = 10;
	const stripeW = (AWNING_X1 - AWNING_X0) / STRIPE_COUNT;
	drawPoly([
		iso(AWNING_X0, -2, AWNING_Z_WALL),
		iso(AWNING_X0, AWNING_Y_FRONT, AWNING_Z_FRONT),
		iso(AWNING_X0, -2, AWNING_Z_FRONT)
	], STYLE_PALETTE.navyRoof, STYLE_PALETTE.strokeNavy, 1.4);
	for (let s = 0; s < STRIPE_COUNT; s++) {
		const sx0 = AWNING_X0 + s * stripeW;
		const sx1 = sx0 + stripeW;
		const isBlueStripe = s % 2 === 0;
		const fill = isBlueStripe ? STYLE_PALETTE.royalFacade : STYLE_PALETTE.warmWoodLight;
		const valenceFill = isBlueStripe ? STYLE_PALETTE.navyRoof : STYLE_PALETTE.orangeAccent;
		drawPoly([
			iso(sx0, -2, AWNING_Z_WALL),
			iso(sx1, -2, AWNING_Z_WALL),
			iso(sx1, AWNING_Y_FRONT, AWNING_Z_FRONT),
			iso(sx0, AWNING_Y_FRONT, AWNING_Z_FRONT)
		], fill, STYLE_PALETTE.strokeNavy, 1.35);
		drawPoly([
			iso(sx0, AWNING_Y_FRONT, AWNING_Z_FRONT),
			iso(sx1, AWNING_Y_FRONT, AWNING_Z_FRONT),
			iso(sx1 - 1.2, AWNING_Y_FRONT, AWNING_Z_FRONT - 5.5),
			iso((sx0 + sx1) / 2, AWNING_Y_FRONT, AWNING_Z_FRONT - 7.5),
			iso(sx0 + 1.2, AWNING_Y_FRONT, AWNING_Z_FRONT - 5.5)
		], valenceFill, STYLE_PALETTE.strokeNavy, 1.3);
	}
	// ============================================================================
	// 10. ROOF SLAB, CRANE, WRENCH WORKER & LARGE BROWSER WINDOW WITH WEBSITE WIREFRAME
	// ============================================================================
	drawPrism(-WALL_THICK, -2.6, ROOF_Z - 4, BX + WALL_THICK + 2, BY + 4.6, 8, {
		top: "#E2E8F0",
		right: STYLE_PALETTE.creamStucco,
		left: "#FFFFFF",
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.6
	});
	drawPoly([
		iso(6, 6, ROOF_Z + 4.2),
		iso(BX - 6, 6, ROOF_Z + 4.2),
		iso(BX - 6, BY - 6, ROOF_Z + 4.2),
		iso(6, BY - 6, ROOF_Z + 4.2)
	], "#CBD5E1", STYLE_PALETTE.strokeNavy, 1.3);
	const CRANE_X = 36;
	const CRANE_Y = 78;
	const CRANE_BASE_Z = ROOF_Z + 4;
	const CRANE_TOP_Z = ROOF_Z + 108;
	drawPrism(CRANE_X - 12, CRANE_Y - 12, CRANE_BASE_Z, 24, 24, 8, {
		top: STYLE_PALETTE.royalBright,
		right: STYLE_PALETTE.navyRoof,
		left: STYLE_PALETTE.royalFacade,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	drawPrism(CRANE_X - 5, CRANE_Y - 5, CRANE_BASE_Z + 8, 10, 10, 94, {
		top: "#FFFFFF",
		right: "#CBD5E1",
		left: "#FFFFFF",
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	for (let mz = CRANE_BASE_Z + 12; mz < CRANE_TOP_Z - 10; mz += 12) {
		drawLine(iso(CRANE_X - 5, CRANE_Y - 5, mz), iso(CRANE_X + 5, CRANE_Y - 5, mz + 12), STYLE_PALETTE.strokeNavy, 1.05);
		drawLine(iso(CRANE_X - 5, CRANE_Y - 5, mz), iso(CRANE_X - 5, CRANE_Y + 5, mz + 12), STYLE_PALETTE.strokeNavy, 1.05);
	}
	drawPrism(CRANE_X - 8.5, CRANE_Y - 8.5, CRANE_TOP_Z - 16, 17, 17, 15, {
		top: STYLE_PALETTE.warmWoodLight,
		right: STYLE_PALETTE.orangeShade,
		left: STYLE_PALETTE.orangeAccent,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.35
	});
	drawPoly([
		iso(CRANE_X - 8.8, CRANE_Y - 5, CRANE_TOP_Z - 11),
		iso(CRANE_X - 8.8, CRANE_Y + 3, CRANE_TOP_Z - 11),
		iso(CRANE_X - 8.8, CRANE_Y + 3, CRANE_TOP_Z - 4),
		iso(CRANE_X - 8.8, CRANE_Y - 5, CRANE_TOP_Z - 4)
	], STYLE_PALETTE.navyRoof, STYLE_PALETTE.strokeNavy, 1.1);
	const BW_X0 = 26;
	const BW_W = 86;
	const BW_Y = 14;
	const BW_BASE_Z = ROOF_Z + 6 + craneState.heightOffsetZ;
	const BW_H = 68;
	const BW_TOP_Z = BW_BASE_Z + BW_H;
	drawPrism(BW_X0 + 14, BW_Y - 4, ROOF_Z + 4, 8, 8, 4, {
		top: "#FFFFFF",
		right: "#94A3B8",
		left: "#CBD5E1",
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.15
	});
	drawPrism(BW_X0 + BW_W - 22, BW_Y - 4, ROOF_Z + 4, 8, 8, 4, {
		top: "#FFFFFF",
		right: "#94A3B8",
		left: "#CBD5E1",
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.15
	});
	drawCharacter({
		x: BW_X0 + BW_W + 13,
		y: BW_Y + 4,
		z: ROOF_Z + 4.5,
		scaleFactor: .92,
		role: "roof-wrench-worker",
		wrenchAngle: craneState.wrenchTurnAngle,
		stride: 0
	});
	const HOOK_X = BW_X0 + BW_W / 2;
	const HOOK_Y = BW_Y + 3;
	const JIB_Z = CRANE_TOP_Z - 4 + craneState.jibDeflection;
	drawLine(iso(CRANE_X - 20, CRANE_Y + 26, JIB_Z), iso(HOOK_X, HOOK_Y, JIB_Z), STYLE_PALETTE.strokeNavy, 5);
	drawLine(iso(CRANE_X - 20, CRANE_Y + 26, JIB_Z), iso(HOOK_X, HOOK_Y, JIB_Z), "#E2E8F0", 2.8);
	drawLine(iso(CRANE_X, CRANE_Y, CRANE_TOP_Z + 8), iso(HOOK_X, HOOK_Y, JIB_Z), STYLE_PALETTE.strokeNavy, 1.2);
	drawLine(iso(CRANE_X, CRANE_Y, CRANE_TOP_Z + 8), iso(CRANE_X - 18, CRANE_Y + 24, JIB_Z), STYLE_PALETTE.strokeNavy, 1.2);
	const hookZ = BW_TOP_Z + 11;
	drawLine(iso(HOOK_X, HOOK_Y, JIB_Z), iso(HOOK_X, HOOK_Y, hookZ), STYLE_PALETTE.strokeNavy, 1.5);
	drawPrism(HOOK_X - 3, HOOK_Y - 3, hookZ - 4, 6, 6, 5, {
		top: STYLE_PALETTE.orangeAccent,
		right: STYLE_PALETTE.orangeShade,
		left: STYLE_PALETTE.orangeAccent,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.15
	});
	drawLine(iso(HOOK_X, HOOK_Y, hookZ - 4), iso(BW_X0 + 20, BW_Y + 3, BW_TOP_Z), STYLE_PALETTE.strokeNavy, 1.3);
	drawLine(iso(HOOK_X, HOOK_Y, hookZ - 4), iso(BW_X0 + BW_W - 20, BW_Y + 3, BW_TOP_Z), STYLE_PALETTE.strokeNavy, 1.3);
	// ============================================================================
	// 11. THE LARGE BROWSER WINDOW ON THE ROOF & ANIMATED WEBSITE WIREFRAME
	// ============================================================================
	drawPrism(BW_X0, BW_Y, BW_BASE_Z, BW_W, 6, BW_H, {
		top: STYLE_PALETTE.royalBright,
		right: "#FFFFFF",
		left: STYLE_PALETTE.navyRoof,
		stroke: STYLE_PALETTE.strokeNavy,
		lineWidth: 1.7
	});
	const topBarZ0 = BW_TOP_Z - 11;
	const fY = BW_Y - .25;
	drawPoly([
		iso(BW_X0, fY, topBarZ0),
		iso(BW_X0 + BW_W, fY, topBarZ0),
		iso(BW_X0 + BW_W, fY, BW_TOP_Z),
		iso(BW_X0, fY, BW_TOP_Z)
	], STYLE_PALETTE.navyRoof, STYLE_PALETTE.strokeNavy, 1.5);
	const drawBrowserCircle = (cx: number, cz: number, r: number, fill: string, stroke: string, lw = 1.1) => {
		if (r <= .1) return;
		const pts = [];
		const steps = 20;
		for (let i = 0; i < steps; i++) {
			const a = i / steps * Math.PI * 2;
			pts.push(iso(cx + Math.cos(a) * r, fY - .15, cz + Math.sin(a) * r));
		}
		drawPoly(pts, fill, stroke, lw);
	};
	const dotZ = topBarZ0 + 5.5;
	drawBrowserCircle(BW_X0 + 7, dotZ, 2.2, STYLE_PALETTE.orangeAccent, "#FFFFFF", .9);
	drawBrowserCircle(BW_X0 + 13.5, dotZ, 2.2, "#FACC15", "#FFFFFF", .9);
	drawBrowserCircle(BW_X0 + 20, dotZ, 2.2, STYLE_PALETTE.plantGreenMid, "#FFFFFF", .9);
	const WX0 = BW_X0 + 5;
	const WX1 = BW_X0 + BW_W - 5;
	const WZ0 = BW_BASE_Z + 5;
	const WZ1 = topBarZ0 - 3;
	// BLOCK 1: Header Strip
	const hdrZ0 = WZ1 - 7.5;
	const hdrColor = wfState.headerLit > .05 ? wfState.headerLit > .6 ? STYLE_PALETTE.navyDeep : STYLE_PALETTE.royalFacade : "#E2E8F0";
	drawPoly([
		iso(WX0, fY - .1, hdrZ0),
		iso(WX1, fY - .1, hdrZ0),
		iso(WX1, fY - .1, WZ1),
		iso(WX0, fY - .1, WZ1)
	], hdrColor, STYLE_PALETTE.strokeNavy, 1.15);
	// BLOCK 2: Large Image Block
	const imgX0 = WX0;
	const imgX1 = WX0 + 34;
	const imgZ0 = WZ0 + 14;
	const imgZ1 = hdrZ0 - 4;
	const imgFill = wfState.imageLit > .05 ? wfState.imageLit > .6 ? STYLE_PALETTE.cyanHighlight : "#93C5FD" : "#F1F5F9";
	drawPoly([
		iso(imgX0, fY - .1, imgZ0),
		iso(imgX1, fY - .1, imgZ0),
		iso(imgX1, fY - .1, imgZ1),
		iso(imgX0, fY - .1, imgZ1)
	], imgFill, STYLE_PALETTE.strokeNavy, 1.25);
	if (wfState.imageLit > .25) {
		drawPoly([
			iso(imgX0 + 1, fY - .15, imgZ0 + 1),
			iso(imgX0 + 14, fY - .15, imgZ0 + 15),
			iso(imgX0 + 23, fY - .15, imgZ0 + 7),
			iso(imgX0 + 29, fY - .15, imgZ0 + 12),
			iso(imgX1 - 1, fY - .15, imgZ0 + 1)
		], STYLE_PALETTE.royalFacade);
	}
	// BLOCK 3: Gray Bars as Text Lines
	const txtX0 = imgX1 + 5;
	const txtX1 = WX1;
	const barActiveColor = wfState.textBarsLit > .2 ? "#94A3B8" : "#E2E8F0";
	const barSubtleColor = wfState.textBarsLit > .5 ? "#CBD5E1" : "#F1F5F9";
	const textBarSpecs = [
		{
			x0: txtX0,
			x1: txtX1,
			z0: imgZ1 - 4.5,
			z1: imgZ1 - 1,
			color: barActiveColor
		},
		{
			x0: txtX0,
			x1: txtX1 - 4,
			z0: imgZ1 - 10.5,
			z1: imgZ1 - 7,
			color: barActiveColor
		},
		{
			x0: txtX0,
			x1: txtX1 - 9,
			z0: imgZ1 - 16.5,
			z1: imgZ1 - 13,
			color: barSubtleColor
		},
		{
			x0: imgX0,
			x1: imgX1,
			z0: WZ0 + 7.5,
			z1: WZ0 + 10.5,
			color: barActiveColor
		},
		{
			x0: imgX0,
			x1: imgX1 - 8,
			z0: WZ0 + 2.5,
			z1: WZ0 + 5.5,
			color: barSubtleColor
		}
	];
	for (const bar of textBarSpecs) {
		drawPoly([
			iso(bar.x0, fY - .1, bar.z0),
			iso(bar.x1, fY - .1, bar.z0),
			iso(bar.x1, fY - .1, bar.z1),
			iso(bar.x0, fY - .1, bar.z1)
		], bar.color);
	}
	// BLOCK 4: Small Orange Button
	if (wfState.buttonPop > .04) {
		const sPop = wfState.buttonPop;
		const btnCX = txtX0 + 11;
		const btnCZ = imgZ0 + 3.5;
		const hw = 11 * sPop;
		const hh = 3.8 * sPop;
		drawPoly([
			iso(btnCX - hw, fY - .18, btnCZ - hh),
			iso(btnCX + hw, fY - .18, btnCZ - hh),
			iso(btnCX + hw, fY - .18, btnCZ + hh),
			iso(btnCX - hw, fY - .18, btnCZ + hh)
		], STYLE_PALETTE.orangeAccent, STYLE_PALETTE.strokeNavy, 1.2);
	}
	// BLOCK 5: Small Orange Map Pin Icon
	if (wfState.pinPop > .04) {
		const pScale = wfState.pinPop;
		const pinCX = txtX0 + 12;
		const pinCZ = WZ0 + 8.5;
		const pr = 4.6 * pScale;
		drawPoly([
			iso(pinCX - pr * .85, fY - .2, pinCZ - 1 * pScale),
			iso(pinCX + pr * .85, fY - .2, pinCZ - 1 * pScale),
			iso(pinCX, fY - .2, pinCZ - 7.2 * pScale)
		], STYLE_PALETTE.orangeAccent, STYLE_PALETTE.strokeNavy, 1.15);
		drawBrowserCircle(pinCX, pinCZ, pr, STYLE_PALETTE.orangeAccent, STYLE_PALETTE.strokeNavy, 1.15);
		drawBrowserCircle(pinCX, pinCZ, pr * .42, "#FFFFFF", STYLE_PALETTE.strokeNavy, .9);
	}
	// BLOCK 6: Small WhatsApp-Style Chat Bubble Icon
	if (wfState.chatPop > .04) {
		const cScale = wfState.chatPop;
		const chatCX = txtX0 + 28;
		const chatCZ = WZ0 + 7.5;
		const cr = 5.8 * cScale;
		drawPoly([
			iso(chatCX - cr * .5, fY - .2, chatCZ - cr * .6),
			iso(chatCX - cr * 1.15, fY - .2, chatCZ - cr * 1.1),
			iso(chatCX - cr * .1, fY - .2, chatCZ - cr * .85)
		], STYLE_PALETTE.plantGreenMid, STYLE_PALETTE.strokeNavy, 1.15);
		drawBrowserCircle(chatCX, chatCZ, cr, STYLE_PALETTE.plantGreenMid, STYLE_PALETTE.strokeNavy, 1.15);
		drawLine(iso(chatCX - 2.2 * cScale, fY - .28, chatCZ + 2 * cScale), iso(chatCX - .5 * cScale, fY - .28, chatCZ - 1.5 * cScale), "#FFFFFF", 1.8 * Math.min(1, cScale));
		drawLine(iso(chatCX - .5 * cScale, fY - .28, chatCZ - 1.5 * cScale), iso(chatCX + 2.4 * cScale, fY - .28, chatCZ - 2 * cScale), "#FFFFFF", 1.8 * Math.min(1, cScale));
	}
	ctx.restore();
};
