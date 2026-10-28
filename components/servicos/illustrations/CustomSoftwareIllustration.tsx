'use client';

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
  actionPhase?: number;
  stride?: number;
  holdingSheets?: boolean;
  headNodZ?: number;
};

export interface CustomSoftwareIllustrationProps {
  /** Cor de fundo do quadro isométrico. Padrão: "#f3f0e8" */
  backgroundColor?: string;
  /** Texto alternativo descritivo em português para SEO e leitores de tela */
  alt?: string;
  /** Multiplicador de velocidade (padrão 1.0 para loop contínuo de 4.00s) */
  speed?: number;
  /** Escala visual aplicada dentro do quadro recortado. */
  zoom?: number;
  /** Classes utilitárias opcionais para o container */
  className?: string;
}

/**
 * Componente Next.js leve e SEO-friendly: Software Sob Medida (~16 KB, 0 requisições externas)
 */
export default function CustomSoftwareIllustration({
  backgroundColor = '#f3f0e8',
  alt = 'Ilustração isométrica em loop do escritório de uma pequena empresa em um prédio de esquina de dois andares com silhueta escalonada e terraço com vaso de planta: no térreo com planilhas soltas espalhadas, um funcionário leva uma pilha de folhas até o pequeno elevador de carga que sobe ao segundo andar organizado, onde outro funcionário arquiva as folhas na gaveta de madeira com abas coloridas; ao fechar a gaveta, a interface de um software sob medida (com pequeno formulário, grade de tabela, três gráficos de barras crescentes e botão laranja) constrói-se na tela da parede, no grande monitor de computador sobre pedestal no telhado ao lado do desenvolvedor com notebook e no tablet do proprietário na porta.',
  speed = 1,
  zoom = 1,
  className = 'w-full max-w-[640px] aspect-square mx-auto',
}: CustomSoftwareIllustrationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let isVisible = true;
    let animTime = 2.85; // Renderiza o quadro com os gráficos de barras e botão laranja acesos no primeiro paint (LCP imediato)
    let lastTs: number | null = null;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    drawCustomSoftwareScene(ctx, canvas.width, canvas.height, animTime, false, backgroundColor);

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
          animTime = (animTime + ((ts - lastTs) / 1000) * speed) % 4;
        }
        lastTs = ts;
        drawCustomSoftwareScene(ctx, canvas.width, canvas.height, animTime, false, backgroundColor);
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

