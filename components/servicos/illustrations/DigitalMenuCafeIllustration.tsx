'use client';

import React, { useEffect, useRef } from 'react';

type Point = [number, number];
type TubeSample = {
  pos: [number, number, number];
  tangent: [number, number, number];
};
type PrismColors = {
  top: string;
  right: string;
  left: string;
  stroke?: string;
  lineWidth?: number;
};
type CafeCharacterOptions = {
  x: number;
  y: number;
  z: number;
  role: string;
  faceDir?: string;
  stride?: number;
  armLift?: number;
  holdingTrayWithOrder?: boolean;
  extraSmile?: boolean;
  hideLegs?: boolean;
};

export interface DigitalMenuCafeIllustrationProps {
  /** Cor de fundo do quadro isométrico. Padrão: "#f3f0e8" */
  backgroundColor?: string;
  /** Texto alternativo descritivo em português para SEO e leitores de tela */
  alt?: string;
  /** Multiplicador de velocidade (padrão 1.0 para loop contínuo de 8.00s) */
  speed?: number;
  /** Escala visual aplicada dentro do quadro recortado. */
  zoom?: number;
  /** Classes utilitárias opcionais para o container */
  className?: string;
}

/**
 * Componente Next.js leve e SEO-friendly: Cardápio Digital e Pedidos Online (~15 KB, 0 requisições externas)
 */
export default function DigitalMenuCafeIllustration({
  backgroundColor = '#f3f0e8',
  alt = 'Ilustração isométrica animada de uma cafeteria de bairro aconchegante: cliente na mesa da calçada escaneia o QR code com o celular para abrir o cardápio digital, faz o pedido online que viaja por um tubo transparente até o chef na cozinha e a garçonete caminha com calma para servir o prato e o café quentinho na mesa.',
  speed = 1,
  zoom = 1,
  className = 'w-full max-w-[640px] aspect-square mx-auto',
}: DigitalMenuCafeIllustrationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let isVisible = true;
    let animTime = 6.25; // Renderiza o quadro com cardápio ativo e café servido no primeiro paint (LCP imediato)
    let lastTs: number | null = null;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    drawDigitalMenuCafeScene(ctx, canvas.width, canvas.height, animTime, false, backgroundColor);

    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const tick = (ts: number) => {
      if (isVisible) {
        if (lastTs !== null) {
          animTime = (animTime + ((ts - lastTs) / 1000) * speed) % 8;
        }
        lastTs = ts;
        drawDigitalMenuCafeScene(ctx, canvas.width, canvas.height, animTime, false, backgroundColor);
      } else {
        lastTs = ts;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [backgroundColor, speed]);

  return (
    <figure
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      <canvas
        ref={canvasRef}
        width={960}
        height={960}
        className="w-full h-full object-contain block select-none"
        style={{
          transform: `scale(${Math.max(1, Math.min(2, zoom))})`,
          transformOrigin: "center center",
        }}
      />
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}

const CAFE_LOOP_DURATION = 8;
const CAFE_PALETTE = {
  "seoWarmBg": "#f3f0e8",
  "pureWhite": "#FFFFFF",
  "navyRoof": "#172B69",
  "navyDeep": "#0F1E4D",
  "navyAccent": "#162B6F",
  "royalBlue": "#1D4ED8",
  "royalBright": "#2563EB",
  "terracottaBrick": "#D96B43",
  "terracottaBrickDark": "#B8502B",
  "creamWall": "#F5EFE2",
  "creamWallShade": "#E5DEC9",
  "lightWood": "#E2A86F",
  "lightWoodMid": "#C98A50",
  "lightWoodDark": "#A66C38",
  "woodMid": "#C68B53",
  "warmYellowGlow": "#FEF08A",
  "warmInteriorFloor": "#FDE68A",
  "warmYellowLamp": "#FACC15",
  "orangeAccent": "#F97316",
  "orangeCta": "#F97316",
  "orangeDark": "#EA580C",
  "plantGreenLight": "#4ADE80",
  "plantGreenMid": "#22C55E",
  "plantGreenDark": "#15803D",
  "potTerracotta": "#D97706",
  "potTerracottaDark": "#B45309",
  "strokeNavy": "#15275E",
  "tubeGlassFill": "rgba(186, 230, 253, 0.36)",
  "tubeGlassStroke": "#64748B"
};
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - clamp01(t), 3);
}
function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function easeOutBackPop(t: number): number {
  const x = clamp01(t);
  if (x === 0 || x === 1) return x;
  const c1 = 2.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function computeCafeChoreography(tSec: number) {
  const resetFade = tSec >= 7.15 ? 1 - easeInOutCubic((tSec - 7.15) / 0.85) : 1;
  const phoneAimLift =
    tSec < 1.60
      ? easeOutCubic(tSec / 0.85)
      : tSec < 7.15
      ? 1
      : resetFade;
  const qrScanBeamAlpha =
    tSec >= 0.20 && tSec <= 1.25 ? Math.sin(((tSec - 0.20) / 1.05) * Math.PI) * 0.75 : 0;
  const menuBlocksLit = easeOutCubic((tSec - 0.45) / 0.90) * resetFade;
  const orangeButtonTapPop =
    tSec >= 1.45 && tSec <= 2.10
      ? 1 + Math.sin(((tSec - 1.45) / 0.65) * Math.PI) * 0.30
      : menuBlocksLit > 0.5
      ? 1
      : 0;
  const ticketActive = tSec >= 1.60 && tSec <= 3.25;
  const ticketProgress = clamp01((tSec - 1.65) / 1.45);
  const chefPrepProgress = clamp01((tSec - 3.05) / 0.95) * resetFade;
  const chefArmPass =
    tSec >= 3.10 && tSec <= 4.35
      ? Math.sin(((tSec - 3.10) / 1.25) * Math.PI)
      : 0;

  let waitressX = 22;
  let waitressY = 68;
  let waitressZ = 6;
  let waitressBehindCounter = true;
  let waitressStride = 0;
  let doorSwing = 0.16;
  let trayHasOrder = false;
  let tableServedAlpha = 0;
  let steamRiseProgress = 0;

  if (tSec >= 3.65 && tSec < 4.00) {
    trayHasOrder = true;
  } else if (tSec >= 4.00 && tSec < 4.80) {
    const p1 = easeInOutCubic((tSec - 4.00) / 0.80);
    waitressX = 22 + p1 * 56;
    waitressY = 68;
    waitressZ = 6;
    waitressBehindCounter = true;
    waitressStride = Math.sin((tSec - 4.00) * Math.PI * 2.5) * 0.40;
    trayHasOrder = true;
    if (p1 > 0.70) {
      doorSwing = 0.16 + ((p1 - 0.70) / 0.30) * 0.72;
    }
  } else if (tSec >= 4.80 && tSec < 6.00) {
    const p2 = easeInOutCubic((tSec - 4.80) / 1.20);
    waitressX = 54 + p2 * 22;
    waitressY = -2 - p2 * 18;
    waitressZ = 0;
    waitressBehindCounter = false;
    waitressStride = Math.sin((tSec - 4.80) * Math.PI * 2.5) * 0.45 * (1 - Math.pow(p2, 4));
    trayHasOrder = p2 < 0.88;
    doorSwing = p2 < 0.55 ? 0.88 - (p2 / 0.55) * 0.72 : 0.16;
    if (p2 >= 0.85) {
      tableServedAlpha = easeOutBackPop((p2 - 0.85) / 0.15);
    }
  } else if (tSec >= 6.00 && tSec < 7.00) {
    waitressX = 76;
    waitressY = -20;
    waitressZ = 0;
    waitressBehindCounter = false;
    waitressStride = 0;
    trayHasOrder = false;
    tableServedAlpha = 1;
    steamRiseProgress = clamp01((tSec - 5.95) / 1.00);
  } else if (tSec >= 7.00 && tSec < 7.55) {
    const r1 = easeInOutCubic((tSec - 7.00) / 0.55);
    waitressX = 76 - r1 * 22;
    waitressY = -20 + r1 * 18;
    waitressZ = 0;
    waitressBehindCounter = false;
    waitressStride = Math.sin((tSec - 7.00) * Math.PI * 2.5) * 0.42;
    doorSwing = 0.16 + Math.sin(r1 * Math.PI) * 0.68;
    tableServedAlpha = 1 - r1 * 0.5;
    steamRiseProgress = 1 - r1 * 0.5;
  } else if (tSec >= 7.55) {
    const r2 = easeInOutCubic((tSec - 7.55) / 0.45);
    waitressX = 78 - r2 * 56;
    waitressY = 68;
    waitressZ = 6;
    waitressBehindCounter = true;
    waitressStride = Math.sin((tSec - 7.55) * Math.PI * 2.2) * 0.35 * (1 - r2);
    doorSwing = 0.16;
    tableServedAlpha = (1 - r2) * 0.5;
    steamRiseProgress = (1 - r2) * 0.5;
  }

  return {
    resetFade,
    phoneAimLift,
    qrScanBeamAlpha,
    menuBlocksLit,
    orangeButtonTapPop,
    ticketActive,
    ticketProgress,
    chefPrepProgress,
    chefArmPass,
    waitressX,
    waitressY,
    waitressZ,
    waitressBehindCounter,
    waitressStride,
    doorSwing,
    trayHasOrder,
    tableServedAlpha,
    steamRiseProgress,
  };
}

const drawDigitalMenuCafeScene = function drawDigitalMenuCafeScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tSec: number,
  showGuides: boolean,
  canvasBackground = "#ffffff",
) {
	ctx.save();
	ctx.clearRect(0, 0, width, height);
	if (canvasBackground !== "transparent") {
		ctx.fillStyle = canvasBackground;
		ctx.fillRect(0, 0, width, height);
	}
	const scale = width / 1e3;
	ctx.scale(scale, scale);
	// Centered 1:1 square composition with generous empty space around the cafe
	const originX = 505;
	const originY = 740;
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
		const lw = colors.lineWidth ?? 1.45;
		const st = colors.stroke ?? CAFE_PALETTE.strokeNavy;
		drawPoly([
			iso(x0, y0, z0),
			iso(x0, y1, z0),
			iso(x0, y1, z1),
			iso(x0, y0, z1)
		], colors.left, st, lw);
		drawPoly([
			iso(x0, y0, z0),
			iso(x1, y0, z0),
			iso(x1, y0, z1),
			iso(x0, y0, z1)
		], colors.right, st, lw);
		drawPoly([
			iso(x0, y0, z1),
			iso(x1, y0, z1),
			iso(x1, y1, z1),
			iso(x0, y1, z1)
		], colors.top, st, lw);
	};
	const ch = computeCafeChoreography(tSec);
	/**
	* Draws a clearly visible character with a friendly smiling face (eyes + smile arc).
	* When hideLegs is true (e.g. for the Chef behind the kitchen counter), only the waist-up torso,
	* arms, smiling head, and hat are rendered so legs never poke through counters.
	*/
	const drawSmilingCafeCharacter = (opts: CafeCharacterOptions) => {
		const { x, y, z, role, faceDir, stride = 0, armLift = 0, holdingTrayWithOrder = false, extraSmile = false, hideLegs = false } = opts;
		const s = role === "chef" ? 1.24 : 1.18;
		const legSpread = stride * 3.2 * s;
		if (!hideLegs) {
			// Ground shadow
			drawPoly([
				iso(x - 6 * s, y - 6 * s, z + .3),
				iso(x + 6 * s, y - 6 * s, z + .3),
				iso(x + 6 * s, y + 6 * s, z + .3),
				iso(x - 6 * s, y + 6 * s, z + .3)
			], "rgba(21, 39, 94, 0.16)");
		}
		if (role === "seated-customer") {
			// Wooden cafe chair behind seated customer
			drawPrism(x - 5 * s, y - 5 * s, z, 10 * s, 10 * s, 9 * s, {
				top: CAFE_PALETTE.lightWood,
				right: CAFE_PALETTE.lightWoodDark,
				left: CAFE_PALETTE.lightWoodMid,
				stroke: CAFE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			// Chair backrest on back-right side
			drawPrism(x + 3 * s, y - 5 * s, z + 9 * s, 2.2 * s, 10 * s, 12 * s, {
				top: CAFE_PALETTE.lightWood,
				right: CAFE_PALETTE.lightWoodDark,
				left: CAFE_PALETTE.lightWoodMid,
				stroke: CAFE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			// Seated legs extending forward toward table (-X / -Y)
			drawPrism(x - 7.5 * s, y - 3.2 * s, z + 1.5 * s, 6.5 * s, 3.2 * s, 7.5 * s, {
				top: CAFE_PALETTE.royalBright,
				right: CAFE_PALETTE.navyRoof,
				left: CAFE_PALETTE.royalBlue,
				stroke: CAFE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			drawPrism(x - 7.5 * s, y + .4 * s, z + 1.5 * s, 6.5 * s, 3.2 * s, 7.5 * s, {
				top: CAFE_PALETTE.royalBright,
				right: CAFE_PALETTE.navyRoof,
				left: CAFE_PALETTE.royalBlue,
				stroke: CAFE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		} else if (!hideLegs) {
			// Standing / Walking legs (White shoes + Royal Blue trousers)
			drawPrism(x - 3.8 * s, y - 2.4 * s + legSpread, z, 3.4 * s, 4.4 * s, 2.5 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: CAFE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			drawPrism(x - 3.8 * s, y - 2.4 * s + legSpread, z + 2.5 * s, 3.4 * s, 4.4 * s, 8.8 * s, {
				top: CAFE_PALETTE.royalBright,
				right: CAFE_PALETTE.navyRoof,
				left: CAFE_PALETTE.royalBlue,
				stroke: CAFE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			drawPrism(x + .4 * s, y - 2.4 * s - legSpread, z, 3.4 * s, 4.4 * s, 2.5 * s, {
				top: "#FFFFFF",
				right: "#CBD5E1",
				left: "#FFFFFF",
				stroke: CAFE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			drawPrism(x + .4 * s, y - 2.4 * s - legSpread, z + 2.5 * s, 3.4 * s, 4.4 * s, 8.8 * s, {
				top: CAFE_PALETTE.royalBright,
				right: CAFE_PALETTE.navyRoof,
				left: CAFE_PALETTE.royalBlue,
				stroke: CAFE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		}
		const torsoBaseZ = role === "seated-customer" ? z + 9 * s : z + 11.3 * s;
		// Torso:
		// - Chef: Crisp white double-breasted chef jacket with navy collar trim
		// - Waitress: White shirt with Royal Blue barista apron
		// - Customer: Royal Blue sweater with white collar
		const torsoColors = role === "chef" ? {
			top: "#FFFFFF",
			right: "#F1F5F9",
			left: "#FFFFFF"
		} : role === "waitress" ? {
			top: "#FFFFFF",
			right: CAFE_PALETTE.royalBlue,
			left: CAFE_PALETTE.royalBright
		} : {
			top: CAFE_PALETTE.royalBright,
			right: CAFE_PALETTE.navyRoof,
			left: CAFE_PALETTE.royalBlue
		};
		drawPrism(x - 4.8 * s, y - 3.5 * s, torsoBaseZ, 9.6 * s, 7 * s, 12.8 * s, {
			...torsoColors,
			stroke: CAFE_PALETTE.strokeNavy,
			lineWidth: 1.45
		});
		// Chef double-breasted button dots (strictly geometric dots, no text)
		if (role === "chef") {
			const btnY = y - 3.65 * s;
			for (let bz = 4; bz <= 10; bz += 3) {
				drawPoly([
					iso(x - 1.5, btnY, torsoBaseZ + bz * s),
					iso(x - .5, btnY, torsoBaseZ + bz * s),
					iso(x - .5, btnY, torsoBaseZ + (bz + 1.2) * s),
					iso(x - 1.5, btnY, torsoBaseZ + (bz + 1.2) * s)
				], CAFE_PALETTE.navyRoof);
				drawPoly([
					iso(x + 1.5, btnY, torsoBaseZ + bz * s),
					iso(x + 2.5, btnY, torsoBaseZ + bz * s),
					iso(x + 2.5, btnY, torsoBaseZ + (bz + 1.2) * s),
					iso(x + 1.5, btnY, torsoBaseZ + (bz + 1.2) * s)
				], CAFE_PALETTE.navyRoof);
			}
		}
		// Arms
		const armZ = torsoBaseZ + 3 * s + armLift * 2.5;
		drawPrism(x - 7.3 * s, y - 2.5 * s, armZ, 2.6 * s, 5.2 * s, 8.6 * s, {
			top: "#FFFFFF",
			right: role === "seated-customer" ? CAFE_PALETTE.royalBlue : "#E2E8F0",
			left: role === "seated-customer" ? CAFE_PALETTE.royalBright : "#FFFFFF",
			stroke: CAFE_PALETTE.strokeNavy,
			lineWidth: 1.35
		});
		drawPrism(x + 4.7 * s, y - 2.5 * s, armZ, 2.6 * s, 5.2 * s, 8.6 * s, {
			top: "#FFFFFF",
			right: role === "seated-customer" ? CAFE_PALETTE.navyRoof : "#CBD5E1",
			left: role === "seated-customer" ? CAFE_PALETTE.royalBlue : "#FFFFFF",
			stroke: CAFE_PALETTE.strokeNavy,
			lineWidth: 1.35
		});
		// Waitress holding round silver serving tray (with dish & coffee cup while delivering!)
		if (role === "waitress") {
			const trayX = x + 6.5 * s;
			const trayY = y - 6.5 * s;
			const trayZ = torsoBaseZ + 6.2 * s;
			const trayPts = [];
			for (let i = 0; i < 20; i++) {
				const a = i / 20 * Math.PI * 2;
				trayPts.push(iso(trayX + Math.cos(a) * 8.5, trayY + Math.sin(a) * 8.5, trayZ));
			}
			drawPoly(trayPts, "#E2E8F0", CAFE_PALETTE.strokeNavy, 1.4);
			if (holdingTrayWithOrder) {
				// Warm pastry/dish + white coffee cup on the waitress's tray
				drawPrism(trayX - 4.5, trayY - 2.5, trayZ + .5, 4.5, 4.5, 2.5, {
					top: CAFE_PALETTE.orangeAccent,
					right: CAFE_PALETTE.orangeDark,
					left: CAFE_PALETTE.warmYellowLamp,
					stroke: CAFE_PALETTE.strokeNavy,
					lineWidth: 1.1
				});
				drawPrism(trayX + 1, trayY - 2, trayZ + .5, 4.2, 4.2, 5.2, {
					top: "#FFFFFF",
					right: "#CBD5E1",
					left: "#FFFFFF",
					stroke: CAFE_PALETTE.strokeNavy,
					lineWidth: 1.15
				});
			}
		}
		// Head (Clearly visible pure white isometric cube with friendly smiling face!)
		const headZ = torsoBaseZ + 12.8 * s;
		const headW = 8.4 * s;
		const headD = 7 * s;
		const headH = 9.2 * s;
		drawPrism(x - headW / 2, y - headD / 2, headZ, headW, headD, headH, {
			top: "#FFFFFF",
			right: "#F8FAFC",
			left: "#FFFFFF",
			stroke: CAFE_PALETTE.strokeNavy,
			lineWidth: 1.45
		});
		// Draw friendly smiling face (two eyes + warm curved smile) on the visible front face of the head
		const eyeZ = headZ + headH * .58;
		const smileZ = headZ + headH * .3;
		const smileDepth = extraSmile ? 1.6 : 1.1;
		if (faceDir === "front-right") {
			const fy = y - headD / 2 - .25;
			const e1 = iso(x - 1.8 * s, fy, eyeZ);
			const e2 = iso(x + 1.8 * s, fy, eyeZ);
			ctx.fillStyle = CAFE_PALETTE.strokeNavy;
			ctx.beginPath();
			ctx.arc(e1[0], e1[1], 1.65, 0, Math.PI * 2);
			ctx.arc(e2[0], e2[1], 1.65, 0, Math.PI * 2);
			ctx.fill();
			const sLeft = iso(x - 2 * s, fy, smileZ + .5);
			const sMid = iso(x, fy, smileZ - smileDepth);
			const sRight = iso(x + 2 * s, fy, smileZ + .5);
			ctx.beginPath();
			ctx.moveTo(sLeft[0], sLeft[1]);
			ctx.quadraticCurveTo(sMid[0], sMid[1], sRight[0], sRight[1]);
			ctx.strokeStyle = CAFE_PALETTE.strokeNavy;
			ctx.lineWidth = 1.65;
			ctx.lineCap = "round";
			ctx.stroke();
		} else {
			const fx = x - headW / 2 - .25;
			const e1 = iso(fx, y - 1.8 * s, eyeZ);
			const e2 = iso(fx, y + 1.8 * s, eyeZ);
			ctx.fillStyle = CAFE_PALETTE.strokeNavy;
			ctx.beginPath();
			ctx.arc(e1[0], e1[1], 1.65, 0, Math.PI * 2);
			ctx.arc(e2[0], e2[1], 1.65, 0, Math.PI * 2);
			ctx.fill();
			const sLeft = iso(fx, y - 2 * s, smileZ + .5);
			const sMid = iso(fx, y, smileZ - smileDepth);
			const sRight = iso(fx, y + 2 * s, smileZ + .5);
			ctx.beginPath();
			ctx.moveTo(sLeft[0], sLeft[1]);
			ctx.quadraticCurveTo(sMid[0], sMid[1], sRight[0], sRight[1]);
			ctx.strokeStyle = CAFE_PALETTE.strokeNavy;
			ctx.lineWidth = 1.65;
			ctx.lineCap = "round";
			ctx.stroke();
		}
		// Hair / Chef Hat
		const hatBaseZ = headZ + headH - .5;
		if (role === "chef") {
			// Tall white chef hat (toque) with pleated crown
			drawPrism(x - 4.4 * s, y - 3.7 * s, hatBaseZ, 8.8 * s, 7.4 * s, 3.2 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: CAFE_PALETTE.strokeNavy,
				lineWidth: 1.35
			});
			drawPrism(x - 5.2 * s, y - 4.3 * s, hatBaseZ + 3.2 * s, 10.4 * s, 8.6 * s, 6.4 * s, {
				top: "#FFFFFF",
				right: "#F1F5F9",
				left: "#FFFFFF",
				stroke: CAFE_PALETTE.strokeNavy,
				lineWidth: 1.4
			});
		} else {
			// Navy blue hair cap
			drawPrism(x - 4.5 * s, y - 3.8 * s, hatBaseZ, 9 * s, 7.6 * s, 3 * s, {
				top: CAFE_PALETTE.navyRoof,
				right: CAFE_PALETTE.navyDeep,
				left: CAFE_PALETTE.royalBlue,
				stroke: CAFE_PALETTE.strokeNavy,
				lineWidth: 1.35
			});
		}
	};
	/**
	* Draws a potted green plant beside the cafe door
	*/
	const drawPottedPlant = (px: number, py: number, pz: number, sway: number) => {
		drawPoly([
			iso(px - 8, py - 8, pz + .2),
			iso(px + 8, py - 8, pz + .2),
			iso(px + 8, py + 8, pz + .2),
			iso(px - 8, py + 8, pz + .2)
		], "rgba(15, 23, 42, 0.14)");
		drawPrism(px - 6.5, py - 6.5, pz, 13, 13, 11, {
			top: CAFE_PALETTE.potTerracotta,
			right: CAFE_PALETTE.potTerracottaDark,
			left: CAFE_PALETTE.orangeAccent,
			stroke: CAFE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		drawPrism(px - 7.8, py - 7.8, pz + 10, 15.6, 15.6, 3.5, {
			top: CAFE_PALETTE.orangeAccent,
			right: CAFE_PALETTE.potTerracottaDark,
			left: CAFE_PALETTE.potTerracotta,
			stroke: CAFE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		const leafZ = pz + 13.5;
		drawPoly([
			iso(px, py, leafZ),
			iso(px - 10 + sway, py + 4, leafZ + 8),
			iso(px - 8 + sway, py - 2, leafZ + 17),
			iso(px - 1, py - 2, leafZ + 10)
		], CAFE_PALETTE.plantGreenMid, CAFE_PALETTE.strokeNavy, 1.3);
		drawPoly([
			iso(px, py, leafZ),
			iso(px + 10 + sway, py - 4, leafZ + 8),
			iso(px + 8 + sway, py + 2, leafZ + 17),
			iso(px + 1, py + 2, leafZ + 10)
		], CAFE_PALETTE.plantGreenDark, CAFE_PALETTE.strokeNavy, 1.3);
		drawPoly([
			iso(px - 4, py - 3, leafZ + 2),
			iso(px + sway * 1.2, py, leafZ + 23),
			iso(px + 4, py + 3, leafZ + 2)
		], CAFE_PALETTE.plantGreenLight, CAFE_PALETTE.strokeNavy, 1.35);
	};
	// ============================================================================
	// CAFE BUILDING DIMENSIONS (Cozy neighborhood cafe in cutaway)
	// ============================================================================
	const BX = 152;
	const BY = 152;
	const ROOF_Z = 156;
	const KITCHEN_SPLIT_Y = 98;
	// ============================================================================
	// 1. GROUND PLATFORM & SIDEWALK (White slab with thin grey lines)
	// ============================================================================
	const GX0 = -38;
	const GX1 = BX + 48;
	const GY0 = -84;
	const GY1 = BY + 34;
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
	// Thin sidewalk tile lines
	drawLine(iso(0, 0, .2), iso(GX0, 0, .2), "#CBD5E1", 1.2);
	drawLine(iso(0, -44, .2), iso(GX1, -44, .2), "#E2E8F0", 1.1);
	for (let sx = 0; sx <= GX1; sx += 44) {
		drawLine(iso(sx, 0, .2), iso(sx, GY0, .2), "#E2E8F0", 1);
	}
	for (let sy = 0; sy <= GY1; sy += 44) {
		drawLine(iso(0, sy, .2), iso(GX0, sy, .2), "#CBD5E1", 1);
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
	// 2. COZY CAFE CUTAWAY INTERIOR, PROMINENT WOODEN COUNTER & OPEN KITCHEN
	// ============================================================================
	// Back-Left Wall (y = BY, spanning x: 0..BX, z: 0..ROOF_Z)
	drawPoly([
		iso(0, BY, 0),
		iso(BX, BY, 0),
		iso(BX, BY, ROOF_Z),
		iso(0, BY, ROOF_Z)
	], CAFE_PALETTE.warmYellowGlow, CAFE_PALETTE.strokeNavy, 1.5);
	// Warm Interior Floor (z = 1, spanning x: 0..BX, y: 0..BY)
	drawPoly([
		iso(0, 0, 1),
		iso(BX, 0, 1),
		iso(BX, BY, 1),
		iso(0, BY, 1)
	], "#FDE68A", CAFE_PALETTE.strokeNavy, 1.3);
	// Soft warm light cones from the 3 hanging ceiling lamps
	const lampYPositions = [
		32,
		58,
		84
	];
	for (const ly of lampYPositions) {
		const lx = 34;
		const lampZ = ROOF_Z - 32;
		drawPoly([
			iso(lx, ly, lampZ),
			iso(lx - 26, ly + 18, 28),
			iso(lx + 26, ly - 18, 28)
		], "rgba(254, 240, 138, 0.45)");
	}
	// --- OPEN KITCHEN AREA ON THE LEFT (y: KITCHEN_SPLIT_Y..BY) ---
	// Kitchen back stove & stainless range hood (coifa) behind the chef
	drawPrism(6, BY - 16, 2, 34, 14, 34, {
		top: "#E2E8F0",
		right: "#94A3B8",
		left: "#CBD5E1",
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	// Terracotta cooking pot on the kitchen stove behind the chef
	drawPrism(12, BY - 13, 36, 10, 9, 6, {
		top: CAFE_PALETTE.orangeAccent,
		right: CAFE_PALETTE.terracottaBrickDark,
		left: CAFE_PALETTE.terracottaBrick,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.2
	});
	// Overhead stainless range hood (coifa) inside kitchen window
	drawPrism(4, BY - 22, 86, 38, 20, 16, {
		top: "#F1F5F9",
		right: "#94A3B8",
		left: "#CBD5E1",
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.35
	});
	// 2A. Draw the Friendly Chef FIRST (with hideLegs: true and positioned behind the kitchen counter & window sill!)
	// Because the kitchen counter and window sill are drawn right AFTER the chef, ONLY the chef's waist-up jacket,
	// arms, smiling face, and tall white chef hat are visible above the counter — never his legs!
	drawSmilingCafeCharacter({
		x: 20,
		y: KITCHEN_SPLIT_Y + 24,
		z: 24,
		role: "chef",
		faceDir: "front-right",
		armLift: ch.chefArmPass,
		extraSmile: ch.chefPrepProgress > .2,
		hideLegs: true
	});
	// 2B. Kitchen Prep & Pass-Through Counter drawn IN FRONT OF (after) the Chef's lower body!
	drawPrism(0, KITCHEN_SPLIT_Y, 2, 46, 20, 38, {
		top: "#F8FAFC",
		right: "#CBD5E1",
		left: "#E2E8F0",
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Overhanging kitchen counter top slab (at z = 40..43.5, cleanly occluding the chef at the waist)
	drawPrism(-2, KITCHEN_SPLIT_Y - 2, 40, 50, 24, 3.5, {
		top: "#FFFFFF",
		right: "#94A3B8",
		left: "#CBD5E1",
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	// 2C. Kitchen Left Exterior Wall with Open Window (drawn AFTER the chef so the window sill frames him from the waist up)
	// Lower wall below kitchen window (z: 0..48)
	drawPrism(-6, KITCHEN_SPLIT_Y, 0, 6, BY - KITCHEN_SPLIT_Y, 48, {
		top: "#FFFFFF",
		right: CAFE_PALETTE.creamWallShade,
		left: CAFE_PALETTE.creamWall,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Upper wall above kitchen window (z: 110..ROOF_Z)
	drawPrism(-6, KITCHEN_SPLIT_Y, 110, 6, BY - KITCHEN_SPLIT_Y, ROOF_Z - 110, {
		top: CAFE_PALETTE.navyRoof,
		right: CAFE_PALETTE.creamWallShade,
		left: CAFE_PALETTE.creamWall,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Back pillar of kitchen window (y: BY-8..BY, z: 48..110)
	drawPrism(-6, BY - 8, 48, 6, 8, 62, {
		top: CAFE_PALETTE.creamWall,
		right: CAFE_PALETTE.creamWallShade,
		left: CAFE_PALETTE.creamWall,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	// Divider pillar between kitchen window and main cafe cutaway (y: KITCHEN_SPLIT_Y - 5 .. KITCHEN_SPLIT_Y + 3, z: 0..ROOF_Z)
	drawPrism(-6, KITCHEN_SPLIT_Y - 5, 0, 6, 8, ROOF_Z, {
		top: CAFE_PALETTE.navyRoof,
		right: CAFE_PALETTE.creamWallShade,
		left: CAFE_PALETTE.creamWall,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Prepared Dish & Coffee Cup on the Kitchen Pass-Through Counter during Chef Prep (3.05s -> 4.05s)
	if (ch.chefPrepProgress > .05 && tSec < 4.05) {
		const pScale = easeOutBackPop(ch.chefPrepProgress);
		// Warm pastry plate on the counter
		drawPrism(14, KITCHEN_SPLIT_Y + 4, 44, 7.5 * pScale, 7.5 * pScale, 3.2 * pScale, {
			top: CAFE_PALETTE.orangeAccent,
			right: CAFE_PALETTE.orangeDark,
			left: CAFE_PALETTE.warmYellowLamp,
			stroke: CAFE_PALETTE.strokeNavy,
			lineWidth: 1.2
		});
		// White coffee cup on the counter
		drawPrism(25, KITCHEN_SPLIT_Y + 4, 44, 5.8 * pScale, 5.8 * pScale, 6.8 * pScale, {
			top: "#FFFFFF",
			right: "#CBD5E1",
			left: "#FFFFFF",
			stroke: CAFE_PALETTE.strokeNavy,
			lineWidth: 1.2
		});
	}
	// --- 2D. WAITRESS WHEN BEHIND THE MAIN WOODEN COUNTER ---
	// Drawn BEFORE the Main Light Wooden Counter with hideLegs: true so she glides cleanly behind the counter
	// and behind the espresso machine without her legs ever showing through the counter!
	if (ch.waitressBehindCounter) {
		drawSmilingCafeCharacter({
			x: ch.waitressX,
			y: ch.waitressY,
			z: 14,
			role: "waitress",
			faceDir: "front-right",
			stride: ch.waitressStride,
			holdingTrayWithOrder: ch.trayHasOrder,
			extraSmile: true,
			hideLegs: true
		});
	}
	// --- 2E. LARGE, PROMINENT LIGHT WOODEN COUNTER (BALCÃO DE MADEIRA) & ESPRESSO MACHINE ---
	// Positioned at x: 6..60, y: 38..62 so the counter extends cleanly to the inside of the brick wall
	const CNT_X0 = 6;
	const CNT_W = 54;
	const CNT_Y0 = 38;
	const CNT_D = 24;
	const CNT_H = 31;
	// Main Wooden Counter body
	drawPrism(CNT_X0, CNT_Y0, 2, CNT_W, CNT_D, CNT_H, {
		top: "#FDE68A",
		right: CAFE_PALETTE.lightWoodMid,
		left: CAFE_PALETTE.lightWood,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.55
	});
	// Recessed front wooden panel detail on the long front-right face of the counter (y = CNT_Y0 - 0.15)
	drawPoly([
		iso(CNT_X0 + 4, CNT_Y0 - .15, 6),
		iso(CNT_X0 + CNT_W - 4, CNT_Y0 - .15, 6),
		iso(CNT_X0 + CNT_W - 4, CNT_Y0 - .15, CNT_H - 3),
		iso(CNT_X0 + 4, CNT_Y0 - .15, CNT_H - 3)
	], CAFE_PALETTE.lightWood, CAFE_PALETTE.strokeNavy, 1.2);
	// Recessed side panel detail on the front-left cutaway end of the counter (x = CNT_X0 - 0.15)
	drawPoly([
		iso(CNT_X0 - .15, CNT_Y0 + 4, 6),
		iso(CNT_X0 - .15, CNT_Y0 + CNT_D - 4, 6),
		iso(CNT_X0 - .15, CNT_Y0 + CNT_D - 4, CNT_H - 3),
		iso(CNT_X0 - .15, CNT_Y0 + 4, CNT_H - 3)
	], CAFE_PALETTE.lightWoodMid, CAFE_PALETTE.strokeNavy, 1.2);
	// Thick overhanging light-wood countertop slab (z: 33..37)
	drawPrism(CNT_X0 - 2, CNT_Y0 - 2, CNT_H + 2, CNT_W + 4, CNT_D + 4, 4, {
		top: "#FEF3C7",
		right: CAFE_PALETTE.lightWoodDark,
		left: CAFE_PALETTE.lightWood,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.5
	});
	// Prominent Silver / Chrome Espresso Machine on the right end of the Wooden Counter (completely visible in the cutaway!)
	const ESP_X = 30;
	const ESP_Y = CNT_Y0 + 3;
	const ESP_Z = CNT_H + 6;
	drawPrism(ESP_X, ESP_Y, ESP_Z, 19, 16, 19, {
		top: "#F8FAFC",
		right: "#94A3B8",
		left: "#CBD5E1",
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Espresso group head & portafilter facing the cutaway
	drawPrism(ESP_X - 2.5, ESP_Y + 4, ESP_Z + 7, 3, 9, 5, {
		top: CAFE_PALETTE.navyRoof,
		right: CAFE_PALETTE.navyDeep,
		left: CAFE_PALETTE.royalBlue,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.25
	});
	// Stacked white ceramic coffee cups on top of the espresso machine warmer
	for (const cxOff of [3.5, 10.5]) {
		for (const cyOff of [3.5, 9.5]) {
			drawPrism(ESP_X + cxOff, ESP_Y + cyOff, ESP_Z + 19, 4.2, 4.2, 4.2, {
				top: "#FFFFFF",
				right: "#CBD5E1",
				left: "#FFFFFF",
				stroke: CAFE_PALETTE.strokeNavy,
				lineWidth: 1.05
			});
		}
	}
	// --- 2F. WAITRESS WHEN WALKING IN FRONT OF COUNTER TOWARD THE DOOR (y >= -2) ---
	if (!ch.waitressBehindCounter && ch.waitressY >= -2) {
		drawSmilingCafeCharacter({
			x: ch.waitressX,
			y: ch.waitressY,
			z: ch.waitressZ,
			role: "waitress",
			faceDir: "front-right",
			stride: ch.waitressStride,
			holdingTrayWithOrder: ch.trayHasOrder,
			extraSmile: true
		});
	}
	// Three Warm Yellow Hanging Lamps suspended from the cafe ceiling
	for (const ly of lampYPositions) {
		const lx = 30;
		const cordTopZ = ROOF_Z - 6;
		const shadeZ = ROOF_Z - 34;
		drawLine(iso(lx, ly, cordTopZ), iso(lx, ly, shadeZ + 8), CAFE_PALETTE.strokeNavy, 1.5);
		drawPoly([
			iso(lx - 9, ly + 4, shadeZ),
			iso(lx + 9, ly - 4, shadeZ),
			iso(lx + 5, ly - 2, shadeZ + 8),
			iso(lx - 5, ly + 2, shadeZ + 8)
		], CAFE_PALETTE.warmYellowLamp, CAFE_PALETTE.strokeNavy, 1.4);
	}
	// ============================================================================
	// 3. WARM TERRACOTTA BRICK FACADE, LIGHT WOODEN DOOR & LARGE SHOP WINDOW
	// ============================================================================
	// Front-left corner pillar between cutaway and brick facade
	drawPrism(-6, -2, 0, 6, 6, ROOF_Z, {
		top: CAFE_PALETTE.navyRoof,
		right: CAFE_PALETTE.terracottaBrick,
		left: CAFE_PALETTE.creamWall,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Main Terracotta Brick Facade Wall (y = 0, spanning x: 0..BX, z: 0..ROOF_Z - 14)
	const FACADE_TOP_Z = ROOF_Z - 14;
	drawPoly([
		iso(0, 0, 0),
		iso(BX, 0, 0),
		iso(BX, 0, FACADE_TOP_Z),
		iso(0, 0, FACADE_TOP_Z)
	], CAFE_PALETTE.terracottaBrick, CAFE_PALETTE.strokeNavy, 1.8);
	// Crisp isometric brick course mortar lines across the terracotta facade
	for (let bz = 12; bz < FACADE_TOP_Z; bz += 10) {
		drawLine(iso(3, -.1, bz), iso(BX - 3, -.1, bz), "rgba(245, 239, 226, 0.36)", 1);
		const offset = bz / 10 % 2 === 0 ? 0 : 9;
		for (let bx = 10 + offset; bx < BX - 8; bx += 18) {
			drawLine(iso(bx, -.1, bz), iso(bx, -.1, bz + 10), "rgba(148, 56, 26, 0.45)", 1);
		}
	}
	// Light Wooden Entrance Door (x: 34..68, z: 0..84)
	const DOOR_X0 = 34;
	const DOOR_X1 = 68;
	const DOOR_Z1 = 84;
	// Light wood outer door frame
	drawPrism(DOOR_X0 - 2.5, -2, 0, DOOR_X1 - DOOR_X0 + 5, 2, DOOR_Z1 + 2.5, {
		top: CAFE_PALETTE.lightWood,
		right: CAFE_PALETTE.lightWoodMid,
		left: CAFE_PALETTE.lightWoodDark,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Warm interior glow behind doorway
	drawPoly([
		iso(DOOR_X0, -2.1, 0),
		iso(DOOR_X1, -2.1, 0),
		iso(DOOR_X1, -2.1, DOOR_Z1),
		iso(DOOR_X0, -2.1, DOOR_Z1)
	], CAFE_PALETTE.warmYellowGlow, CAFE_PALETTE.strokeNavy, 1.4);
	// Hinged Light Wooden Door Leaf
	const doorSwingY = -2.2 - 12 * ch.doorSwing;
	const doorSwingX = DOOR_X0 + (DOOR_X1 - DOOR_X0) * (1 - ch.doorSwing * .22);
	drawPoly([
		iso(DOOR_X0, -2.2, 0),
		iso(doorSwingX, doorSwingY, 0),
		iso(doorSwingX, doorSwingY, DOOR_Z1),
		iso(DOOR_X0, -2.2, DOOR_Z1)
	], CAFE_PALETTE.lightWood, CAFE_PALETTE.strokeNavy, 1.6);
	const lerpDoor = (fx: number, z: number): Point => {
		const x = DOOR_X0 + (doorSwingX - DOOR_X0) * fx;
		const y = -2.2 + (doorSwingY - -2.2) * fx;
		return iso(x, y, z);
	};
	// Upper glass window in the wooden door
	drawPoly([
		lerpDoor(.15, 38),
		lerpDoor(.85, 38),
		lerpDoor(.85, 76),
		lerpDoor(.15, 76)
	], "#E0F2FE", CAFE_PALETTE.strokeNavy, 1.3);
	// Lower wood panel in the wooden door
	drawPoly([
		lerpDoor(.15, 8),
		lerpDoor(.85, 8),
		lerpDoor(.85, 31),
		lerpDoor(.15, 31)
	], CAFE_PALETTE.lightWoodMid, CAFE_PALETTE.strokeNavy, 1.2);
	// Round brass doorknob
	const knobPt = lerpDoor(.86, 34);
	ctx.fillStyle = CAFE_PALETTE.warmYellowLamp;
	ctx.beginPath();
	ctx.arc(knobPt[0], knobPt[1], 2.4, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = CAFE_PALETTE.strokeNavy;
	ctx.lineWidth = 1.1;
	ctx.stroke();
	// Large Shop Window to the right of the wooden door (x: 82..138, z: 24..88)
	const WIN_X0 = 82;
	const WIN_X1 = 138;
	const WIN_Z0 = 24;
	const WIN_Z1 = 88;
	drawPrism(WIN_X0 - 2.5, -2.2, WIN_Z0 - 2.5, WIN_X1 - WIN_X0 + 5, 2.2, WIN_Z1 - WIN_Z0 + 5, {
		top: CAFE_PALETTE.lightWood,
		right: CAFE_PALETTE.lightWoodMid,
		left: CAFE_PALETTE.lightWoodDark,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Shop window glass with soft blue sky reflection & warm interior glow
	drawPoly([
		iso(WIN_X0, -2.4, WIN_Z0),
		iso(WIN_X1, -2.4, WIN_Z0),
		iso(WIN_X1, -2.4, WIN_Z1),
		iso(WIN_X0, -2.4, WIN_Z1)
	], "#E0F2FE", CAFE_PALETTE.strokeNavy, 1.35);
	drawPoly([
		iso(WIN_X0 + 6, -2.5, WIN_Z0),
		iso(WIN_X0 + 20, -2.5, WIN_Z0),
		iso(WIN_X0 + 44, -2.5, WIN_Z1),
		iso(WIN_X0 + 30, -2.5, WIN_Z1)
	], "rgba(255, 255, 255, 0.45)");
	// ============================================================================
	// 4. HANGING SIGN WITH A SIMPLE COFFEE CUP ICON MOUNTED ON THE FACADE (No text!)
	// ============================================================================
	const SIGN_X = 22;
	const SIGN_Z = 82;
	drawPrism(SIGN_X - 1.5, -26, SIGN_Z, 3, 26, 3, {
		top: CAFE_PALETTE.royalBright,
		right: CAFE_PALETTE.navyRoof,
		left: CAFE_PALETTE.royalBlue,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	drawPrism(SIGN_X - 1.5, -2.5, SIGN_Z - 8, 3, 2.5, 14, {
		top: CAFE_PALETTE.royalBright,
		right: CAFE_PALETTE.navyRoof,
		left: CAFE_PALETTE.royalBlue,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	const signSwayX = Math.sin(tSec / CAFE_LOOP_DURATION * Math.PI * 2) * .4;
	drawPrism(SIGN_X - 1.2 + signSwayX, -24, 54, 2.4, 18, 23, {
		top: CAFE_PALETTE.creamWall,
		right: CAFE_PALETTE.creamWallShade,
		left: CAFE_PALETTE.creamWall,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	const cupFaceX = SIGN_X - 1.5 + signSwayX;
	const cupCenterY = -15;
	const cupBaseZ = 59;
	drawPoly([
		iso(cupFaceX, cupCenterY - 4.5, cupBaseZ + 7.5),
		iso(cupFaceX, cupCenterY + 4.5, cupBaseZ + 7.5),
		iso(cupFaceX, cupCenterY + 3.2, cupBaseZ + 1.5),
		iso(cupFaceX, cupCenterY - 3.2, cupBaseZ + 1.5)
	], CAFE_PALETTE.royalBlue, CAFE_PALETTE.strokeNavy, 1.3);
	drawLine(iso(cupFaceX, cupCenterY - 5.5, cupBaseZ), iso(cupFaceX, cupCenterY + 5.5, cupBaseZ), CAFE_PALETTE.strokeNavy, 1.5);
	drawPoly([
		iso(cupFaceX, cupCenterY - 4.2, cupBaseZ + 6.5),
		iso(cupFaceX, cupCenterY - 6.4, cupBaseZ + 6.5),
		iso(cupFaceX, cupCenterY - 6.4, cupBaseZ + 3),
		iso(cupFaceX, cupCenterY - 4.2, cupBaseZ + 3)
	], undefined, CAFE_PALETTE.strokeNavy, 1.3);
	drawLine(iso(cupFaceX, cupCenterY - 1.2, cupBaseZ + 9.2), iso(cupFaceX, cupCenterY - 1.6, cupBaseZ + 12.2), CAFE_PALETTE.strokeNavy, 1.2);
	drawLine(iso(cupFaceX, cupCenterY + 1.4, cupBaseZ + 9.2), iso(cupFaceX, cupCenterY + 1, cupBaseZ + 12.2), CAFE_PALETTE.strokeNavy, 1.2);
	// ============================================================================
	// 5. TRANSPARENT PNEUMATIC TUBE CARRYING PAPER ORDER TICKETS
	// ============================================================================
	const tubePathPoints = [
		[
			16,
			-5,
			42
		],
		[
			14,
			-7,
			16
		],
		[
			2,
			-8,
			8
		],
		[
			-12,
			-4,
			8
		],
		[
			-14,
			30,
			8
		],
		[
			-14,
			68,
			8
		],
		[
			-14,
			92,
			16
		],
		[
			-11,
			104,
			36
		],
		[
			-2,
			108,
			52
		]
	];
	const sampleTubePoint = (sNorm: number): TubeSample => {
		const u = clamp01(sNorm) * (tubePathPoints.length - 1);
		const idx = Math.min(tubePathPoints.length - 2, Math.floor(u));
		const f = u - idx;
		const p0 = tubePathPoints[idx];
		const p1 = tubePathPoints[idx + 1];
		return {
			pos: [
				p0[0] + (p1[0] - p0[0]) * f,
				p0[1] + (p1[1] - p0[1]) * f,
				p0[2] + (p1[2] - p0[2]) * f
			],
			tangent: [
				p1[0] - p0[0],
				p1[1] - p0[1],
				p1[2] - p0[2]
			]
		};
	};
	const tubeScreenPts = [];
	const tubeSteps = 36;
	for (let i = 0; i <= tubeSteps; i++) {
		const { pos } = sampleTubePoint(i / tubeSteps);
		tubeScreenPts.push(iso(pos[0], pos[1], pos[2]));
	}
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(tubeScreenPts[0][0], tubeScreenPts[0][1]);
	for (let i = 1; i < tubeScreenPts.length; i++) {
		ctx.lineTo(tubeScreenPts[i][0], tubeScreenPts[i][1]);
	}
	ctx.strokeStyle = CAFE_PALETTE.strokeNavy;
	ctx.lineWidth = 17;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.stroke();
	ctx.strokeStyle = "#D8F3FE";
	ctx.lineWidth = 13.5;
	ctx.stroke();
	ctx.restore();
	const drawOrderTicketInTube = (sPos: number, highlightOrange: boolean) => {
		const { pos, tangent } = sampleTubePoint(sPos);
		const center = iso(pos[0], pos[1], pos[2]);
		const nextPt = iso(pos[0] + tangent[0] * .1, pos[1] + tangent[1] * .1, pos[2] + tangent[2] * .1);
		const angle = Math.atan2(nextPt[1] - center[1], nextPt[0] - center[0]);
		ctx.save();
		ctx.translate(center[0], center[1]);
		ctx.rotate(angle);
		ctx.fillStyle = "#FFFFFF";
		ctx.strokeStyle = CAFE_PALETTE.strokeNavy;
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.roundRect(-8, -4.5, 16, 9, 1.5);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = highlightOrange ? CAFE_PALETTE.orangeAccent : "#94A3B8";
		ctx.fillRect(-5.5, -2.6, 3.2, 5.2);
		ctx.fillStyle = "#64748B";
		ctx.fillRect(-.8, -2.4, 6.2, 1.3);
		ctx.fillRect(-.8, -.4, 5, 1.3);
		ctx.fillRect(-.8, 1.6, 4.2, 1.3);
		ctx.restore();
	};
	if (ch.ticketActive) {
		drawOrderTicketInTube(ch.ticketProgress, true);
	}
	const slowFlow = tSec / CAFE_LOOP_DURATION % 1;
	drawOrderTicketInTube((slowFlow * .7 + .15) % .9, false);
	drawOrderTicketInTube(((slowFlow + .45) * .7 + .15) % .9, true);
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(tubeScreenPts[0][0], tubeScreenPts[0][1] - 3);
	for (let i = 1; i < tubeScreenPts.length; i++) {
		ctx.lineTo(tubeScreenPts[i][0], tubeScreenPts[i][1] - 3);
	}
	ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
	ctx.lineWidth = 2.6;
	ctx.lineCap = "round";
	ctx.stroke();
	ctx.restore();
	for (const ringS of [
		.14,
		.35,
		.56,
		.76,
		.92
	]) {
		const { pos } = sampleTubePoint(ringS);
		const p = iso(pos[0], pos[1], pos[2]);
		ctx.strokeStyle = CAFE_PALETTE.strokeNavy;
		ctx.lineWidth = 1.25;
		ctx.beginPath();
		ctx.ellipse(p[0], p[1], 4.5, 7.2, .3, 0, Math.PI * 2);
		ctx.stroke();
	}
	// ============================================================================
	// 6. TWO POTTED PLANTS BESIDE THE DOOR & WAITRESS ON SIDEWALK
	// ============================================================================
	const plantSway = Math.sin(tSec / CAFE_LOOP_DURATION * Math.PI * 2) * 1.1;
	drawPottedPlant(22, -14, 0, plantSway);
	drawPottedPlant(74, -14, 0, -plantSway);
	// Waitress walking calmly on the sidewalk to serve the customer's table (when y < -2)
	if (!ch.waitressBehindCounter && ch.waitressY < -2) {
		drawSmilingCafeCharacter({
			x: ch.waitressX,
			y: ch.waitressY,
			z: 0,
			role: "waitress",
			faceDir: "front-right",
			stride: ch.waitressStride,
			holdingTrayWithOrder: ch.trayHasOrder,
			extraSmile: true
		});
	}
	// ============================================================================
	// 7. SIDEWALK ROUND TABLE, STANDING QR CODE SIGN & SMILING CUSTOMER WITH SMARTPHONE
	// ============================================================================
	const TBL_X = 104;
	const TBL_Y = -28;
	const TBL_Z = 18;
	const tblShadowPts = [];
	for (let i = 0; i < 24; i++) {
		const a = i / 24 * Math.PI * 2;
		tblShadowPts.push(iso(TBL_X + Math.cos(a) * 18, TBL_Y + Math.sin(a) * 18, .3));
	}
	drawPoly(tblShadowPts, "rgba(15, 23, 42, 0.14)");
	drawPrism(TBL_X - 6, TBL_Y - 6, 0, 12, 12, 2.2, {
		top: CAFE_PALETTE.lightWood,
		right: CAFE_PALETTE.lightWoodDark,
		left: CAFE_PALETTE.lightWoodMid,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	drawPrism(TBL_X - 2, TBL_Y - 2, 2.2, 4, 4, TBL_Z - 2.2, {
		top: CAFE_PALETTE.lightWoodMid,
		right: CAFE_PALETTE.lightWoodDark,
		left: CAFE_PALETTE.lightWood,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	const drawTableDisk = (zLevel: number, fill: string) => {
		const pts = [];
		const r = 19;
		for (let i = 0; i < 28; i++) {
			const a = i / 28 * Math.PI * 2;
			pts.push(iso(TBL_X + Math.cos(a) * r, TBL_Y + Math.sin(a) * r, zLevel));
		}
		drawPoly(pts, fill, CAFE_PALETTE.strokeNavy, 1.45);
	};
	drawTableDisk(TBL_Z - 2.5, CAFE_PALETTE.lightWoodMid);
	drawTableDisk(TBL_Z, "#FDE68A");
	// Standing QR Code Tent Sign on the Round Table (abstract black-and-white square pattern, no letters)
	const QR_X = TBL_X - 6;
	const QR_Y = TBL_Y + 3;
	const QR_Z = TBL_Z + .5;
	drawPrism(QR_X - 4.5, QR_Y - 4.5, QR_Z, 9, 6, 12.5, {
		top: "#FFFFFF",
		right: "#FFFFFF",
		left: "#E2E8F0",
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.35
	});
	const qfY = QR_Y - 4.65;
	const drawQrBlock = (qx: number, qz: number, qw: number, qh: number) => {
		drawPoly([
			iso(qx, qfY, qz),
			iso(qx + qw, qfY, qz),
			iso(qx + qw, qfY, qz + qh),
			iso(qx, qfY, qz + qh)
		], CAFE_PALETTE.strokeNavy);
	};
	drawQrBlock(QR_X - 3.2, QR_Z + 7.8, 2.6, 2.8);
	drawQrBlock(QR_X + .6, QR_Z + 7.8, 2.6, 2.8);
	drawQrBlock(QR_X - 3.2, QR_Z + 2.2, 2.6, 2.8);
	drawQrBlock(QR_X + .4, QR_Z + 4.8, 1.5, 1.5);
	drawQrBlock(QR_X + 1.8, QR_Z + 2.4, 1.5, 1.8);
	drawQrBlock(QR_X - .2, QR_Z + 2.4, 1.4, 1.4);
	// Served Dish & Steaming Coffee Cup on the Table
	if (ch.tableServedAlpha > .05) {
		const sA = ch.tableServedAlpha;
		const cupX = TBL_X + 5;
		const cupY = TBL_Y - 5;
		const cupZ = TBL_Z + .5;
		drawPrism(TBL_X - 3, TBL_Y - 10, cupZ, 6.5 * sA, 6.5 * sA, 2.8 * sA, {
			top: CAFE_PALETTE.orangeAccent,
			right: CAFE_PALETTE.orangeDark,
			left: CAFE_PALETTE.warmYellowLamp,
			stroke: CAFE_PALETTE.strokeNavy,
			lineWidth: 1.2
		});
		drawPrism(cupX, cupY, cupZ, 5.5 * sA, 5.5 * sA, 6.5 * sA, {
			top: "#FFFFFF",
			right: "#CBD5E1",
			left: "#FFFFFF",
			stroke: CAFE_PALETTE.strokeNavy,
			lineWidth: 1.25
		});
		if (ch.steamRiseProgress > .02) {
			const stLift = ch.steamRiseProgress * 9;
			const stAlpha = Math.sin(ch.steamRiseProgress * Math.PI);
			const stColor = `rgba(21, 39, 94, ${stAlpha * .75})`;
			drawLine(iso(cupX + 1.8, cupY + 2.5, cupZ + 8 + stLift * .5), iso(cupX + 1.2, cupY + 2.5, cupZ + 13 + stLift), stColor, 1.6);
			drawLine(iso(cupX + 3.8, cupY + 2.5, cupZ + 9 + stLift * .6), iso(cupX + 4.4, cupY + 2.5, cupZ + 14.5 + stLift), stColor, 1.6);
		}
	}
	// Smiling Customer Sitting at the Sidewalk Table holding a Smartphone!
	const CUST_X = TBL_X + 26;
	const CUST_Y = TBL_Y - 2;
	drawSmilingCafeCharacter({
		x: CUST_X,
		y: CUST_Y,
		z: 0,
		role: "seated-customer",
		faceDir: "front-left",
		armLift: ch.phoneAimLift * .6,
		extraSmile: ch.tableServedAlpha > .3
	});
	const phX = CUST_X - 11.5;
	const phY = CUST_Y - 1.5;
	const phZ = 16.5 + ch.phoneAimLift * 1.5;
	drawPrism(phX, phY, phZ, 4.5, 2.8, 7.5, {
		top: CAFE_PALETTE.royalBright,
		right: CAFE_PALETTE.navyRoof,
		left: CAFE_PALETTE.navyDeep,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	if (ch.qrScanBeamAlpha > .02) {
		drawPoly([
			iso(phX, phY, phZ + 4),
			iso(QR_X + 3, QR_Y - 2, QR_Z + 10),
			iso(QR_X + 3, QR_Y - 2, QR_Z + 2)
		], `rgba(56, 189, 248, ${ch.qrScanBeamAlpha * .35})`);
	}
	// Smartphone Menu Screen Display
	if (ch.menuBlocksLit > .04) {
		const mScale = easeOutBackPop(Math.min(1, ch.menuBlocksLit * 1.15));
		const SCR_X0 = 96;
		const SCR_W = 34 * mScale;
		const SCR_Y = -5.5;
		const SCR_Z0 = 36;
		const SCR_H = 50 * mScale;
		drawPrism(SCR_X0, SCR_Y, SCR_Z0, SCR_W, 3, SCR_H, {
			top: CAFE_PALETTE.royalBright,
			right: "#FFFFFF",
			left: CAFE_PALETTE.navyRoof,
			stroke: CAFE_PALETTE.strokeNavy,
			lineWidth: 1.6
		});
		const sfY = SCR_Y - .25;
		const sx0 = SCR_X0 + 2.8;
		const sx1 = SCR_X0 + SCR_W - 2.8;
		const sz0 = SCR_Z0 + 3;
		const sz1 = SCR_Z0 + SCR_H - 3.5;
		drawPoly([
			iso(sx0, sfY, sz0),
			iso(sx1, sfY, sz0),
			iso(sx1, sfY, sz1),
			iso(sx0, sfY, sz1)
		], "#FFFFFF", CAFE_PALETTE.strokeNavy, 1.25);
		for (let row = 0; row < 3; row++) {
			const rzTop = sz1 - 5 - row * 11.5 * mScale;
			const rzBot = rzTop - 8.2 * mScale;
			const imgX1 = sx0 + 8.5 * mScale;
			drawPoly([
				iso(sx0 + 2, sfY - .1, rzBot),
				iso(imgX1, sfY - .1, rzBot),
				iso(imgX1, sfY - .1, rzTop),
				iso(sx0 + 2, sfY - .1, rzTop)
			], "#CBD5E1", CAFE_PALETTE.strokeNavy, 1.1);
			drawPoly([
				iso(imgX1 + 2.5, sfY - .1, rzTop - 2.5),
				iso(sx1 - 2.5, sfY - .1, rzTop - 2.5),
				iso(sx1 - 2.5, sfY - .1, rzTop - .8),
				iso(imgX1 + 2.5, sfY - .1, rzTop - .8)
			], "#94A3B8");
			drawPoly([
				iso(imgX1 + 2.5, sfY - .1, rzBot + 1.5),
				iso(sx1 - 5, sfY - .1, rzBot + 1.5),
				iso(sx1 - 5, sfY - .1, rzBot + 3.2),
				iso(imgX1 + 2.5, sfY - .1, rzBot + 3.2)
			], "#CBD5E1");
		}
		if (ch.orangeButtonTapPop > .05) {
			const bScale = ch.orangeButtonTapPop;
			const btnCX = (sx0 + sx1) / 2;
			const btnCZ = sz0 + 5.2 * mScale;
			const bw = 9.5 * mScale * bScale;
			const bh = 2.6 * mScale * bScale;
			drawPoly([
				iso(btnCX - bw, sfY - .2, btnCZ - bh),
				iso(btnCX + bw, sfY - .2, btnCZ - bh),
				iso(btnCX + bw, sfY - .2, btnCZ + bh),
				iso(btnCX - bw, sfY - .2, btnCZ + bh)
			], CAFE_PALETTE.orangeAccent, CAFE_PALETTE.strokeNavy, 1.25);
		}
	}
	// ============================================================================
	// 8. NAVY-AND-WHITE STRIPED AWNING & DEEP NAVY ROOF
	// ============================================================================
	const AWNING_X0 = 4;
	const AWNING_X1 = BX - 4;
	const AWNING_Z_WALL = FACADE_TOP_Z - 2;
	const AWNING_Z_FRONT = FACADE_TOP_Z - 28;
	const AWNING_Y_FRONT = -28;
	const STRIPE_COUNT = 10;
	const stripeW = (AWNING_X1 - AWNING_X0) / STRIPE_COUNT;
	drawLine(iso(AWNING_X0, -1, AWNING_Z_FRONT - 8), iso(AWNING_X0, AWNING_Y_FRONT + 4, AWNING_Z_FRONT), CAFE_PALETTE.strokeNavy, 2.4);
	for (let s = 0; s < STRIPE_COUNT; s++) {
		const sx0 = AWNING_X0 + s * stripeW;
		const sx1 = sx0 + stripeW;
		const isNavy = s % 2 === 0;
		const fill = isNavy ? CAFE_PALETTE.navyRoof : "#FFFFFF";
		const valanceFill = isNavy ? CAFE_PALETTE.navyDeep : "#E2E8F0";
		drawPoly([
			iso(sx0, -1.5, AWNING_Z_WALL),
			iso(sx1, -1.5, AWNING_Z_WALL),
			iso(sx1, AWNING_Y_FRONT, AWNING_Z_FRONT),
			iso(sx0, AWNING_Y_FRONT, AWNING_Z_FRONT)
		], fill, CAFE_PALETTE.strokeNavy, 1.4);
		drawPoly([
			iso(sx0, AWNING_Y_FRONT, AWNING_Z_FRONT),
			iso(sx1, AWNING_Y_FRONT, AWNING_Z_FRONT),
			iso(sx1 - 1.2, AWNING_Y_FRONT, AWNING_Z_FRONT - 6.5),
			iso((sx0 + sx1) / 2, AWNING_Y_FRONT, AWNING_Z_FRONT - 8.5),
			iso(sx0 + 1.2, AWNING_Y_FRONT, AWNING_Z_FRONT - 6.5)
		], valanceFill, CAFE_PALETTE.strokeNavy, 1.35);
	}
	// Deep Navy Roof Parapet & Flat Roof
	drawPrism(-6, -2.5, FACADE_TOP_Z, BX + 8, BY + 4.5, 14, {
		top: CAFE_PALETTE.royalBlue,
		right: CAFE_PALETTE.royalBlue,
		left: CAFE_PALETTE.navyRoof,
		stroke: CAFE_PALETTE.strokeNavy,
		lineWidth: 1.6
	});
	drawPoly([
		iso(4, 6, ROOF_Z + .3),
		iso(BX - 4, 6, ROOF_Z + .3),
		iso(BX - 4, BY - 6, ROOF_Z + .3),
		iso(4, BY - 6, ROOF_Z + .3)
	], CAFE_PALETTE.navyDeep, CAFE_PALETTE.strokeNavy, 1.4);
	ctx.restore();
};