const CUSTOM_SOFTWARE_LOOP_DURATION = 4;
const CUSTOM_SOFTWARE_PALETTE = {
  "canvasCreamBg": "#f3f0e8",
  "strokeNavy": "#15275E",
  "navyDeep": "#0F1E4D",
  "navyBand": "#162B6F",
  "navyAwning": "#162B6F",
  "navyAwningDark": "#0F1E4D",
  "royalFacade": "#1E40AF",
  "royalBright": "#235AE4",
  "creamStucco": "#F7F2E7",
  "creamStuccoShade": "#E8DFCE",
  "terracottaAccent": "#D96B43",
  "terracottaDark": "#B8532E",
  "warmInteriorWall": "#FDE68A",
  "warmInteriorFloor": "#FDE047",
  "warmPortholeGlow": "#FEF08A",
  "lightWood": "#D99B66",
  "lightWoodMid": "#C6854B",
  "lightWoodDark": "#A36631",
  "warmWoodDoor": "#B86B35",
  "warmWoodDoorDark": "#8F4F22",
  "orangeAccent": "#F97316",
  "orangeShade": "#EA580C",
  "plantGreenDark": "#15803D",
  "plantGreenMid": "#16A34A",
  "plantGreenLight": "#22C55E",
  "potTerracotta": "#D96B43",
  "potTerracottaDark": "#9A3412"
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

const computeCustomSoftwareChoreography = function computeCustomSoftwareChoreography(tSec: number) {
	const resetFade = tSec >= 3.48 ? 1 - easeInOutCubic((tSec - 3.48) / .52) : 1;
	// Ground floor worker 1: scratching head in confusion among the messy spreadsheets
	const headScratchPhase = Math.sin(tSec / CUSTOM_SOFTWARE_LOOP_DURATION * Math.PI * 8);
	// Ground floor worker 2: walks toward the corner freight lift (0.05s..0.65s), places stack of sheets (0.65s..0.90s), steps back
	const carrierWalkProgress = tSec < .65 ? easeInOutCubic(tSec / .65) : tSec < 1.15 ? 1 : tSec < 2.1 ? 1 - easeInOutCubic((tSec - 1.15) / .95) : 0;
	const carrierHasSheets = tSec < .72 || tSec >= 3.68;
	const carrierStride = tSec < .65 || tSec >= 1.15 && tSec < 2.1 ? Math.sin(tSec * Math.PI * 7) * .8 : 0;
	// Loose sheets on the ground floor become fewer once loaded into the lift (0.55s..0.95s), then reset at 3.50s..4.00s
	const extraFloorSheetsScale = tSec < .5 ? 1 : tSec < .88 ? 1 - easeInOutCubic((tSec - .5) / .38) : tSec < 3.52 ? 0 : easeInOutCubic((tSec - 3.52) / .48);
	// Small freight lift platform rises from ground floor (0.80s) to upper floor (1.55s), stays until 2.95s, then lowers smoothly
	const liftRiseProgress = tSec < .78 ? 0 : tSec < 1.55 ? easeInOutCubic((tSec - .78) / .77) : tSec < 3.1 ? 1 : 1 - easeInOutCubic((tSec - 3.1) / .85);
	const sheetsInLiftScale = tSec < .65 ? 0 : tSec < .82 ? easeOutBackPop((tSec - .65) / .17) : tSec < 1.65 ? 1 : tSec < 1.88 ? 1 - easeInOutCubic((tSec - 1.65) / .23) : 0;
	// Upper floor worker files the sheets into the open wooden cabinet drawer, then closes the drawer (1.80s..2.12s)
	const drawerOpenRatio = tSec < 1.1 ? .25 : tSec < 1.48 ? .25 + .75 * easeOutCubic((tSec - 1.1) / .38) : tSec < 1.82 ? 1 : tSec < 2.15 ? 1 - easeInOutCubic((tSec - 1.82) / .33) : tSec < 3.52 ? 0 : .25 * easeInOutCubic((tSec - 3.52) / .48);
	const upperWorkerFileArm = tSec >= 1.45 && tSec <= 2.15 ? Math.sin((tSec - 1.45) / .7 * Math.PI) : 0;
	// As the drawer closes (~1.95s), the app interface builds itself block by block:
	// 1) Form & Table grid fill in (1.92s..2.45s)
	const formAndGridProgress = easeOutCubic((tSec - 1.92) / .52) * resetFade;
	// 2) Three bar charts grow one after another (2.18s..2.85s)
	const bar1Growth = easeOutBackPop((tSec - 2.18) / .28) * resetFade;
	const bar2Growth = easeOutBackPop((tSec - 2.34) / .28) * resetFade;
	const bar3Growth = easeOutBackPop((tSec - 2.5) / .28) * resetFade;
	// 3) Small orange button pops (2.68s..2.98s)
	const orangeButtonPop = easeOutBackPop((tSec - 2.68) / .28) * resetFade;
	// Rooftop developer nods at the screen (2.55s..3.40s) while typing on laptop
	const devTypingPhase = Math.sin(tSec / CUSTOM_SOFTWARE_LOOP_DURATION * Math.PI * 10);
	const devNodZ = tSec >= 2.55 && tSec <= 3.42 ? -Math.abs(Math.sin((tSec - 2.55) / .87 * Math.PI * 2)) * 2.1 : 0;
	// Upper-floor owner in apron & outdoor owner with tablet react happily as interface completes
	const ownerSmileBounce = tSec >= 2.5 && tSec <= 3.4 ? Math.abs(Math.sin((tSec - 2.5) / .9 * Math.PI * 2)) * 1.8 : 0;
	const outdoorOwnerTilt = Math.sin(tSec / CUSTOM_SOFTWARE_LOOP_DURATION * Math.PI * 2) * .6;
	return {
		resetFade,
		headScratchPhase,
		carrierWalkProgress,
		carrierHasSheets,
		carrierStride,
		extraFloorSheetsScale,
		liftRiseProgress,
		sheetsInLiftScale,
		drawerOpenRatio,
		upperWorkerFileArm,
		formAndGridProgress,
		bar1Growth,
		bar2Growth,
		bar3Growth,
		orangeButtonPop,
		devTypingPhase,
		devNodZ,
		ownerSmileBounce,
		outdoorOwnerTilt
	};
};

const drawCustomSoftwareScene = function drawCustomSoftwareScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tSec: number,
  showGuides: boolean,
  canvasBackground = "#f3f0e8"
) {
	ctx.save();
	ctx.clearRect(0, 0, width, height);
	if (canvasBackground !== "transparent") {
		ctx.fillStyle = canvasBackground;
		ctx.fillRect(0, 0, width, height);
	}
	const baseScale = width / 1e3;
	ctx.scale(baseScale, baseScale);
	// Framing so the stepped two-story building + rooftop monitor fill the canvas cleanly
	ctx.translate(500, 520);
	ctx.scale(1.14, 1.14);
	ctx.translate(-500, -520);
	const originX = 496;
	const originY = 716;
	const iso = (x: number, y: number, z: number): Point => [originX + (x - y) * COS30, originY - (x + y) * SIN30 - z];
	const drawPoly = (pts: Point[], fill: string, stroke: string, lineWidth = 1.5, lineJoin: CanvasLineJoin = "round") => {
		if (pts.length === 0) return;
		ctx.beginPath();
		ctx.moveTo(pts[0][0], pts[0][1]);
		for (let i = 1; i < pts.length; i++) {
			ctx.lineTo(pts[i][0], pts[i][1]);
		}
		ctx.closePath();
		if (fill && fill !== "none") {
			ctx.fillStyle = fill;
			ctx.fill();
		}
		if (stroke && stroke !== "none") {
			ctx.strokeStyle = stroke;
			ctx.lineWidth = lineWidth;
			ctx.lineJoin = lineJoin;
			ctx.stroke();
		}
	};
	const drawLine = (p1: Point, p2: Point, stroke: string, lineWidth = 1.4, dash?: number[]) => {
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
		const st = colors.stroke ?? CUSTOM_SOFTWARE_PALETTE.strokeNavy;
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
	/**
	* Draws an isometric porthole window on the front-right facade (y = yPlane)
	*/
	const drawPortholeWindowOnY = (cx: number, yPlane: number, cz: number, radius: number) => {
		const segs = 24;
		const outerPts = [];
		const innerPts = [];
		for (let i = 0; i < segs; i++) {
			const ang = i / segs * Math.PI * 2;
			const dx = Math.cos(ang) * radius;
			const dz = Math.sin(ang) * radius;
			outerPts.push(iso(cx + dx, yPlane, cz + dz));
			innerPts.push(iso(cx + dx * .76, yPlane - .15, cz + dz * .76));
		}
		drawPoly(outerPts, CUSTOM_SOFTWARE_PALETTE.navyBand, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.45);
		drawPoly(innerPts, CUSTOM_SOFTWARE_PALETTE.warmPortholeGlow, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.2);
		// Subtle cross mullion inside porthole
		drawLine(iso(cx - radius * .72, yPlane - .2, cz), iso(cx + radius * .72, yPlane - .2, cz), CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1);
		drawLine(iso(cx, yPlane - .2, cz - radius * .72), iso(cx, yPlane - .2, cz + radius * .72), CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1);
	};
	/**
	* Helper to draw a loose spreadsheet sheet on a horizontal plane z
	*/
	const drawSpreadsheetSheet = (sx: number, sy: number, sz: number, sw = 9, sd = 7, tint = "white") => {
		const fill = tint === "blue" ? "#DBEAFE" : tint === "cream" ? "#FEF9C3" : "#FFFFFF";
		drawPoly([
			iso(sx, sy, sz),
			iso(sx + sw, sy, sz),
			iso(sx + sw, sy + sd, sz),
			iso(sx, sy + sd, sz)
		], fill, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.05);
		// Tiny spreadsheet grid lines (no text)
		drawLine(iso(sx + 1.5, sy + sd * .36, sz + .1), iso(sx + sw - 1.5, sy + sd * .36, sz + .1), "#94A3B8", .85);
		drawLine(iso(sx + 1.5, sy + sd * .68, sz + .1), iso(sx + sw - 1.5, sy + sd * .68, sz + .1), "#94A3B8", .85);
	};
	/**
	* Helper to draw a stack of loose spreadsheet sheets
	*/
	const drawPaperStack = (px: number, py: number, pz: number, pw = 10, pd = 8, ph = 4.5) => {
		drawPrism(px, py, pz, pw, pd, ph, {
			top: "#FFFFFF",
			right: "#CBD5E1",
			left: "#E2E8F0",
			stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
			lineWidth: 1.15
		});
		drawLine(iso(px + 1.8, py + pd * .4, pz + ph + .15), iso(px + pw - 1.8, py + pd * .4, pz + ph + .15), "#64748B", .9);
		drawLine(iso(px + 1.8, py + pd * .7, pz + ph + .15), iso(px + pw - 1.8, py + pd * .7, pz + ph + .15), "#94A3B8", .9);
	};
	const ch = computeCustomSoftwareChoreography(tSec);
	const plantSway = Math.sin(tSec / CUSTOM_SOFTWARE_LOOP_DURATION * Math.PI * 2) * 1;
	/**
	* Helper to draw the synchronized Custom Software App Interface (form, table grid,
	* three growing bar charts, and a small orange button) on a vertical screen facing -y
	*/
	const drawAppInterfaceOnYScreen = (sX0: number, sX1: number, sY: number, sZ0: number, sZ1: number, isCompact = false) => {
		const W = sX1 - sX0;
		const H = sZ1 - sZ0;
		// White screen canvas
		drawPoly([
			iso(sX0, sY, sZ0),
			iso(sX1, sY, sZ0),
			iso(sX1, sY, sZ1),
			iso(sX0, sY, sZ1)
		], "#FFFFFF", CUSTOM_SOFTWARE_PALETTE.strokeNavy, isCompact ? 1 : 1.3);
		// Top Navy Header Bar
		const hdrH = H * .13;
		drawPoly([
			iso(sX0, sY - .08, sZ1 - hdrH),
			iso(sX1, sY - .08, sZ1 - hdrH),
			iso(sX1, sY - .08, sZ1),
			iso(sX0, sY - .08, sZ1)
		], CUSTOM_SOFTWARE_PALETTE.navyBand, CUSTOM_SOFTWARE_PALETTE.strokeNavy, isCompact ? .9 : 1.1);
		const contentZ0 = sZ0 + H * .08;
		const contentZ1 = sZ1 - hdrH - H * .06;
		const contentH = contentZ1 - contentZ0;
		// 1. Small Form on the Top-Left (2 input field blocks)
		const leftX0 = sX0 + W * .07;
		const leftX1 = sX0 + W * .48;
		const formZ1 = contentZ1;
		const formZ0 = contentZ1 - contentH * .34;
		const formLit = ch.formAndGridProgress > .15;
		drawPoly([
			iso(leftX0, sY - .12, formZ0),
			iso(leftX1, sY - .12, formZ0),
			iso(leftX1, sY - .12, formZ1),
			iso(leftX0, sY - .12, formZ1)
		], formLit ? "#EFF6FF" : "#F8FAFC", CUSTOM_SOFTWARE_PALETTE.strokeNavy, isCompact ? .8 : 1);
		// Two form input bars inside the form box
		const inpH = (formZ1 - formZ0) * .24;
		drawLine(iso(leftX0 + W * .04, sY - .16, formZ1 - inpH * 1.2), iso(leftX1 - W * .06, sY - .16, formZ1 - inpH * 1.2), formLit ? CUSTOM_SOFTWARE_PALETTE.royalBright : "#CBD5E1", isCompact ? 1.1 : 1.6);
		drawLine(iso(leftX0 + W * .04, sY - .16, formZ0 + inpH * 1.2), iso(leftX1 - W * .12, sY - .16, formZ0 + inpH * 1.2), formLit ? "#60A5FA" : "#CBD5E1", isCompact ? 1.1 : 1.6);
		// 2. Table Grid on the Bottom-Left (2 columns x 3 rows of structured cells)
		const tblZ1 = formZ0 - contentH * .07;
		const tblZ0 = contentZ0;
		const rows = 3;
		const cols = 2;
		const rowH = (tblZ1 - tblZ0) / rows;
		const colW = (leftX1 - leftX0) / cols;
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const cellIdx = r * cols + c;
				const isCellLit = ch.formAndGridProgress > .22 + cellIdx * .11;
				const cx0 = leftX0 + c * colW + (c > 0 ? W * .01 : 0);
				const cx1 = leftX0 + (c + 1) * colW - (c === 0 ? W * .01 : 0);
				const cz1 = tblZ1 - r * rowH - (r > 0 ? H * .008 : 0);
				const cz0 = tblZ1 - (r + 1) * rowH + H * .008;
				drawPoly([
					iso(cx0, sY - .12, cz0),
					iso(cx1, sY - .12, cz0),
					iso(cx1, sY - .12, cz1),
					iso(cx0, sY - .12, cz1)
				], isCellLit ? r === 0 ? "#BFDBFE" : "#FDE68A" : "#F1F5F9", CUSTOM_SOFTWARE_PALETTE.strokeNavy, isCompact ? .75 : .95);
			}
		}
		// 3. Three Growing Bar Charts on the Top-Right
		const rightX0 = sX0 + W * .54;
		const rightX1 = sX1 - W * .07;
		const chartZ0 = contentZ0 + contentH * .3;
		const chartZ1 = contentZ1;
		const chartW = rightX1 - rightX0;
		const chartMaxH = chartZ1 - chartZ0;
		// Chart baseline
		drawLine(iso(rightX0, sY - .14, chartZ0), iso(rightX1, sY - .14, chartZ0), CUSTOM_SOFTWARE_PALETTE.strokeNavy, isCompact ? .9 : 1.2);
		const bars = [
			{
				growth: ch.bar1Growth,
				maxRatio: .48,
				color: "#60A5FA"
			},
			{
				growth: ch.bar2Growth,
				maxRatio: .74,
				color: CUSTOM_SOFTWARE_PALETTE.royalBright
			},
			{
				growth: ch.bar3Growth,
				maxRatio: .96,
				color: CUSTOM_SOFTWARE_PALETTE.orangeAccent
			}
		];
		const barGap = chartW * .08;
		const singleBarW = (chartW - barGap * 2) / 3;
		bars.forEach((b, idx) => {
			const bx0 = rightX0 + idx * (singleBarW + barGap);
			const bx1 = bx0 + singleBarW;
			const curH = Math.max(chartMaxH * .12, chartMaxH * b.maxRatio * clamp01(b.growth));
			drawPoly([
				iso(bx0, sY - .15, chartZ0),
				iso(bx1, sY - .15, chartZ0),
				iso(bx1, sY - .15, chartZ0 + curH),
				iso(bx0, sY - .15, chartZ0 + curH)
			], b.color, CUSTOM_SOFTWARE_PALETTE.strokeNavy, isCompact ? .8 : 1.05);
		});
		// 4. Small Orange Button at the Bottom-Right
		const btnScale = Math.max(.35, ch.orangeButtonPop);
		const btnCX = (rightX0 + rightX1) / 2;
		const btnCZ = contentZ0 + contentH * .12;
		const btnHW = chartW * .46 * btnScale;
		const btnHH = contentH * .095 * btnScale;
		drawPoly([
			iso(btnCX - btnHW, sY - .18, btnCZ - btnHH),
			iso(btnCX + btnHW, sY - .18, btnCZ - btnHH),
			iso(btnCX + btnHW, sY - .18, btnCZ + btnHH),
			iso(btnCX - btnHW, sY - .18, btnCZ + btnHH)
		], CUSTOM_SOFTWARE_PALETTE.orangeAccent, CUSTOM_SOFTWARE_PALETTE.strokeNavy, isCompact ? .85 : 1.15);
	};
	/**
	* Draws tiny blocky navy-and-white characters at the exact same small scale as the style reference
	*/
	const drawCharacter = (opts: CharacterOptions) => {
		const { x, y, z, scaleFactor = 1, role, actionPhase = 0, stride = 0, holdingSheets = false, headNodZ = 0 } = opts;
		const s = scaleFactor;
		const legSpread = stride * 3.2 * s;
		const isApron = role === "upper-apron-owner" || role === "outdoor-tablet-owner";
		const isSeated = role === "roof-developer-seated";
		// Ground contact shadow
		drawPoly([
			iso(x - 6 * s, y - 6 * s, z + .3),
			iso(x + 6 * s, y - 6 * s, z + .3),
			iso(x + 6 * s, y + 6 * s, z + .3),
			iso(x - 6 * s, y + 6 * s, z + .3)
		], "rgba(21, 39, 94, 0.20)", "none");
		const torsoBaseZ = isSeated ? z + 6.5 * s : z + 11.3 * s;
		if (isSeated) {
			// Seated legs extending forward (-y) toward the laptop on the roof
			drawPrism(x - 4 * s, y - 7.5 * s, z, 3.6 * s, 7.5 * s, 5.5 * s, {
				top: CUSTOM_SOFTWARE_PALETTE.royalBright,
				right: CUSTOM_SOFTWARE_PALETTE.navyBand,
				left: CUSTOM_SOFTWARE_PALETTE.royalFacade,
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.25
			});
			drawPrism(x + .4 * s, y - 7.5 * s, z, 3.6 * s, 7.5 * s, 5.5 * s, {
				top: CUSTOM_SOFTWARE_PALETTE.royalBright,
				right: CUSTOM_SOFTWARE_PALETTE.navyBand,
				left: CUSTOM_SOFTWARE_PALETTE.royalFacade,
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.25
			});
		} else {
			// Standing / walking legs
			drawPrism(x - 3.8 * s, y - 2.4 * s + legSpread, z, 3.4 * s, 4.4 * s, 2.5 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			drawPrism(x - 3.8 * s, y - 2.4 * s + legSpread, z + 2.5 * s, 3.4 * s, 4.4 * s, 8.8 * s, {
				top: CUSTOM_SOFTWARE_PALETTE.royalBright,
				right: CUSTOM_SOFTWARE_PALETTE.navyBand,
				left: CUSTOM_SOFTWARE_PALETTE.royalFacade,
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			drawPrism(x + .4 * s, y - 2.4 * s - legSpread, z, 3.4 * s, 4.4 * s, 2.5 * s, {
				top: "#FFFFFF",
				right: "#CBD5E1",
				left: "#FFFFFF",
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			drawPrism(x + .4 * s, y - 2.4 * s - legSpread, z + 2.5 * s, 3.4 * s, 4.4 * s, 8.8 * s, {
				top: CUSTOM_SOFTWARE_PALETTE.royalBright,
				right: CUSTOM_SOFTWARE_PALETTE.navyBand,
				left: CUSTOM_SOFTWARE_PALETTE.royalFacade,
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		}
		// Torso
		drawPrism(x - 4.8 * s, y - 3.4 * s, torsoBaseZ, 9.6 * s, 6.8 * s, 13 * s, {
			top: CUSTOM_SOFTWARE_PALETTE.royalBright,
			right: isApron ? CUSTOM_SOFTWARE_PALETTE.orangeAccent : CUSTOM_SOFTWARE_PALETTE.royalFacade,
			left: isApron ? CUSTOM_SOFTWARE_PALETTE.orangeAccent : "#FFFFFF",
			stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
			lineWidth: 1.4
		});
		// White Collar Strip
		drawPrism(x - 4.9 * s, y - 3.5 * s, torsoBaseZ + 11.5 * s, 9.8 * s, 7 * s, 1.8 * s, {
			top: "#FFFFFF",
			right: "#E2E8F0",
			left: "#FFFFFF",
			stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
			lineWidth: 1.2
		});
		// Left Arm
		if (role === "mess-head-scratcher") {
			// Raised hand scratching the side of his head
			const scratchZ = torsoBaseZ + (11.5 + actionPhase * 1.4) * s;
			drawPrism(x - 8 * s, y - 2 * s, scratchZ, 3.4 * s, 4.2 * s, 9.2 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		} else if (role === "roof-developer-seated") {
			const tapZ = actionPhase * .9;
			drawPrism(x - 7.8 * s, y - 6.2 * s, torsoBaseZ + (5.2 + tapZ) * s, 3.4 * s, 6.2 * s, 3.8 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.25
			});
		} else {
			drawPrism(x - 7.4 * s, y - 2.4 * s, torsoBaseZ + 2.5 * s, 2.6 * s, 4.8 * s, 9 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		}
		// Right Arm & Role-Specific Prop
		if (role === "mess-sheet-carrier") {
			drawPrism(x + 4.4 * s, y - 2.4 * s, torsoBaseZ + 4.2 * s, 4.8 * s, 4.8 * s, 4.2 * s, {
				top: "#FFFFFF",
				right: CUSTOM_SOFTWARE_PALETTE.royalFacade,
				left: "#FFFFFF",
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			if (holdingSheets) {
				drawPaperStack(x + 5.5 * s, y - 3.5 * s, torsoBaseZ + 7.5 * s, 10.5 * s, 8.5 * s, 5.2 * s);
			}
		} else if (role === "upper-cabinet-filer") {
			const reachY = actionPhase * 3.8;
			drawPrism(x + 4.2 * s, y + (1 + reachY) * s, torsoBaseZ + 5.5 * s, 4.4 * s, 5.2 * s, 3.8 * s, {
				top: "#FFFFFF",
				right: CUSTOM_SOFTWARE_PALETTE.royalFacade,
				left: "#FFFFFF",
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			if (actionPhase > .1) {
				drawSpreadsheetSheet(x + 5.5 * s, y + (3.5 + reachY) * s, torsoBaseZ + 8.5 * s, 8 * s, 6.5 * s, "cream");
			}
		} else if (role === "roof-developer-seated") {
			const tapZ = -actionPhase * .9;
			drawPrism(x + 4.4 * s, y - 6.2 * s, torsoBaseZ + (5.2 + tapZ) * s, 3.4 * s, 6.2 * s, 3.8 * s, {
				top: "#FFFFFF",
				right: "#CBD5E1",
				left: "#FFFFFF",
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.25
			});
		} else if (role === "outdoor-tablet-owner") {
			drawPrism(x + 4.4 * s, y - 3.6 * s, torsoBaseZ + 4.5 * s, 4 * s, 5 * s, 4 * s, {
				top: "#FFFFFF",
				right: CUSTOM_SOFTWARE_PALETTE.royalFacade,
				left: "#FFFFFF",
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.35
			});
			// Handheld Tablet showing the exact same App Interface
			const tbX0 = x + 6.8 * s;
			const tbW = 11.2 * s;
			const tbY = y - 4.5 * s;
			const tbZ0 = torsoBaseZ + 2.5 * s;
			const tbH = 14.2 * s;
			drawPrism(tbX0, tbY, tbZ0, tbW, 1.8, tbH, {
				top: CUSTOM_SOFTWARE_PALETTE.royalBright,
				right: CUSTOM_SOFTWARE_PALETTE.navyBand,
				left: CUSTOM_SOFTWARE_PALETTE.navyDeep,
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			drawAppInterfaceOnYScreen(tbX0 + 1.1, tbX0 + tbW - 1.1, tbY - .15, tbZ0 + 1.2, tbZ0 + tbH - 1.2, true);
		} else {
			drawPrism(x + 4.8 * s, y - 2.4 * s, torsoBaseZ + 2.5 * s, 2.6 * s, 4.8 * s, 9 * s, {
				top: "#FFFFFF",
				right: "#CBD5E1",
				left: "#FFFFFF",
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		}
		// Head
		const headZ = torsoBaseZ + 13.3 * s + headNodZ;
		drawPrism(x - 4 * s, y - 3.3 * s, headZ, 8 * s, 6.6 * s, 8.8 * s, {
			top: "#FFFFFF",
			right: "#F1F5F9",
			left: "#FFFFFF",
			stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
			lineWidth: 1.4
		});
		// Cap / Hair
		drawPrism(x - 4.4 * s, y - 3.7 * s, headZ + 7.9 * s, 8.8 * s, 7.4 * s, 3 * s, {
			top: CUSTOM_SOFTWARE_PALETTE.navyBand,
			right: CUSTOM_SOFTWARE_PALETTE.navyDeep,
			left: CUSTOM_SOFTWARE_PALETTE.royalFacade,
			stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
			lineWidth: 1.35
		});
	};
	const drawPottedPlant = (px: number, py: number, pz: number, sway: number, scaleP = 1) => {
		drawPoly([
			iso(px - 8 * scaleP, py - 8 * scaleP, pz + .2),
			iso(px + 8 * scaleP, py - 8 * scaleP, pz + .2),
			iso(px + 8 * scaleP, py + 8 * scaleP, pz + .2),
			iso(px - 8 * scaleP, py + 8 * scaleP, pz + .2)
		], "rgba(15, 23, 42, 0.16)", "none");
		drawPrism(px - 6.5 * scaleP, py - 6.5 * scaleP, pz, 13 * scaleP, 13 * scaleP, 11 * scaleP, {
			top: CUSTOM_SOFTWARE_PALETTE.potTerracotta,
			right: CUSTOM_SOFTWARE_PALETTE.potTerracottaDark,
			left: CUSTOM_SOFTWARE_PALETTE.orangeAccent,
			stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		drawPrism(px - 7.8 * scaleP, py - 7.8 * scaleP, pz + 10 * scaleP, 15.6 * scaleP, 15.6 * scaleP, 3.5 * scaleP, {
			top: CUSTOM_SOFTWARE_PALETTE.orangeAccent,
			right: CUSTOM_SOFTWARE_PALETTE.potTerracottaDark,
			left: CUSTOM_SOFTWARE_PALETTE.potTerracotta,
			stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		const leafZ = pz + 13.5 * scaleP;
		drawPoly([
			iso(px, py, leafZ),
			iso(px + (-10 + sway) * scaleP, py + 4 * scaleP, leafZ + 8 * scaleP),
			iso(px + (-8 + sway) * scaleP, py - 2 * scaleP, leafZ + 17 * scaleP),
			iso(px - 1 * scaleP, py - 2 * scaleP, leafZ + 10 * scaleP)
		], CUSTOM_SOFTWARE_PALETTE.plantGreenMid, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.3);
		drawPoly([
			iso(px, py, leafZ),
			iso(px + (10 + sway) * scaleP, py - 4 * scaleP, leafZ + 8 * scaleP),
			iso(px + (8 + sway) * scaleP, py + 2 * scaleP, leafZ + 17 * scaleP),
			iso(px + 1 * scaleP, py + 2 * scaleP, leafZ + 10 * scaleP)
		], CUSTOM_SOFTWARE_PALETTE.plantGreenDark, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.3);
		drawPoly([
			iso(px - 4 * scaleP, py - 3 * scaleP, leafZ + 2 * scaleP),
			iso(px + sway * 1.2 * scaleP, py, leafZ + 23 * scaleP),
			iso(px + 4 * scaleP, py + 3 * scaleP, leafZ + 2 * scaleP)
		], CUSTOM_SOFTWARE_PALETTE.plantGreenLight, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.35);
	};
	// ============================================================================
	// STEPPED TWO-FLOOR CORNER BUILDING GEOMETRY:
	// - Ground Floor (The Mess): x = 16..148, y = -18..150, z = 0..58
	// - Upper Floor (The Order): x = 16..148, y = -18..96,  z = 58..114
	// - Stepped Terrace on Left: x = 16..148, y = 96..150,  z = 58 (with potted plant)
	// Cutaway is open on the front-left side (x = 16) showing both floors!
	// ============================================================================
	const BLDG_X0 = 16;
	const BLDG_X1 = 148;
	const FRONT_Y0 = -18;
	const UPPER_Y1 = 96;
	const GND_Y1 = 150;
	const FL1_H = 58;
	const FL2_H = 114;
	// ============================================================================
	// 1. THIN LIGHT BASE PLATE WITH TILE LINES AND OUTLINE
	// ============================================================================
	const GX0 = -36;
	const GX1 = BLDG_X1 + 32;
	const GY0 = FRONT_Y0 - 46;
	const GY1 = GND_Y1 + 26;
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
	// Subtle sidewalk tile lines on the base plate
	drawLine(iso(BLDG_X0, GY0, .2), iso(BLDG_X0, GY1, .2), "#CBD5E1", 1.2);
	drawLine(iso(GX0, FRONT_Y0, .2), iso(GX1, FRONT_Y0, .2), "#CBD5E1", 1.2);
	for (let tx = GX0 + 32; tx < GX1; tx += 32) {
		drawLine(iso(tx, FRONT_Y0, .2), iso(tx, GY0, .2), "#E2E8F0", 1);
	}
	for (let ty = GY0 + 32; ty < GY1; ty += 32) {
		drawLine(iso(GX0, ty, .2), iso(BLDG_X0, ty, .2), "#E2E8F0", 1);
	}
	if (showGuides) {
		for (let gx = GX0; gx <= GX1; gx += 30) {
			drawLine(iso(gx, GY0, 0), iso(gx, GY1, 0), "rgba(37, 99, 235, 0.14)", 1, [3, 3]);
		}
		for (let gy = GY0; gy <= GY1; gy += 30) {
			drawLine(iso(GX0, gy, 0), iso(GX1, gy, 0), "rgba(37, 99, 235, 0.14)", 1, [3, 3]);
		}
	}
	// ============================================================================
	// 2. GROUND FLOOR INTERIOR — "THE MESS" (z = 0..FL1_H, y = FRONT_Y0..GND_Y1)
	// ============================================================================
	// Ground-Floor Back-Left Wall (y = GND_Y1, x = BLDG_X0..BLDG_X1, z = 0..FL1_H)
	drawPoly([
		iso(BLDG_X0, GND_Y1, 0),
		iso(BLDG_X1, GND_Y1, 0),
		iso(BLDG_X1, GND_Y1, FL1_H),
		iso(BLDG_X0, GND_Y1, FL1_H)
	], CUSTOM_SOFTWARE_PALETTE.warmInteriorWall, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.5);
	// Ground-Floor Back-Right Wall (x = BLDG_X1, y = FRONT_Y0..GND_Y1, z = 0..FL1_H)
	drawPoly([
		iso(BLDG_X1, FRONT_Y0, 0),
		iso(BLDG_X1, GND_Y1, 0),
		iso(BLDG_X1, GND_Y1, FL1_H),
		iso(BLDG_X1, FRONT_Y0, FL1_H)
	], "#FCD34D", CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.5);
	// Ground-Floor Warm Yellow Floor (x = BLDG_X0..BLDG_X1, y = FRONT_Y0..GND_Y1)
	drawPoly([
		iso(BLDG_X0, FRONT_Y0, 1),
		iso(BLDG_X1, FRONT_Y0, 1),
		iso(BLDG_X1, GND_Y1, 1),
		iso(BLDG_X0, GND_Y1, 1)
	], CUSTOM_SOFTWARE_PALETTE.warmInteriorFloor, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.4);
	// Warm light spill on the sidewalk outside the front-right facade
	drawPoly([
		iso(BLDG_X0 + 8, FRONT_Y0, .3),
		iso(BLDG_X1 - 8, FRONT_Y0, .3),
		iso(BLDG_X1 - 4, FRONT_Y0 - 24, .3),
		iso(BLDG_X0 + 4, FRONT_Y0 - 24, .3)
	], "rgba(254, 240, 138, 0.45)", "none");
	// Permanent scattered spreadsheet sheets on the ground floor
	drawSpreadsheetSheet(30, 22, 1.4, 10, 8, "white");
	drawSpreadsheetSheet(46, 118, 1.4, 9, 7, "cream");
	drawSpreadsheetSheet(74, 128, 1.4, 10, 8, "blue");
	drawSpreadsheetSheet(28, 86, 1.4, 9, 7, "white");
	// Extra scattered spreadsheet sheets on the floor that disappear once loaded into the lift!
	if (ch.extraFloorSheetsScale > .08) {
		const es = ch.extraFloorSheetsScale;
		drawSpreadsheetSheet(58, 48, 1.4, 10 * es, 8 * es, "white");
		drawSpreadsheetSheet(72, 62, 1.4, 9 * es, 7 * es, "cream");
		drawSpreadsheetSheet(42, 68, 1.4, 10 * es, 7.5 * es, "blue");
		drawSpreadsheetSheet(88, 40, 1.4, 9.5 * es, 7.5 * es, "white");
	}
	// Messy Desk 1 (Rear-left of ground floor: x = 44..72, y = 96..134) covered with paper stacks, open folders & notebook
	drawPrism(44, 96, 2, 24, 36, 14, {
		top: "#FEF3C7",
		right: CUSTOM_SOFTWARE_PALETTE.lightWoodDark,
		left: CUSTOM_SOFTWARE_PALETTE.lightWood,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	// Open orange folder & paper stacks on Messy Desk 1
	drawPoly([
		iso(47, 100, 16.3),
		iso(59, 100, 16.3),
		iso(59, 111, 16.3),
		iso(47, 111, 16.3)
	], CUSTOM_SOFTWARE_PALETTE.orangeAccent, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.05);
	drawSpreadsheetSheet(48, 101, 16.6, 9, 8, "white");
	drawPaperStack(52, 115, 16.2, 11, 9, 6);
	drawPaperStack(46, 124, 16.2, 9, 7, 4);
	// Messy Desk 2 (Front-center of ground floor: x = 42..68, y = 8..44) with loose spreadsheets, blue notebook & stacks
	drawPrism(42, 8, 2, 24, 36, 14, {
		top: "#FEF3C7",
		right: CUSTOM_SOFTWARE_PALETTE.lightWoodDark,
		left: CUSTOM_SOFTWARE_PALETTE.lightWood,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	drawPaperStack(46, 12, 16.2, 11, 9, 5.5);
	drawPoly([
		iso(48, 25, 16.3),
		iso(61, 25, 16.3),
		iso(61, 36, 16.3),
		iso(48, 36, 16.3)
	], CUSTOM_SOFTWARE_PALETTE.royalBright, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.05);
	drawSpreadsheetSheet(50, 26, 16.6, 9, 7, "cream");
	// Tiny Ground-Floor Worker 1: Scratching his head among the messy papers
	drawCharacter({
		x: 78,
		y: 24,
		z: 2,
		scaleFactor: .96,
		role: "mess-head-scratcher",
		actionPhase: ch.headScratchPhase,
		stride: 0
	});
	// Tiny Ground-Floor Worker 2: Carrying a pile of loose spreadsheet sheets toward the corner freight lift
	const carrierX = 82 + ch.carrierWalkProgress * 20;
	const carrierY = 66 + ch.carrierWalkProgress * 10;
	drawCharacter({
		x: carrierX,
		y: carrierY,
		z: 2,
		scaleFactor: .96,
		role: "mess-sheet-carrier",
		stride: ch.carrierStride,
		holdingSheets: ch.carrierHasSheets
	});
	// ============================================================================
	// 3. SMALL FREIGHT LIFT IN THE BACK CORNER (x = 114..142, y = 66..92)
	//    Spans vertically from Ground Floor (z = 2) to Upper Floor (z = 60..108)
	// ============================================================================
	const LIFT_X0 = 114;
	const LIFT_X1 = 142;
	const LIFT_Y0 = 66;
	const LIFT_Y1 = 92;
	// Back wall of freight lift shaft
	drawPoly([
		iso(LIFT_X0, LIFT_Y1, 2),
		iso(LIFT_X1, LIFT_Y1, 2),
		iso(LIFT_X1, LIFT_Y1, FL2_H - 4),
		iso(LIFT_X0, LIFT_Y1, FL2_H - 4)
	], "#E2E8F0", CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.3);
	drawPoly([
		iso(LIFT_X1, LIFT_Y0, 2),
		iso(LIFT_X1, LIFT_Y1, 2),
		iso(LIFT_X1, LIFT_Y1, FL2_H - 4),
		iso(LIFT_X1, LIFT_Y0, FL2_H - 4)
	], "#CBD5E1", CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.3);
	// Rear guide rails of the freight lift
	drawLine(iso(LIFT_X0 + 2, LIFT_Y1 - 1, 2), iso(LIFT_X0 + 2, LIFT_Y1 - 1, FL2_H - 4), CUSTOM_SOFTWARE_PALETTE.navyBand, 2);
	drawLine(iso(LIFT_X1 - 2, LIFT_Y0 + 2, 2), iso(LIFT_X1 - 2, LIFT_Y0 + 2, FL2_H - 4), CUSTOM_SOFTWARE_PALETTE.navyBand, 2);
	// Moving Freight Lift Platform (rises from z = 4 on ground floor to z = FL1_H + 3 = 61 on upper floor)
	const liftPlatZ = 4 + ch.liftRiseProgress * (FL1_H - 1);
	drawPrism(LIFT_X0 + 2, LIFT_Y0 + 2, liftPlatZ, LIFT_X1 - LIFT_X0 - 4, LIFT_Y1 - LIFT_Y0 - 4, 3.5, {
		top: CUSTOM_SOFTWARE_PALETTE.royalBright,
		right: CUSTOM_SOFTWARE_PALETTE.navyBand,
		left: CUSTOM_SOFTWARE_PALETTE.navyDeep,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.35
	});
	// Pile of loose spreadsheet sheets riding inside the freight lift
	if (ch.sheetsInLiftScale > .05) {
		const sc = ch.sheetsInLiftScale;
		drawPaperStack(LIFT_X0 + 7, LIFT_Y0 + 6, liftPlatZ + 3.6, 13 * sc, 11 * sc, 6.5 * sc);
	}
	// Front-left vertical steel post of the freight lift shaft
	drawLine(iso(LIFT_X0, LIFT_Y0, 2), iso(LIFT_X0, LIFT_Y0, FL2_H - 4), CUSTOM_SOFTWARE_PALETTE.strokeNavy, 2.1);
	// ============================================================================
	// 4. STEPPED TERRACE ON THE LEFT (y = UPPER_Y1..GND_Y1, z = FL1_H)
	//    & SECOND-FLOOR SLAB + UPPER FLOOR INTERIOR ("THE ORDER", y = FRONT_Y0..UPPER_Y1)
	// ============================================================================
	// Stepped Terrace Floor Slab (x = BLDG_X0..BLDG_X1, y = UPPER_Y1..GND_Y1, z = FL1_H - 3..FL1_H + 1)
	drawPrism(BLDG_X0 - 1, UPPER_Y1, FL1_H - 3, BLDG_X1 - BLDG_X0 + 1, GND_Y1 - UPPER_Y1, 4, {
		top: CUSTOM_SOFTWARE_PALETTE.creamStucco,
		right: CUSTOM_SOFTWARE_PALETTE.creamStuccoShade,
		left: CUSTOM_SOFTWARE_PALETTE.creamStucco,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.5
	});
	// Terrace tile surface & navy perimeter trim band
	drawPoly([
		iso(BLDG_X0 + 4, UPPER_Y1 + 4, FL1_H + 1.2),
		iso(BLDG_X1 - 4, UPPER_Y1 + 4, FL1_H + 1.2),
		iso(BLDG_X1 - 4, GND_Y1 - 4, FL1_H + 1.2),
		iso(BLDG_X0 + 4, GND_Y1 - 4, FL1_H + 1.2)
	], CUSTOM_SOFTWARE_PALETTE.creamStuccoShade, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.2);
	// Navy band along the stepped terrace parapet edge (x = BLDG_X0 - 1, y = UPPER_Y1..GND_Y1, z = FL1_H - 3..FL1_H + 5)
	drawPrism(BLDG_X0 - 1, UPPER_Y1, FL1_H + 1, 5, GND_Y1 - UPPER_Y1, 5.5, {
		top: CUSTOM_SOFTWARE_PALETTE.royalBright,
		right: CUSTOM_SOFTWARE_PALETTE.navyBand,
		left: CUSTOM_SOFTWARE_PALETTE.navyBand,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	drawPrism(BLDG_X0 - 1, GND_Y1 - 5, FL1_H + 1, BLDG_X1 - BLDG_X0 + 1, 5, 5.5, {
		top: CUSTOM_SOFTWARE_PALETTE.royalBright,
		right: CUSTOM_SOFTWARE_PALETTE.navyBand,
		left: CUSTOM_SOFTWARE_PALETTE.navyBand,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Potted Plant on the Stepped Upper Terrace (clearly visible on the left terrace!)
	drawPottedPlant(BLDG_X0 + 28, UPPER_Y1 + 26, FL1_H + 1.5, plantSway, .92);
	// Upper-Floor Back-Left Wall (separating the upper office from the stepped terrace at y = UPPER_Y1, z = FL1_H..FL2_H)
	drawPoly([
		iso(BLDG_X0, UPPER_Y1, FL1_H),
		iso(BLDG_X1, UPPER_Y1, FL1_H),
		iso(BLDG_X1, UPPER_Y1, FL2_H),
		iso(BLDG_X0, UPPER_Y1, FL2_H)
	], CUSTOM_SOFTWARE_PALETTE.warmInteriorWall, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.55);
	// Upper-Floor Back-Right Wall (x = BLDG_X1, y = FRONT_Y0..UPPER_Y1, z = FL1_H..FL2_H)
	drawPoly([
		iso(BLDG_X1, FRONT_Y0, FL1_H),
		iso(BLDG_X1, UPPER_Y1, FL1_H),
		iso(BLDG_X1, UPPER_Y1, FL2_H),
		iso(BLDG_X1, FRONT_Y0, FL2_H)
	], "#FCD34D", CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.55);
	// Upper-Floor Slab & Warm Floor Surface (x = BLDG_X0..BLDG_X1, y = FRONT_Y0..UPPER_Y1, z = FL1_H - 3..FL1_H + 1)
	// Leaves a cutaway opening around the freight lift shaft (x = LIFT_X0..LIFT_X1, y = LIFT_Y0..LIFT_Y1)
	drawPrism(BLDG_X0 - 1, FRONT_Y0, FL1_H - 3, BLDG_X1 - BLDG_X0 + 1, UPPER_Y1 - FRONT_Y0, 4, {
		top: CUSTOM_SOFTWARE_PALETTE.warmInteriorFloor,
		right: CUSTOM_SOFTWARE_PALETTE.creamStuccoShade,
		left: CUSTOM_SOFTWARE_PALETTE.creamStucco,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.5
	});
	// Re-draw freight lift shaft opening on the upper floor so the rising platform is visible
	drawPoly([
		iso(LIFT_X0, LIFT_Y0, FL1_H + 1.1),
		iso(LIFT_X1, LIFT_Y0, FL1_H + 1.1),
		iso(LIFT_X1, LIFT_Y1, FL1_H + 1.1),
		iso(LIFT_X0, LIFT_Y1, FL1_H + 1.1)
	], "#0F1E4D", CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.35);
	if (liftPlatZ >= FL1_H - 6) {
		drawPrism(LIFT_X0 + 2, LIFT_Y0 + 2, liftPlatZ, LIFT_X1 - LIFT_X0 - 4, LIFT_Y1 - LIFT_Y0 - 4, 3.5, {
			top: CUSTOM_SOFTWARE_PALETTE.royalBright,
			right: CUSTOM_SOFTWARE_PALETTE.navyBand,
			left: CUSTOM_SOFTWARE_PALETTE.navyDeep,
			stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
			lineWidth: 1.35
		});
		if (ch.sheetsInLiftScale > .05) {
			const sc = ch.sheetsInLiftScale;
			drawPaperStack(LIFT_X0 + 7, LIFT_Y0 + 6, liftPlatZ + 3.6, 13 * sc, 11 * sc, 6.5 * sc);
		}
	}
	// ============================================================================
	// 5. UPPER FLOOR OBJECTS — "THE ORDER" (z = FL1_H + 1..FL2_H)
	//    Neat wooden filing cabinets with colored tabs, tidy shelves with matching
	//    binders, a tiny worker filing a sheet into a drawer, and a tiny owner in
	//    an apron smiling at a wall screen showing the clean app interface.
	// ============================================================================
	const U_Z = FL1_H + 1.2;
	// Neat Wooden Filing Cabinets with Colored Tabs along the Upper-Floor Back-Left Wall (y = UPPER_Y1 - 16)
	const drawFilingCabinet = (cx: number, cy: number, cz: number, openDrawerRatio = 0) => {
		const cw = 18;
		const cd = 14;
		const chCab = 32;
		drawPrism(cx, cy, cz, cw, cd, chCab, {
			top: "#FEF3C7",
			right: CUSTOM_SOFTWARE_PALETTE.lightWoodDark,
			left: CUSTOM_SOFTWARE_PALETTE.lightWood,
			stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		// 3 drawer fronts facing -y (front-right)
		const tabColors = [
			CUSTOM_SOFTWARE_PALETTE.orangeAccent,
			CUSTOM_SOFTWARE_PALETTE.royalBright,
			CUSTOM_SOFTWARE_PALETTE.plantGreenMid
		];
		for (let d = 0; d < 3; d++) {
			const dz0 = cz + 3 + d * 9.2;
			const isMiddleActive = d === 1 && openDrawerRatio > .03;
			const pullY = isMiddleActive ? openDrawerRatio * 8.5 : 0;
			if (isMiddleActive) {
				// Pulled-out drawer box
				drawPrism(cx + 1.5, cy - pullY, dz0, cw - 3, pullY + 2, 7.2, {
					top: "#FFFFFF",
					right: CUSTOM_SOFTWARE_PALETTE.lightWoodMid,
					left: CUSTOM_SOFTWARE_PALETTE.lightWood,
					stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
					lineWidth: 1.2
				});
			} else {
				drawPoly([
					iso(cx + 1.5, cy - .15, dz0),
					iso(cx + cw - 1.5, cy - .15, dz0),
					iso(cx + cw - 1.5, cy - .15, dz0 + 7.2),
					iso(cx + 1.5, cy - .15, dz0 + 7.2)
				], CUSTOM_SOFTWARE_PALETTE.lightWoodMid, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.1);
			}
			// Colored tab on top edge of each filing drawer (no text)
			const tabX0 = cx + 3.5 + d * 3.8;
			drawPoly([
				iso(tabX0, cy - pullY - .2, dz0 + 5.2),
				iso(tabX0 + 4.2, cy - pullY - .2, dz0 + 5.2),
				iso(tabX0 + 4.2, cy - pullY - .2, dz0 + 7.8),
				iso(tabX0, cy - pullY - .2, dz0 + 7.8)
			], tabColors[d], CUSTOM_SOFTWARE_PALETTE.strokeNavy, .95);
		}
	};
	drawFilingCabinet(46, UPPER_Y1 - 15, U_Z, 0);
	drawFilingCabinet(68, UPPER_Y1 - 15, U_Z, ch.drawerOpenRatio);
	// Tidy Shelves with Matching Binders along the Upper-Floor Back-Right Wall (x = BLDG_X1 - 15, y = 4..48)
	const shX = BLDG_X1 - 15;
	const shY = 4;
	const shW = 13;
	const shD = 42;
	const shH = 38;
	drawPrism(shX, shY, U_Z, shW, shD, shH, {
		top: "#FEF3C7",
		right: CUSTOM_SOFTWARE_PALETTE.lightWoodDark,
		left: CUSTOM_SOFTWARE_PALETTE.lightWood,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	for (let lv = 0; lv < 2; lv++) {
		const bz = U_Z + 4 + lv * 17;
		for (let bi = 0; bi < 5; bi++) {
			const by = shY + 3 + bi * 7.2;
			const bCol = bi % 3 === 0 ? CUSTOM_SOFTWARE_PALETTE.royalBright : bi % 3 === 1 ? CUSTOM_SOFTWARE_PALETTE.orangeAccent : CUSTOM_SOFTWARE_PALETTE.plantGreenMid;
			drawPrism(shX + 1.5, by, bz, 9.5, 5.2, 12.5, {
				top: "#FFFFFF",
				right: CUSTOM_SOFTWARE_PALETTE.navyBand,
				left: bCol,
				stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
				lineWidth: 1
			});
		}
	}
	// Wall Screen on the Upper-Floor Interior Wall (x = 92..130, y = UPPER_Y1 - 1.5, z = U_Z + 14..U_Z + 44)
	// Showing the clean App Interface (form, table grid, three growing bar charts, small orange button)
	const wsX0 = 90;
	const wsW = 36;
	const wsY = UPPER_Y1 - 2.5;
	const wsZ0 = U_Z + 14;
	const wsH = 28;
	drawPrism(wsX0, wsY, wsZ0, wsW, 2.2, wsH, {
		top: CUSTOM_SOFTWARE_PALETTE.royalBright,
		right: CUSTOM_SOFTWARE_PALETTE.navyBand,
		left: CUSTOM_SOFTWARE_PALETTE.navyDeep,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	drawAppInterfaceOnYScreen(wsX0 + 2, wsX0 + wsW - 2, wsY - .15, wsZ0 + 2, wsZ0 + wsH - 2, false);
	// Tiny Upper-Floor Worker Filing a Sheet into the Open Cabinet Drawer
	drawCharacter({
		x: 74,
		y: UPPER_Y1 - 30,
		z: U_Z,
		scaleFactor: .95,
		role: "upper-cabinet-filer",
		actionPhase: ch.upperWorkerFileArm,
		stride: 0
	});
	// Tiny Owner in an Apron Smiling at the Wall Screen on the Upper Floor
	drawCharacter({
		x: 102,
		y: 36,
		z: U_Z + ch.ownerSmileBounce,
		scaleFactor: .98,
		role: "upper-apron-owner",
		stride: 0
	});
	// ============================================================================
	// 6. FRONT-RIGHT EXTERIOR FACADE (y = FRONT_Y0, x = BLDG_X0..BLDG_X1, z = 0..FL2_H)
	//    Cream stucco walls with a navy band under the roof line, round porthole-style
	//    windows lit warm yellow, and a wooden door with a navy awning.
	// ============================================================================
	// Low Cutaway Sill along the Front-Left Edge (x = BLDG_X0 - 1..BLDG_X0 + 4, y = FRONT_Y0..GND_Y1, z = 0..10)
	drawPrism(BLDG_X0 - 1, FRONT_Y0, 0, 5, GND_Y1 - FRONT_Y0, 10, {
		top: CUSTOM_SOFTWARE_PALETTE.creamStucco,
		right: CUSTOM_SOFTWARE_PALETTE.creamStuccoShade,
		left: CUSTOM_SOFTWARE_PALETTE.creamStucco,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Front-Left Corner Pillar rising full two-floor height at y = UPPER_Y1 (marking the stepped corner)
	drawPrism(BLDG_X0 - 1, UPPER_Y1 - 2, 0, 5, 4, FL2_H, {
		top: CUSTOM_SOFTWARE_PALETTE.navyBand,
		right: CUSTOM_SOFTWARE_PALETTE.creamStuccoShade,
		left: CUSTOM_SOFTWARE_PALETTE.creamStucco,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.5
	});
	// Main Cream Stucco Front-Right Facade Wall (x = BLDG_X0 - 1..BLDG_X1, y = FRONT_Y0, z = 0..FL2_H)
	drawPoly([
		iso(BLDG_X0 - 1, FRONT_Y0, 0),
		iso(BLDG_X1, FRONT_Y0, 0),
		iso(BLDG_X1, FRONT_Y0, FL2_H),
		iso(BLDG_X0 - 1, FRONT_Y0, FL2_H)
	], CUSTOM_SOFTWARE_PALETTE.creamStucco, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.6);
	// Horizontal Navy Band under the Roof Line (z = FL2_H - 11..FL2_H)
	drawPoly([
		iso(BLDG_X0 - 1, FRONT_Y0 - .2, FL2_H - 11),
		iso(BLDG_X1, FRONT_Y0 - .2, FL2_H - 11),
		iso(BLDG_X1, FRONT_Y0 - .2, FL2_H),
		iso(BLDG_X0 - 1, FRONT_Y0 - .2, FL2_H)
	], CUSTOM_SOFTWARE_PALETTE.navyBand, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.5);
	// Subtle middle floor-line trim on the cream stucco facade (z = FL1_H - 2..FL1_H + 1)
	drawPoly([
		iso(BLDG_X0 - 1, FRONT_Y0 - .15, FL1_H - 2),
		iso(BLDG_X1, FRONT_Y0 - .15, FL1_H - 2),
		iso(BLDG_X1, FRONT_Y0 - .15, FL1_H + 1),
		iso(BLDG_X0 - 1, FRONT_Y0 - .15, FL1_H + 1)
	], CUSTOM_SOFTWARE_PALETTE.creamStuccoShade, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.2);
	// Round Porthole-Style Windows Lit Warm Yellow on Upper Floor & Ground Floor
	drawPortholeWindowOnY(42, FRONT_Y0 - .3, 82, 11);
	drawPortholeWindowOnY(84, FRONT_Y0 - .3, 82, 11);
	drawPortholeWindowOnY(124, FRONT_Y0 - .3, 82, 11);
	// Ground-floor porthole windows on either side of the wooden door
	drawPortholeWindowOnY(38, FRONT_Y0 - .3, 30, 10.5);
	drawPortholeWindowOnY(126, FRONT_Y0 - .3, 30, 10.5);
	// Wooden Door on the Ground Floor (x = 68..98, z = 0..48)
	const DOOR_X0 = 68;
	const DOOR_X1 = 98;
	const DOOR_Z1 = 48;
	drawPrism(DOOR_X0 - 2, FRONT_Y0 - 1.8, 0, DOOR_X1 - DOOR_X0 + 4, 1.8, DOOR_Z1 + 2, {
		top: CUSTOM_SOFTWARE_PALETTE.lightWood,
		right: CUSTOM_SOFTWARE_PALETTE.warmWoodDoorDark,
		left: CUSTOM_SOFTWARE_PALETTE.warmWoodDoor,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	drawPoly([
		iso(DOOR_X0, FRONT_Y0 - 1.9, 0),
		iso(DOOR_X1, FRONT_Y0 - 1.9, 0),
		iso(DOOR_X1, FRONT_Y0 - 1.9, DOOR_Z1),
		iso(DOOR_X0, FRONT_Y0 - 1.9, DOOR_Z1)
	], CUSTOM_SOFTWARE_PALETTE.warmWoodDoor, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.45);
	// Round porthole glass light inside the wooden door
	drawPortholeWindowOnY((DOOR_X0 + DOOR_X1) / 2, FRONT_Y0 - 2, 31, 6.5);
	// Navy Awning over the Wooden Door (x = 60..106)
	const AWN_X0 = 60;
	const AWN_X1 = 106;
	const AWN_Z_WALL = 54;
	const AWN_Z_FRONT = 41;
	const AWN_Y_FRONT = FRONT_Y0 - 16;
	const AWN_STRIPES = 4;
	const awnStripeW = (AWN_X1 - AWN_X0) / AWN_STRIPES;
	drawPoly([
		iso(AWN_X0, FRONT_Y0 - 1.2, AWN_Z_WALL),
		iso(AWN_X0, AWN_Y_FRONT, AWN_Z_FRONT),
		iso(AWN_X0, FRONT_Y0 - 1.2, AWN_Z_FRONT)
	], CUSTOM_SOFTWARE_PALETTE.navyAwningDark, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.35);
	for (let s = 0; s < AWN_STRIPES; s++) {
		const sx0 = AWN_X0 + s * awnStripeW;
		const sx1 = sx0 + awnStripeW;
		const isDarkNavy = s % 2 === 0;
		const slopeFill = isDarkNavy ? CUSTOM_SOFTWARE_PALETTE.navyAwning : CUSTOM_SOFTWARE_PALETTE.royalBright;
		const valFill = isDarkNavy ? CUSTOM_SOFTWARE_PALETTE.navyAwningDark : CUSTOM_SOFTWARE_PALETTE.royalFacade;
		drawPoly([
			iso(sx0, FRONT_Y0 - 1.2, AWN_Z_WALL),
			iso(sx1, FRONT_Y0 - 1.2, AWN_Z_WALL),
			iso(sx1, AWN_Y_FRONT, AWN_Z_FRONT),
			iso(sx0, AWN_Y_FRONT, AWN_Z_FRONT)
		], slopeFill, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.35);
		drawPoly([
			iso(sx0, AWN_Y_FRONT, AWN_Z_FRONT),
			iso(sx1, AWN_Y_FRONT, AWN_Z_FRONT),
			iso(sx1, AWN_Y_FRONT, AWN_Z_FRONT - 4.5),
			iso(sx0, AWN_Y_FRONT, AWN_Z_FRONT - 4.5)
		], valFill, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.25);
	}
	// ============================================================================
	// 7. OUTSIDE AT THE DOOR: TWO SMALL POTTED PLANTS & TINY OWNER HOLDING TABLET
	// ============================================================================
	drawPottedPlant(52, FRONT_Y0 - 11, 0, plantSway, .86);
	drawPottedPlant(114, FRONT_Y0 - 11, 0, -plantSway, .86);
	// Tiny Owner at the Door Holding a Tablet Showing the Same App Interface
	drawCharacter({
		x: 82 + ch.outdoorOwnerTilt,
		y: FRONT_Y0 - 27,
		z: 0,
		scaleFactor: 1,
		role: "outdoor-tablet-owner",
		stride: 0
	});
	// ============================================================================
	// 8. UPPER ROOF WITH LARGE DESKTOP MONITOR ON PEDESTAL & TINY DEVELOPER
	//    SITTING BESIDE IT WITH A LAPTOP TWEAKING THE SCREEN
	// ============================================================================
	const ROOF_X0 = BLDG_X0 + 38;
	drawPrism(ROOF_X0, FRONT_Y0 - 1, FL2_H - 3, BLDG_X1 - ROOF_X0 + 2, UPPER_Y1 - FRONT_Y0 + 2, 6, {
		top: CUSTOM_SOFTWARE_PALETTE.creamStucco,
		right: CUSTOM_SOFTWARE_PALETTE.navyBand,
		left: CUSTOM_SOFTWARE_PALETTE.navyBand,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.55
	});
	// Recessed inner roof surface
	const ROOF_TOP_Z = FL2_H + 3.2;
	drawPoly([
		iso(ROOF_X0 + 5, FRONT_Y0 + 4, ROOF_TOP_Z),
		iso(BLDG_X1 - 5, FRONT_Y0 + 4, ROOF_TOP_Z),
		iso(BLDG_X1 - 5, UPPER_Y1 - 5, ROOF_TOP_Z),
		iso(ROOF_X0 + 5, UPPER_Y1 - 5, ROOF_TOP_Z)
	], CUSTOM_SOFTWARE_PALETTE.creamStuccoShade, CUSTOM_SOFTWARE_PALETTE.strokeNavy, 1.2);
	// Small Pedestal on the Roof under the Large Desktop Monitor
	const PED_X = ROOF_X0 + 12;
	const PED_Y = FRONT_Y0 + 22;
	const PED_W = 54;
	const PED_D = 32;
	drawPrism(PED_X, PED_Y, ROOF_TOP_Z, PED_W, PED_D, 7, {
		top: "#FFFFFF",
		right: CUSTOM_SOFTWARE_PALETTE.creamStuccoShade,
		left: CUSTOM_SOFTWARE_PALETTE.creamStucco,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	// Monitor Stand Neck & Base Plate on top of the Pedestal
	const STAND_Z = ROOF_TOP_Z + 7;
	drawPrism(PED_X + 18, PED_Y + 9, STAND_Z, 18, 14, 3, {
		top: "#E2E8F0",
		right: CUSTOM_SOFTWARE_PALETTE.navyBand,
		left: "#CBD5E1",
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	drawPrism(PED_X + 23, PED_Y + 12, STAND_Z + 3, 8, 8, 7, {
		top: CUSTOM_SOFTWARE_PALETTE.royalBright,
		right: CUSTOM_SOFTWARE_PALETTE.navyBand,
		left: CUSTOM_SOFTWARE_PALETTE.navyDeep,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	// LARGE DESKTOP MONITOR STANDING ON THE PEDESTAL (Screen facing the viewer)
	const MON_X0 = PED_X - 4;
	const MON_W = 62;
	const MON_Y = PED_Y + 10;
	const MON_Z0 = STAND_Z + 9;
	const MON_H = 48;
	const MON_Z1 = MON_Z0 + MON_H;
	drawPrism(MON_X0, MON_Y, MON_Z0, MON_W, 5.5, MON_H, {
		top: CUSTOM_SOFTWARE_PALETTE.royalBright,
		right: CUSTOM_SOFTWARE_PALETTE.navyBand,
		left: CUSTOM_SOFTWARE_PALETTE.navyDeep,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.65
	});
	// Render the synchronized Clean App Interface (form, table grid, 3 growing bar charts, small orange button)
	drawAppInterfaceOnYScreen(MON_X0 + 4, MON_X0 + MON_W - 4, MON_Y - .25, MON_Z0 + 4, MON_Z1 - 4, false);
	// Tiny Developer Sitting Beside the Monitor on the Roof with a Laptop, Tweaking the Screen & Nodding
	const devX = MON_X0 + MON_W + 11;
	const devY = MON_Y + 6;
	drawCharacter({
		x: devX,
		y: devY,
		z: ROOF_TOP_Z,
		scaleFactor: .94,
		role: "roof-developer-seated",
		actionPhase: ch.devTypingPhase,
		headNodZ: ch.devNodZ
	});
	// Developer's Small Laptop resting in front of their seated legs on the roof
	const dLapX = devX - 5.5;
	const dLapY = devY - 13.5;
	const dLapZ = ROOF_TOP_Z + 4.5;
	drawPrism(dLapX, dLapY, dLapZ, 10, 9, 1.5, {
		top: "#FFFFFF",
		right: "#CBD5E1",
		left: "#E2E8F0",
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.15
	});
	drawPrism(dLapX, dLapY - 1.5, dLapZ + 1.5, 10, 1.8, 7.5, {
		top: CUSTOM_SOFTWARE_PALETTE.royalBright,
		right: CUSTOM_SOFTWARE_PALETTE.navyBand,
		left: CUSTOM_SOFTWARE_PALETTE.navyDeep,
		stroke: CUSTOM_SOFTWARE_PALETTE.strokeNavy,
		lineWidth: 1.2
	});
	ctx.restore();
};
