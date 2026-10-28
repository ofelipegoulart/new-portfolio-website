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
  wrenchAngle?: number;
  holdingBox?: boolean;
  boxLiftZ?: number;
  boxPushX?: number;
};

export interface LojaVirtualHeroProps {
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
 * Componente Next.js leve e SEO-friendly: Loja Virtual e Entregas (~16 KB, 0 requisições externas)
 */
export default function LojaVirtualHero({
  backgroundColor = '#f3f0e8',
  alt = 'Ilustração isométrica em corte lateral de uma loja virtual com dois prédios lado a lado na mesma linha de piso, unidos apenas por uma parede vertical compartilhada: à direita, a loja mais alta em estuque terracota com faixa de tijolos na base, toldo listrado laranja e branco, prateleiras de produtos, lojista de avental digitando no notebook do balcão e, no telhado plano próprio, um grande notebook aberto sobre pedestal com grade de produtos e botão laranja ajustado por um trabalhador com chave inglesa; à esquerda, o galpão mais baixo em estuque creme com telhado próprio mais baixo e placa solar visível, funcionário de colete azul lacrando encomenda, esteira curta passando por uma abertura na parede compartilhada e entregador carregando caixa na van azul-marinho com faixa laranja, enquanto o cliente aguarda na porta com smartphone.',
  speed = 1,
  zoom = 1,
  className = 'w-full max-w-[640px] aspect-square mx-auto',
}: LojaVirtualHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let isVisible = true;
    let animTime = 1.65; // Renderiza o quadro com loja virtual acesa, caixa na esteira e van no primeiro paint (LCP imediato)
    let lastTs: number | null = null;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    drawOnlineStoreScene(ctx, canvas.width, canvas.height, animTime, false, backgroundColor);

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
        drawOnlineStoreScene(ctx, canvas.width, canvas.height, animTime, false, backgroundColor);
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

const ONLINE_STORE_LOOP_DURATION = 4;
const ONLINE_STORE_PALETTE = {
  "canvasCreamBg": "#f3f0e8",
  "strokeNavy": "#15275E",
  "navyDeep": "#0F1E4D",
  "navyRoof": "#162B6F",
  "navyVan": "#162B6F",
  "navyVanDark": "#0F1E4D",
  "royalFacade": "#1E40AF",
  "royalBright": "#235AE4",
  "terracottaBrick": "#D96B43",
  "terracottaBrickDark": "#B8532E",
  "terracottaStucco": "#E07A52",
  "terracottaStuccoShade": "#C6623B",
  "creamStucco": "#F7F2E7",
  "creamStuccoShade": "#E8DFCE",
  "warmInteriorWall": "#FDE68A",
  "warmInteriorFloor": "#FDE047",
  "warmYellowGlow": "#FEF08A",
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
  "potTerracottaDark": "#9A3412",
  "cardboardTop": "#F3C892",
  "cardboardLeft": "#DFAC71",
  "cardboardRight": "#C48D52"
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

function computeOnlineStoreChoreography(tSec: number) {
  const resetFade = tSec >= 3.48 ? 1 - easeInOutCubic((tSec - 3.48) / 0.52) : 1;

  const ownerTypingPhase = Math.sin((tSec / ONLINE_STORE_LOOP_DURATION) * Math.PI * 10);
  const wrenchTurnAngle =
    tSec >= 0.15 && tSec <= 2.65 ? Math.sin((tSec - 0.15) * Math.PI * 5) * 0.75 : 0;

  const gridBlocksLit = easeOutCubic((tSec - 0.15) / 0.55) * resetFade;
  const orangeButtonPop = easeOutBackPop((tSec - 0.55) / 0.28) * resetFade;

  const conveyorMoveProgress =
    tSec <= 0.20 ? 0.0 : tSec < 2.40 ? easeInOutCubic((tSec - 0.20) / 2.20) : 1.0;
  const conveyorBoxScale =
    tSec < 0.12
      ? 0.0
      : tSec < 0.36
      ? easeOutBackPop((tSec - 0.12) / 0.24)
      : tSec < 2.40
      ? 1.0
      : 0.0;

  const workerTapeArm =
    tSec >= 0.90 && tSec <= 2.30
      ? Math.sin(((tSec - 0.90) / 1.40) * Math.PI * 4) * 0.65
      : 0;
  const boxTapeRatio = clamp01((tSec - 0.85) / 1.10) * resetFade;

  const loaderWalkProgress =
    tSec >= 1.50 && tSec < 2.55
      ? easeInOutCubic((tSec - 1.50) / 1.05)
      : tSec >= 2.55 && tSec < 3.40
      ? 1 - easeInOutCubic((tSec - 2.55) / 0.85)
      : 0;
  const loaderHasBox = tSec < 2.52 || tSec > 3.42;
  const loaderStride =
    tSec >= 1.50 && tSec < 3.35 ? Math.sin((tSec - 1.50) * Math.PI * 6) * 0.8 : 0;

  const customerPhoneGlow = easeOutCubic((tSec - 0.35) / 0.50) * resetFade;
  const customerShiftX = Math.sin((tSec / ONLINE_STORE_LOOP_DURATION) * Math.PI * 2) * 1.5;
  const customerShiftY = Math.cos((tSec / ONLINE_STORE_LOOP_DURATION) * Math.PI * 2) * 0.8;
  const customerHopZ = Math.max(0, Math.sin((tSec - 0.4) * Math.PI * 3)) * 1.2;
  const customerWavePhase = Math.sin((tSec - 0.5) * Math.PI * 4) * 0.5;
  const customerStride = Math.sin((tSec - 0.4) * Math.PI * 4) * 0.35;
  const vanBounceZ = Math.max(0, Math.sin((tSec - 1.4) * Math.PI * 2)) * 0.8;
  const vanLoadedBoxScale = easeOutBackPop((tSec - 2.45) / 0.3) * resetFade;
  const loaderArmSwing = Math.sin((tSec - 1.5) * Math.PI * 5) * 0.45;
  const loaderBoxLiftZ = Math.max(0, Math.sin((tSec - 1.5) * Math.PI * 2)) * 3;
  const loaderBoxPushX = easeInOutCubic((tSec - 2.1) / 0.8);

  return {
    resetFade,
    ownerTypingPhase,
    wrenchTurnAngle,
    gridBlocksLit,
    orangeButtonPop,
    conveyorMoveProgress,
    conveyorBoxScale,
    workerTapeArm,
    boxTapeRatio,
    loaderWalkProgress,
    loaderHasBox,
    loaderStride,
    customerPhoneGlow,
    customerShiftX,
    customerShiftY,
    customerHopZ,
    customerWavePhase,
    customerStride,
    vanBounceZ,
    vanLoadedBoxScale,
    loaderArmSwing,
    loaderBoxLiftZ,
    loaderBoxPushX,
  };
}

const drawOnlineStoreScene = function drawOnlineStoreScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tSec: number,
  showGuides: boolean,
  canvasBackground = "#f3f0e8",
) {
	ctx.save();
	ctx.clearRect(0, 0, width, height);
	if (canvasBackground !== "transparent") {
		ctx.fillStyle = canvasBackground;
		ctx.fillRect(0, 0, width, height);
	}
	const baseScale = width / 1e3;
	ctx.scale(baseScale, baseScale);
	// Zoomed framing so the side-by-side buildings fill the square frame cleanly
	ctx.translate(500, 510);
	ctx.scale(1.16, 1.16);
	ctx.translate(-500, -510);
	const originX = 516;
	const originY = 696;
	const iso = (x: number, y: number, z: number): Point => [originX + (x - y) * COS30, originY - (x + y) * SIN30 - z];
	const drawPoly = (pts: Point[], fill?: string, stroke?: string, lineWidth = 1.5, lineJoin: CanvasLineJoin = "round") => {
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
		const st = colors.stroke ?? ONLINE_STORE_PALETTE.strokeNavy;
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
	const ch = computeOnlineStoreChoreography(tSec);
	const plantSway = Math.sin(tSec / ONLINE_STORE_LOOP_DURATION * Math.PI * 2) * 1.1;
	/**
	* Helper to draw a packed cardboard box with an orange tape stripe on top
	*/
	const drawCardboardBox = (bx: number, by: number, bz: number, bw: number, bd: number, bh: number, tapeRatio = 1) => {
		drawPrism(bx, by, bz, bw, bd, bh, {
			top: ONLINE_STORE_PALETTE.cardboardTop,
			right: ONLINE_STORE_PALETTE.cardboardRight,
			left: ONLINE_STORE_PALETTE.cardboardLeft,
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
			lineWidth: 1.2
		});
		if (tapeRatio > .05) {
			const td = bd * clamp01(tapeRatio);
			drawPoly([
				iso(bx + bw * .36, by, bz + bh + .15),
				iso(bx + bw * .64, by, bz + bh + .15),
				iso(bx + bw * .64, by + td, bz + bh + .15),
				iso(bx + bw * .36, by + td, bz + bh + .15)
			], ONLINE_STORE_PALETTE.orangeAccent);
		}
	};
	/**
	* Draws tiny blocky navy-and-white characters at the exact same small scale as the style reference
	*/
	const drawCharacter = (opts: CharacterOptions) => {
		const { x, y, z, scaleFactor = 1, role, actionPhase = 0, stride = 0, wrenchAngle = 0, holdingBox = false, boxLiftZ = 0, boxPushX = 0 } = opts;
		const s = scaleFactor;
		const legSpread = stride * 3.4 * s;
		const isApronOwner = role === "shop-owner-apron";
		// Ground contact shadow (stays on ground plane z = 0.3 for outdoor characters)
		const shadowZ = role === "customer-smartphone" ? .3 : z + .3;
		drawPoly([
			iso(x - 6 * s, y - 6 * s, shadowZ),
			iso(x + 6 * s, y - 6 * s, shadowZ),
			iso(x + 6 * s, y + 6 * s, shadowZ),
			iso(x - 6 * s, y + 6 * s, shadowZ)
		], "rgba(21, 39, 94, 0.20)", "none");
		// Left leg
		drawPrism(x - 3.8 * s, y - 2.4 * s + legSpread, z, 3.4 * s, 4.4 * s, 2.5 * s, {
			top: "#FFFFFF",
			right: "#E2E8F0",
			left: "#FFFFFF",
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		drawPrism(x - 3.8 * s, y - 2.4 * s + legSpread, z + 2.5 * s, 3.4 * s, 4.4 * s, 8.8 * s, {
			top: ONLINE_STORE_PALETTE.royalBright,
			right: ONLINE_STORE_PALETTE.navyRoof,
			left: ONLINE_STORE_PALETTE.royalFacade,
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		// Right leg
		drawPrism(x + .4 * s, y - 2.4 * s - legSpread, z, 3.4 * s, 4.4 * s, 2.5 * s, {
			top: "#FFFFFF",
			right: "#CBD5E1",
			left: "#FFFFFF",
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		drawPrism(x + .4 * s, y - 2.4 * s - legSpread, z + 2.5 * s, 3.4 * s, 4.4 * s, 8.8 * s, {
			top: ONLINE_STORE_PALETTE.royalBright,
			right: ONLINE_STORE_PALETTE.navyRoof,
			left: ONLINE_STORE_PALETTE.royalFacade,
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		// Torso (blue vest for warehouse/delivery/roof, orange apron on front-left for shop owner)
		drawPrism(x - 4.8 * s, y - 3.4 * s, z + 11.3 * s, 9.6 * s, 6.8 * s, 13 * s, {
			top: ONLINE_STORE_PALETTE.royalBright,
			right: isApronOwner ? ONLINE_STORE_PALETTE.orangeAccent : ONLINE_STORE_PALETTE.royalFacade,
			left: isApronOwner ? ONLINE_STORE_PALETTE.orangeAccent : "#FFFFFF",
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
			lineWidth: 1.4
		});
		// Collar strip
		drawPrism(x - 4.9 * s, y - 3.5 * s, z + 22.8 * s, 9.8 * s, 7 * s, 1.8 * s, {
			top: "#FFFFFF",
			right: "#E2E8F0",
			left: "#FFFFFF",
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
			lineWidth: 1.2
		});
		// Left Arm
		if (role === "roof-wrench-worker") {
			const armZ = z + 16.5 * s + wrenchAngle * 1.6;
			drawPrism(x - 9.2 * s, y - 2.2 * s, armZ, 5 * s, 4 * s, 3.8 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: ONLINE_STORE_PALETTE.strokeNavy,
				lineWidth: 1.25
			});
			const wrX = x - 11.5 * s;
			const wrY = y - 1 * s;
			const wrZ = armZ + 2.5 * s;
			drawLine(iso(wrX + 2.5 * s, wrY, wrZ - 2 * s), iso(wrX - 3.5 * s, wrY, wrZ + 6.5 * s + wrenchAngle * 2.2), ONLINE_STORE_PALETTE.strokeNavy, 4);
			drawLine(iso(wrX + 2.5 * s, wrY, wrZ - 2 * s), iso(wrX - 3.5 * s, wrY, wrZ + 6.5 * s + wrenchAngle * 2.2), "#E2E8F0", 2.2);
			const headX = wrX - 3.8 * s;
			const headZ = wrZ + 7 * s + wrenchAngle * 2.2;
			drawPoly([
				iso(headX - 2.4, wrY, headZ + 2.4),
				iso(headX + 2.4, wrY, headZ + 2.4),
				iso(headX + 2.4, wrY, headZ - 2.4),
				iso(headX - 2.4, wrY, headZ - 2.4)
			], "#CBD5E1", ONLINE_STORE_PALETTE.strokeNavy, 1.15);
		} else if (role === "shop-owner-apron") {
			const tapZ = actionPhase * 1;
			drawPrism(x - 8.2 * s, y - 2.2 * s, z + (16 + tapZ) * s, 4.2 * s, 4.4 * s, 3.8 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: ONLINE_STORE_PALETTE.strokeNavy,
				lineWidth: 1.25
			});
		} else if (role === "customer-smartphone") {
			// Lively left arm: waves happily when actionPhase > 0, or reaches slightly toward the phone when tapping
			if (actionPhase > .15) {
				const waveZ = z + (18.5 + actionPhase * 5.2) * s;
				drawPrism(x - 8 * s, y - 2.2 * s, waveZ, 3.4 * s, 4.4 * s, 7.5 * s, {
					top: "#FFFFFF",
					right: "#E2E8F0",
					left: "#FFFFFF",
					stroke: ONLINE_STORE_PALETTE.strokeNavy,
					lineWidth: 1.3
				});
			} else {
				const tapOffset = actionPhase * 2.5;
				drawPrism(x - 7.4 * s, y - (2.4 - tapOffset) * s, z + (14.2 - tapOffset) * s, 2.8 * s, 4.8 * s, 8.5 * s, {
					top: "#FFFFFF",
					right: "#E2E8F0",
					left: "#FFFFFF",
					stroke: ONLINE_STORE_PALETTE.strokeNavy,
					lineWidth: 1.3
				});
			}
		} else if (role === "delivery-loader") {
			const armLift = holdingBox ? 2.2 + boxLiftZ * .35 : actionPhase * 2;
			drawPrism(x - 8.2 * s, y - 2.2 * s, z + (14.5 + armLift) * s, 4 * s, 4.6 * s, 5.2 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: ONLINE_STORE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		} else {
			drawPrism(x - 7.4 * s, y - 2.4 * s, z + 13.8 * s, 2.6 * s, 4.8 * s, 9 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: ONLINE_STORE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		}
		// Right Arm & Role-Specific Held Prop
		if (role === "shop-owner-apron") {
			const tapZ = -actionPhase * 1;
			drawPrism(x - 7.6 * s, y + 1.8 * s, z + (16 + tapZ) * s, 4.2 * s, 4.4 * s, 3.8 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: ONLINE_STORE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		} else if (role === "warehouse-vest-worker") {
			const sweepY = actionPhase * 2.4;
			drawPrism(x - 8.4 * s, y + (1 + sweepY) * s, z + 16.5 * s, 4.6 * s, 4.4 * s, 4 * s, {
				top: "#FFFFFF",
				right: ONLINE_STORE_PALETTE.royalFacade,
				left: "#FFFFFF",
				stroke: ONLINE_STORE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			// Tiny orange tape gun in hand
			drawPrism(x - 10.5 * s, y + (1.2 + sweepY) * s, z + 15.2 * s, 4 * s, 4 * s, 3.4 * s, {
				top: ONLINE_STORE_PALETTE.orangeAccent,
				right: ONLINE_STORE_PALETTE.orangeShade,
				left: ONLINE_STORE_PALETTE.orangeAccent,
				stroke: ONLINE_STORE_PALETTE.strokeNavy,
				lineWidth: 1.1
			});
		} else if (role === "delivery-loader") {
			const armLift = holdingBox ? 1.8 + boxLiftZ * .35 : -actionPhase * 2;
			drawPrism(x + 4.4 * s, y - 3.2 * s, z + (14.8 + armLift) * s, 3.6 * s, 5.2 * s, 4.8 * s, {
				top: "#FFFFFF",
				right: ONLINE_STORE_PALETTE.royalFacade,
				left: "#FFFFFF",
				stroke: ONLINE_STORE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			if (holdingBox) {
				drawCardboardBox(x - (11.5 + boxPushX) * s, y - 4.2 * s, z + (13.2 + boxLiftZ) * s, 10.2 * s, 10.2 * s, 9.2 * s, 1);
			}
		} else if (role === "customer-smartphone") {
			const armBob = Math.sin(actionPhase * Math.PI) * .8;
			drawPrism(x + 4.4 * s, y - 3.4 * s, z + (16 + armBob) * s, 4 * s, 4.8 * s, 4 * s, {
				top: "#FFFFFF",
				right: ONLINE_STORE_PALETTE.royalFacade,
				left: "#FFFFFF",
				stroke: ONLINE_STORE_PALETTE.strokeNavy,
				lineWidth: 1.35
			});
			// Proportionate handheld smartphone held directly in the customer's right hand
			const phX0 = x + 6.8 * s;
			const phW = 8.4 * s;
			const phY = y - 4.2 * s;
			const phZ0 = z + (14.2 + armBob) * s;
			const phH = 13.2 * s;
			drawPrism(phX0, phY, phZ0, phW, 1.8, phH, {
				top: ONLINE_STORE_PALETTE.royalBright,
				right: ONLINE_STORE_PALETTE.navyRoof,
				left: ONLINE_STORE_PALETTE.navyDeep,
				stroke: ONLINE_STORE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
			const scX0 = phX0 + 1.1;
			const scX1 = phX0 + phW - 1.1;
			const scY = phY - .18;
			const scZ0 = phZ0 + 1.4;
			const scZ1 = phZ0 + phH - 1.4;
			drawPoly([
				iso(scX0, scY, scZ0),
				iso(scX1, scY, scZ0),
				iso(scX1, scY, scZ1),
				iso(scX0, scY, scZ1)
			], "#FFFFFF", ONLINE_STORE_PALETTE.strokeNavy, 1);
			for (let pr = 0; pr < 2; pr++) {
				for (let pc = 0; pc < 2; pc++) {
					const px0 = scX0 + .8 + pc * 2.8;
					const px1 = px0 + 2.1;
					const pz0 = scZ1 - 3.4 - pr * 3;
					const pz1 = pz0 + 2.2;
					drawPoly([
						iso(px0, scY - .12, pz0),
						iso(px1, scY - .12, pz0),
						iso(px1, scY - .12, pz1),
						iso(px0, scY - .12, pz1)
					], (pr + pc) % 2 === 0 ? "#93C5FD" : "#FDE68A");
				}
			}
			drawPoly([
				iso(scX0 + 1, scY - .15, scZ0 + .9),
				iso(scX1 - 1, scY - .15, scZ0 + .9),
				iso(scX1 - 1, scY - .15, scZ0 + 2.5),
				iso(scX0 + 1, scY - .15, scZ0 + 2.5)
			], ONLINE_STORE_PALETTE.orangeAccent);
		} else {
			drawPrism(x + 4.8 * s, y - 2.4 * s, z + 13.8 * s, 2.6 * s, 4.8 * s, 9 * s, {
				top: "#FFFFFF",
				right: "#CBD5E1",
				left: "#FFFFFF",
				stroke: ONLINE_STORE_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		}
		// Head (with subtle joyful tilt/turn for customer)
		const headShiftX = role === "customer-smartphone" ? actionPhase * .6 : 0;
		drawPrism(x - (4 - headShiftX) * s, y - 3.3 * s, z + 24.6 * s, 8 * s, 6.6 * s, 8.8 * s, {
			top: "#FFFFFF",
			right: "#F1F5F9",
			left: "#FFFFFF",
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
			lineWidth: 1.4
		});
		// Cap / Hair / Hard-hat top
		const isHardHat = role === "roof-wrench-worker";
		drawPrism(x - (4.4 - headShiftX) * s, y - 3.7 * s, z + 32.5 * s, 8.8 * s, 7.4 * s, 3 * s, {
			top: isHardHat ? ONLINE_STORE_PALETTE.royalBright : ONLINE_STORE_PALETTE.navyRoof,
			right: ONLINE_STORE_PALETTE.navyDeep,
			left: ONLINE_STORE_PALETTE.royalFacade,
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
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
			top: ONLINE_STORE_PALETTE.potTerracotta,
			right: ONLINE_STORE_PALETTE.potTerracottaDark,
			left: ONLINE_STORE_PALETTE.orangeAccent,
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		drawPrism(px - 7.8 * scaleP, py - 7.8 * scaleP, pz + 10 * scaleP, 15.6 * scaleP, 15.6 * scaleP, 3.5 * scaleP, {
			top: ONLINE_STORE_PALETTE.orangeAccent,
			right: ONLINE_STORE_PALETTE.potTerracottaDark,
			left: ONLINE_STORE_PALETTE.potTerracotta,
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		const leafZ = pz + 13.5 * scaleP;
		drawPoly([
			iso(px, py, leafZ),
			iso(px + (-10 + sway) * scaleP, py + 4 * scaleP, leafZ + 8 * scaleP),
			iso(px + (-8 + sway) * scaleP, py - 2 * scaleP, leafZ + 17 * scaleP),
			iso(px - 1 * scaleP, py - 2 * scaleP, leafZ + 10 * scaleP)
		], ONLINE_STORE_PALETTE.plantGreenMid, ONLINE_STORE_PALETTE.strokeNavy, 1.3);
		drawPoly([
			iso(px, py, leafZ),
			iso(px + (10 + sway) * scaleP, py - 4 * scaleP, leafZ + 8 * scaleP),
			iso(px + (8 + sway) * scaleP, py + 2 * scaleP, leafZ + 17 * scaleP),
			iso(px + 1 * scaleP, py + 2 * scaleP, leafZ + 10 * scaleP)
		], ONLINE_STORE_PALETTE.plantGreenDark, ONLINE_STORE_PALETTE.strokeNavy, 1.3);
		drawPoly([
			iso(px - 4 * scaleP, py - 3 * scaleP, leafZ + 2 * scaleP),
			iso(px + sway * 1.2 * scaleP, py, leafZ + 23 * scaleP),
			iso(px + 4 * scaleP, py + 3 * scaleP, leafZ + 2 * scaleP)
		], ONLINE_STORE_PALETTE.plantGreenLight, ONLINE_STORE_PALETTE.strokeNavy, 1.35);
	};
	// ============================================================================
	// SIDE-BY-SIDE TWO-VOLUME BUILDING GEOMETRY:
	// Both volumes sit side by side along the exact same front-left ground line
	// (x = BLDG_X0..BLDG_X1), touching ONLY at one vertical shared wall (y = SHARED_Y).
	// - Warehouse (LEFT volume):  x = 16..148, y = 82..188, height WH_H = 68 (lower volume)
	// - Shop (RIGHT volume):      x = 16..148, y = -18..82, height SHOP_H = 104 (taller volume)
	// Neither building overlaps or sits in front of or on top of the other!
	// ============================================================================
	const BLDG_X0 = 16;
	const BLDG_X1 = 148;
	const SHOP_Y0 = -18;
	const SHARED_Y = 82;
	const WH_Y1 = 188;
	const WH_H = 68;
	const SHOP_H = 104;
	const BRICK_BASE_H = 22;
	// ============================================================================
	// 1. THIN LIGHT BASE PLATE WITH TILE LINES AND OUTLINE
	// ============================================================================
	const GX0 = -56;
	const GX1 = BLDG_X1 + 32;
	const GY0 = SHOP_Y0 - 44;
	const GY1 = WH_Y1 + 24;
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
	// Subtle tile grid lines on the sidewalk and loading apron
	drawLine(iso(BLDG_X0, GY0, .2), iso(BLDG_X0, GY1, .2), "#CBD5E1", 1.2);
	drawLine(iso(GX0, SHOP_Y0, .2), iso(GX1, SHOP_Y0, .2), "#CBD5E1", 1.2);
	drawLine(iso(GX0, SHARED_Y, .2), iso(BLDG_X0, SHARED_Y, .2), "#CBD5E1", 1.3);
	for (let tx = GX0 + 34; tx < GX1; tx += 34) {
		drawLine(iso(tx, SHOP_Y0, .2), iso(tx, GY0, .2), "#E2E8F0", 1);
	}
	for (let ty = GY0 + 34; ty < GY1; ty += 34) {
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
	// 2. LEFT VOLUME: THE WAREHOUSE (x = BLDG_X0..BLDG_X1, y = SHARED_Y..WH_Y1, z = 0..WH_H)
	//    Lower cream-stucco volume on the left, cutaway open ONLY on its front-left
	//    face (x = BLDG_X0), with its own separate lower flat roof and solar panel on top.
	//    Drawn BEFORE the shared wall (y = SHARED_Y) so the shared wall cleanly bounds it!
	// ============================================================================
	// Warehouse Back-Right Interior Wall (x = BLDG_X1, y = SHARED_Y..WH_Y1, z = 0..WH_H)
	drawPoly([
		iso(BLDG_X1, SHARED_Y, 0),
		iso(BLDG_X1, WH_Y1, 0),
		iso(BLDG_X1, WH_Y1, WH_H),
		iso(BLDG_X1, SHARED_Y, WH_H)
	], ONLINE_STORE_PALETTE.creamStuccoShade, ONLINE_STORE_PALETTE.strokeNavy, 1.5);
	// Warehouse Back-Left End Wall (x = BLDG_X0..BLDG_X1, y = WH_Y1, z = 0..WH_H)
	drawPoly([
		iso(BLDG_X0, WH_Y1, 0),
		iso(BLDG_X1, WH_Y1, 0),
		iso(BLDG_X1, WH_Y1, WH_H),
		iso(BLDG_X0, WH_Y1, WH_H)
	], ONLINE_STORE_PALETTE.creamStucco, ONLINE_STORE_PALETTE.strokeNavy, 1.5);
	// Warehouse Warm Interior Floor (x = BLDG_X0..BLDG_X1, y = SHARED_Y..WH_Y1)
	drawPoly([
		iso(BLDG_X0, SHARED_Y, 1),
		iso(BLDG_X1, SHARED_Y, 1),
		iso(BLDG_X1, WH_Y1, 1),
		iso(BLDG_X0, WH_Y1, 1)
	], "#FEF3C7", ONLINE_STORE_PALETTE.strokeNavy, 1.35);
	// Stacked Cardboard Boxes of Different Sizes inside the Warehouse (positioned under the warehouse roof
	// and along the back-right wall so none poke above the front-left roll-up door lintel!)
	drawCardboardBox(BLDG_X1 - 26, WH_Y1 - 26, 2, 20, 20, 18, 1);
	drawCardboardBox(BLDG_X1 - 24, WH_Y1 - 24, 20, 16, 16, 15, 1);
	drawCardboardBox(BLDG_X1 - 26, WH_Y1 - 50, 2, 20, 20, 18, 1);
	drawCardboardBox(BLDG_X1 - 24, WH_Y1 - 48, 20, 16, 16, 14, 1);
	drawCardboardBox(BLDG_X1 - 26, WH_Y1 - 74, 2, 18, 18, 16, 1);
	drawCardboardBox(BLDG_X0 + 54, WH_Y1 - 24, 2, 18, 18, 16, 1);
	drawCardboardBox(BLDG_X0 + 56, WH_Y1 - 22, 18, 14, 14, 13, 1);
	drawCardboardBox(BLDG_X0 + 76, WH_Y1 - 24, 2, 16, 16, 15, 1);
	// Low floor box near the roll-up door (well below the door slats so it never overlaps the lintel)
	drawCardboardBox(BLDG_X0 + 14, WH_Y1 - 36, 2, 15, 15, 12, 1);
	// Tiny Worker in a Blue Vest Taping a Box at the Warehouse Packing Table
	drawCharacter({
		x: BLDG_X0 + 62,
		y: SHARED_Y + 46,
		z: 2,
		scaleFactor: .96,
		role: "warehouse-vest-worker",
		actionPhase: ch.workerTapeArm,
		stride: 0
	});
	// Packing Table & Box being sealed with orange tape in the warehouse
	drawPrism(BLDG_X0 + 36, SHARED_Y + 38, 2, 18, 24, 13, {
		top: "#E2E8F0",
		right: ONLINE_STORE_PALETTE.navyRoof,
		left: "#CBD5E1",
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.25
	});
	drawCardboardBox(BLDG_X0 + 38, SHARED_Y + 43, 15, 13, 14, 11, ch.boxTapeRatio);
	// Warehouse Front-Left Cutaway Frame (Wide Roll-Up Door & Separate Lower Roof with Solar Panel)
	const ROLL_Y0 = SHARED_Y + 12;
	const ROLL_Y1 = WH_Y1 - 12;
	const ROLL_Z_TOP = 50;
	// Left (rear) pillar of warehouse front-left wall
	drawPrism(BLDG_X0 - 1, ROLL_Y1, 0, 5, WH_Y1 - ROLL_Y1, WH_H, {
		top: ONLINE_STORE_PALETTE.creamStucco,
		right: ONLINE_STORE_PALETTE.creamStuccoShade,
		left: ONLINE_STORE_PALETTE.creamStucco,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Right pillar of warehouse front-left wall (next to shared wall)
	drawPrism(BLDG_X0 - 1, SHARED_Y + 2.5, 0, 5, ROLL_Y0 - (SHARED_Y + 2.5), WH_H, {
		top: ONLINE_STORE_PALETTE.creamStucco,
		right: ONLINE_STORE_PALETTE.creamStuccoShade,
		left: ONLINE_STORE_PALETTE.creamStucco,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Upper lintel above the wide roll-up door
	drawPrism(BLDG_X0 - 1, ROLL_Y0, ROLL_Z_TOP, 5, ROLL_Y1 - ROLL_Y0, WH_H - ROLL_Z_TOP, {
		top: ONLINE_STORE_PALETTE.creamStucco,
		right: ONLINE_STORE_PALETTE.creamStuccoShade,
		left: ONLINE_STORE_PALETTE.creamStucco,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Corrugated roll-up door slats at top of opening (z = 38..ROLL_Z_TOP)
	drawPoly([
		iso(BLDG_X0, ROLL_Y0, 38),
		iso(BLDG_X0, ROLL_Y1, 38),
		iso(BLDG_X0, ROLL_Y1, ROLL_Z_TOP),
		iso(BLDG_X0, ROLL_Y0, ROLL_Z_TOP)
	], "#E2E8F0", ONLINE_STORE_PALETTE.strokeNavy, 1.3);
	for (let rz = 41; rz < ROLL_Z_TOP; rz += 3.5) {
		drawLine(iso(BLDG_X0 - .1, ROLL_Y0 + 1, rz), iso(BLDG_X0 - .1, ROLL_Y1 - 1, rz), "#94A3B8", 1);
	}
	// Separate Lower Flat Roof on the Warehouse (drawn BEFORE the shared wall so its right edge
	// terminates cleanly behind the taller shared wall at y = SHARED_Y with zero corner overlap!)
	const WH_ROOF_X0 = BLDG_X0 + 44;
	drawPrism(WH_ROOF_X0, SHARED_Y + 2, WH_H - 4, BLDG_X1 - WH_ROOF_X0 + 2, WH_Y1 - SHARED_Y, 6, {
		top: ONLINE_STORE_PALETTE.creamStucco,
		right: ONLINE_STORE_PALETTE.creamStuccoShade,
		left: ONLINE_STORE_PALETTE.creamStucco,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.5
	});
	// Recessed inner roof surface on the lower warehouse roof
	drawPoly([
		iso(WH_ROOF_X0 + 5, SHARED_Y + 6, WH_H + 2.2),
		iso(BLDG_X1 - 5, SHARED_Y + 6, WH_H + 2.2),
		iso(BLDG_X1 - 5, WH_Y1 - 5, WH_H + 2.2),
		iso(WH_ROOF_X0 + 5, WH_Y1 - 5, WH_H + 2.2)
	], ONLINE_STORE_PALETTE.creamStuccoShade, ONLINE_STORE_PALETTE.strokeNavy, 1.2);
	// Small Solar Panel Sitting Flat on the Lower Warehouse Roof (100% visible)
	const spX0 = WH_ROOF_X0 + 12;
	const spX1 = BLDG_X1 - 14;
	const spY0 = SHARED_Y + 20;
	const spY1 = WH_Y1 - 20;
	const spZLow = WH_H + 3.5;
	const spZHigh = WH_H + 14.5;
	drawLine(iso(spX1 - 4, spY0 + 4, WH_H + 2.2), iso(spX1 - 4, spY0 + 4, spZHigh), ONLINE_STORE_PALETTE.strokeNavy, 2);
	drawLine(iso(spX1 - 4, spY1 - 4, WH_H + 2.2), iso(spX1 - 4, spY1 - 4, spZHigh), ONLINE_STORE_PALETTE.strokeNavy, 2);
	drawPoly([
		iso(spX0, spY0, spZLow),
		iso(spX1, spY0, spZHigh),
		iso(spX1, spY1, spZHigh),
		iso(spX0, spY1, spZLow)
	], "#E2E8F0", ONLINE_STORE_PALETTE.strokeNavy, 1.45);
	drawPoly([
		iso(spX0 + 3, spY0 + 3, spZLow + .8),
		iso(spX1 - 3, spY0 + 3, spZHigh - .8),
		iso(spX1 - 3, spY1 - 3, spZHigh - .8),
		iso(spX0 + 3, spY1 - 3, spZLow + .8)
	], ONLINE_STORE_PALETTE.navyRoof, ONLINE_STORE_PALETTE.strokeNavy, 1.15);
	const lerpSolar = (fx: number, fy: number): Point => {
		const sx = spX0 + 3 + (spX1 - spX0 - 6) * fx;
		const sy = spY0 + 3 + (spY1 - spY0 - 6) * fy;
		const sz = spZLow + .8 + (spZHigh - spZLow - 1.6) * fx;
		return iso(sx, sy, sz);
	};
	drawLine(lerpSolar(.33, 0), lerpSolar(.33, 1), "#93C5FD", 1);
	drawLine(lerpSolar(.67, 0), lerpSolar(.67, 1), "#93C5FD", 1);
	drawLine(lerpSolar(0, .33), lerpSolar(1, .33), "#93C5FD", 1);
	drawLine(lerpSolar(0, .67), lerpSolar(1, .67), "#93C5FD", 1);
	// ============================================================================
	// 3. RIGHT VOLUME: THE SHOP INTERIOR (x = BLDG_X0..BLDG_X1, y = SHOP_Y0..SHARED_Y, z = 0..SHOP_H)
	//    Cutaway open on the front-left side (x = BLDG_X0) so the shop interior is
	//    completely visible without overlapping the warehouse.
	// ============================================================================
	// Shop Back-Right Interior Wall (x = BLDG_X1, y = SHOP_Y0..SHARED_Y, z = 0..SHOP_H)
	drawPoly([
		iso(BLDG_X1, SHOP_Y0, 0),
		iso(BLDG_X1, SHARED_Y, 0),
		iso(BLDG_X1, SHARED_Y, SHOP_H),
		iso(BLDG_X1, SHOP_Y0, SHOP_H)
	], ONLINE_STORE_PALETTE.warmInteriorWall, ONLINE_STORE_PALETTE.strokeNavy, 1.5);
	// Shop Warm Yellow Floor (x = BLDG_X0..BLDG_X1, y = SHOP_Y0..SHARED_Y)
	drawPoly([
		iso(BLDG_X0, SHOP_Y0, 1),
		iso(BLDG_X1, SHOP_Y0, 1),
		iso(BLDG_X1, SHARED_Y, 1),
		iso(BLDG_X0, SHARED_Y, 1)
	], ONLINE_STORE_PALETTE.warmInteriorFloor, ONLINE_STORE_PALETTE.strokeNavy, 1.4);
	// Warm light spill on the sidewalk outside the shop front-right facade (y = SHOP_Y0)
	drawPoly([
		iso(BLDG_X0 + 8, SHOP_Y0, .3),
		iso(BLDG_X1 - 8, SHOP_Y0, .3),
		iso(BLDG_X1 - 4, SHOP_Y0 - 24, .3),
		iso(BLDG_X0 + 4, SHOP_Y0 - 24, .3)
	], "rgba(254, 240, 138, 0.45)", "none");
	// ============================================================================
	// 4. CLEAR VERTICAL SHARED WALL (y = SHARED_Y = 82) WITH SMALL RECTANGULAR
	//    OPENING FOR THE SHORT CONVEYOR BELT PASSING FROM SHOP TO WAREHOUSE
	// ============================================================================
	// Shared wall runs at y = SHARED_Y (x = BLDG_X0..BLDG_X1, z = 0..SHOP_H).
	// Drawn AFTER the warehouse roof (Section 2) so it cleanly bounds the warehouse roof,
	// and BEFORE the shop shelves (so the rear shelf sits in front of the shared wall).
	const CONV_OPEN_X0 = 49;
	const CONV_OPEN_X1 = 69;
	const CONV_OPEN_Z0 = 11.5;
	const CONV_OPEN_Z1 = 29;
	// Seamless warm yellow interior face of the shared wall inside the shop (z = 0..SHOP_H)
	drawPoly([
		iso(BLDG_X0, SHARED_Y, 0),
		iso(BLDG_X1, SHARED_Y, 0),
		iso(BLDG_X1, SHARED_Y, SHOP_H),
		iso(BLDG_X0, SHARED_Y, SHOP_H)
	], ONLINE_STORE_PALETTE.warmInteriorWall, ONLINE_STORE_PALETTE.strokeNavy, 1.55);
	// Top terracotta coping along the top edge of the shared wall (z = SHOP_H - 4..SHOP_H + 4)
	drawPoly([
		iso(BLDG_X0 - 1, SHARED_Y - 2.5, SHOP_H),
		iso(BLDG_X1, SHARED_Y - 2.5, SHOP_H),
		iso(BLDG_X1, SHARED_Y + 2.5, SHOP_H),
		iso(BLDG_X0 - 1, SHARED_Y + 2.5, SHOP_H)
	], ONLINE_STORE_PALETTE.terracottaStucco, ONLINE_STORE_PALETTE.strokeNavy, 1.45);
	// Clear Vertical Shared Wall Pillar at the Front-Left Seam (x = BLDG_X0 - 1..BLDG_X0 + 5, y = SHARED_Y - 2.5..SHARED_Y + 2.5, z = 0..SHOP_H)
	drawPrism(BLDG_X0 - 1, SHARED_Y - 2.5, 0, 6, 5, SHOP_H, {
		top: ONLINE_STORE_PALETTE.terracottaStucco,
		right: ONLINE_STORE_PALETTE.terracottaStuccoShade,
		left: ONLINE_STORE_PALETTE.creamStucco,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.65
	});
	// Bold vertical boundary line on the front face of the shared wall where the two buildings meet
	drawLine(iso(BLDG_X0 - 1.1, SHARED_Y, 0), iso(BLDG_X0 - 1.1, SHARED_Y, SHOP_H), ONLINE_STORE_PALETTE.strokeNavy, 1.9);
	// Dark pass-through opening in the shared wall (x = CONV_OPEN_X0..CONV_OPEN_X1, z = CONV_OPEN_Z0..CONV_OPEN_Z1)
	drawPoly([
		iso(CONV_OPEN_X0, SHARED_Y, CONV_OPEN_Z0),
		iso(CONV_OPEN_X1, SHARED_Y, CONV_OPEN_Z0),
		iso(CONV_OPEN_X1, SHARED_Y, CONV_OPEN_Z1),
		iso(CONV_OPEN_X0, SHARED_Y, CONV_OPEN_Z1)
	], "#0F1E4D", ONLINE_STORE_PALETTE.strokeNavy, 1.5);
	// Subtle inner right jamb thickness inside the pass-through opening
	drawPoly([
		iso(CONV_OPEN_X1 - 2.2, SHARED_Y, CONV_OPEN_Z0),
		iso(CONV_OPEN_X1, SHARED_Y, CONV_OPEN_Z0),
		iso(CONV_OPEN_X1, SHARED_Y, CONV_OPEN_Z1),
		iso(CONV_OPEN_X1 - 2.2, SHARED_Y, CONV_OPEN_Z1)
	], ONLINE_STORE_PALETTE.navyRoof, ONLINE_STORE_PALETTE.strokeNavy, 1.1);
	// Short Conveyor Belt in the shop (from y = 46 up to the shared wall opening at y = SHARED_Y = 82;
	// capped strictly at SHARED_Y so the far end never sticks out past the wall hole, and with zero
	// overlapping wall patch slicing across the belt!)
	const convX = 51;
	const convW = 16;
	const convY0 = 46;
	const convLenY = SHARED_Y - convY0;
	// Support legs under the shop side of the conveyor belt
	drawPrism(convX + 2, convY0 + 4, 2, 12, 4, 10, {
		top: "#CBD5E1",
		right: ONLINE_STORE_PALETTE.navyRoof,
		left: "#94A3B8",
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.15
	});
	drawPrism(convX + 2, SHARED_Y - 10, 2, 12, 4, 10, {
		top: "#CBD5E1",
		right: ONLINE_STORE_PALETTE.navyRoof,
		left: "#94A3B8",
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.15
	});
	// Conveyor belt bed ending cleanly at y = SHARED_Y inside the wall opening
	drawPrism(convX, convY0, 12, convW, convLenY, 4.5, {
		top: ONLINE_STORE_PALETTE.navyRoof,
		right: ONLINE_STORE_PALETTE.royalFacade,
		left: ONLINE_STORE_PALETTE.navyDeep,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.35
	});
	for (let ry = convY0 + 5; ry < SHARED_Y - 2; ry += 6) {
		drawLine(iso(convX + 1.5, ry, 16.7), iso(convX + convW - 1.5, ry, 16.7), "#94A3B8", 1.15);
	}
	// Cardboard box on the conveyor belt:
	// - Appears smoothly at the start of the belt (y = convY0 + 2 = 48) at tSec = 0.12s..0.36s
	// - Rolls from y = 48 into the hole at y = SHARED_Y = 82 between 0.20s and 2.40s,
	//   progressively clipped against SHARED_Y so it disappears completely inside the hole!
	if (ch.conveyorBoxScale > .04) {
		const boxFullW = 12.5;
		const boxFullD = 12.5;
		const boxFullH = 10.5;
		const startY = convY0 + 2;
		const rawBoxY0 = startY + ch.conveyorMoveProgress * (SHARED_Y - startY);
		// Clip the back edge of the box against the shared wall hole plane (y = SHARED_Y)
		const clippedY1 = Math.min(rawBoxY0 + boxFullD * ch.conveyorBoxScale, SHARED_Y);
		const visibleDepth = clippedY1 - rawBoxY0;
		if (visibleDepth > .5) {
			const sc = ch.conveyorBoxScale;
			const bw = boxFullW * sc;
			const bh = boxFullH * sc;
			const bx = convX + (convW - bw) / 2;
			drawCardboardBox(bx, rawBoxY0, 16.6, bw, visibleDepth, bh, 1);
		}
	}
	// Shelves Full of Products along the Shop Back-Right Wall (x = BLDG_X1 - 16, y = SHOP_Y0 + 6..SHARED_Y - 6)
	// Drawn AFTER the shared wall so the rear shelf stands cleanly inside the shop in front of the shared wall!
	const drawShopProductShelfAlongY = (sx: number, sy: number, sz: number, unitLenY = 38) => {
		const unitW = 14;
		const shelfCount = 3;
		const unitH = shelfCount * 19 + 8;
		drawPrism(sx, sy, sz, unitW, unitLenY, unitH, {
			top: "#FDE68A",
			right: ONLINE_STORE_PALETTE.lightWoodDark,
			left: ONLINE_STORE_PALETTE.lightWood,
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
			lineWidth: 1.25
		});
		for (let level = 0; level < shelfCount; level++) {
			const lz = sz + 4 + level * 19;
			drawPrism(sx - 1.5, sy - 1, lz, unitW + 2, unitLenY + 2, 2.8, {
				top: "#FEF9C3",
				right: ONLINE_STORE_PALETTE.lightWoodDark,
				left: ONLINE_STORE_PALETTE.lightWood,
				stroke: ONLINE_STORE_PALETTE.strokeNavy,
				lineWidth: 1.1
			});
			for (let b = 0; b < 3; b++) {
				const bx = sx + 1.5;
				const by = sy + 3.5 + b * 11.2;
				const bz = lz + 2.8;
				const pType = (level + b) % 4;
				const col = pType === 0 ? {
					top: "#FFFFFF",
					right: ONLINE_STORE_PALETTE.orangeShade,
					left: ONLINE_STORE_PALETTE.orangeAccent
				} : pType === 1 ? {
					top: "#FFFFFF",
					right: ONLINE_STORE_PALETTE.navyRoof,
					left: ONLINE_STORE_PALETTE.royalBright
				} : pType === 2 ? {
					top: "#FFFFFF",
					right: ONLINE_STORE_PALETTE.plantGreenDark,
					left: ONLINE_STORE_PALETTE.plantGreenMid
				} : {
					top: "#FEF9C3",
					right: ONLINE_STORE_PALETTE.lightWoodDark,
					left: ONLINE_STORE_PALETTE.lightWood
				};
				drawPrism(bx, by, bz, 8.8, 8.8, 9.5, {
					...col,
					stroke: ONLINE_STORE_PALETTE.strokeNavy,
					lineWidth: 1
				});
			}
		}
	};
	drawShopProductShelfAlongY(BLDG_X1 - 16, SHOP_Y0 + 6, 2, 38);
	drawShopProductShelfAlongY(BLDG_X1 - 16, SHOP_Y0 + 48, 2, 38);
	// ============================================================================
	// 6. SHOP COUNTER, LAPTOP & OWNER IN APRON TYPING (Inside the Right Volume)
	// ============================================================================
	// Tiny Shop Owner in an Apron Typing behind the Counter
	drawCharacter({
		x: 102,
		y: 26,
		z: 2,
		scaleFactor: 1.02,
		role: "shop-owner-apron",
		actionPhase: ch.ownerTypingPhase,
		stride: 0
	});
	// Shop Counter with Open Laptop (facing the front-left cutaway opening)
	const cntX = 76;
	const cntY = 8;
	const cntW = 19;
	const cntD = 48;
	drawPrism(cntX, cntY, 2, cntW, cntD, 20, {
		top: "#FEF3C7",
		right: ONLINE_STORE_PALETTE.lightWoodDark,
		left: ONLINE_STORE_PALETTE.lightWood,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	// Open Laptop on the Shop Counter (screen facing front-left cutaway)
	const lapX = cntX + 3;
	const lapY = cntY + 14;
	const lapZ = 22;
	drawPrism(lapX, lapY, lapZ, 12, 18, 1.8, {
		top: "#E2E8F0",
		right: "#94A3B8",
		left: "#CBD5E1",
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.15
	});
	drawPrism(lapX + 9.5, lapY, lapZ + 1.8, 2.2, 18, 13, {
		top: ONLINE_STORE_PALETTE.royalBright,
		right: ONLINE_STORE_PALETTE.navyRoof,
		left: ONLINE_STORE_PALETTE.royalFacade,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.25
	});
	const cScreenX = lapX + 9.3;
	drawPoly([
		iso(cScreenX, lapY + 1.4, lapZ + 3),
		iso(cScreenX, lapY + 16.6, lapZ + 3),
		iso(cScreenX, lapY + 16.6, lapZ + 13.5),
		iso(cScreenX, lapY + 1.4, lapZ + 13.5)
	], "#FFFFFF", ONLINE_STORE_PALETTE.strokeNavy, 1);
	for (let gc = 0; gc < 3; gc++) {
		for (let gr = 0; gr < 2; gr++) {
			const gy0 = lapY + 2.2 + gc * 4.5;
			const gy1 = gy0 + 3.5;
			const gz0 = lapZ + 6.2 + gr * 3.2;
			const gz1 = gz0 + 2.5;
			drawPoly([
				iso(cScreenX - .12, gy0, gz0),
				iso(cScreenX - .12, gy1, gz0),
				iso(cScreenX - .12, gy1, gz1),
				iso(cScreenX - .12, gy0, gz1)
			], (gc + gr) % 2 === 0 ? "#93C5FD" : "#FDE68A");
		}
	}
	drawPoly([
		iso(cScreenX - .15, lapY + 2.4, lapZ + 3.5),
		iso(cScreenX - .15, lapY + 8.2, lapZ + 3.5),
		iso(cScreenX - .15, lapY + 8.2, lapZ + 5.4),
		iso(cScreenX - .15, lapY + 2.4, lapZ + 5.4)
	], ONLINE_STORE_PALETTE.orangeAccent);
	// Small packed box on the counter beside the laptop
	drawCardboardBox(cntX + 4, cntY + 35, 22, 9, 9, 8, 1);
	// ============================================================================
	// 7. SHOP CUTAWAY LOW WALL ON FRONT-LEFT (x = BLDG_X0) + SHOP FRONT-RIGHT FACADE (y = SHOP_Y0)
	//    Terracotta stucco walls with a low band of exposed brick at the base,
	//    wide rectangular windows lit warm yellow, wooden door, orange-and-white awning
	// ============================================================================
	// Low Exposed-Brick Cutaway Base Wall along the Front-Left Side of the Shop (x = BLDG_X0 - 1..BLDG_X0 + 4, y = SHOP_Y0..SHARED_Y - 2.5, z = 0..BRICK_BASE_H)
	drawPrism(BLDG_X0 - 1, SHOP_Y0, 0, 5, SHARED_Y - SHOP_Y0 - 2.5, BRICK_BASE_H, {
		top: ONLINE_STORE_PALETTE.terracottaStucco,
		right: ONLINE_STORE_PALETTE.terracottaBrickDark,
		left: ONLINE_STORE_PALETTE.terracottaBrick,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Brick mortar lines on the low cutaway base wall
	drawLine(iso(BLDG_X0 - 1.1, SHOP_Y0 + 3, 7), iso(BLDG_X0 - 1.1, SHARED_Y - 4, 7), "rgba(247, 242, 231, 0.45)", 1);
	drawLine(iso(BLDG_X0 - 1.1, SHOP_Y0 + 3, 14), iso(BLDG_X0 - 1.1, SHARED_Y - 4, 14), "rgba(247, 242, 231, 0.45)", 1);
	// Front-Right Shop Facade Wall: Terracotta Stucco (x = BLDG_X0 - 1..BLDG_X1, y = SHOP_Y0, z = BRICK_BASE_H..SHOP_H)
	drawPoly([
		iso(BLDG_X0 - 1, SHOP_Y0, BRICK_BASE_H),
		iso(BLDG_X1, SHOP_Y0, BRICK_BASE_H),
		iso(BLDG_X1, SHOP_Y0, SHOP_H),
		iso(BLDG_X0 - 1, SHOP_Y0, SHOP_H)
	], ONLINE_STORE_PALETTE.terracottaStucco, ONLINE_STORE_PALETTE.strokeNavy, 1.6);
	// Low Band of Exposed Brick at the Base of the Shop Front-Right Facade (z = 0..BRICK_BASE_H)
	drawPoly([
		iso(BLDG_X0 - 1, SHOP_Y0, 0),
		iso(BLDG_X1, SHOP_Y0, 0),
		iso(BLDG_X1, SHOP_Y0, BRICK_BASE_H),
		iso(BLDG_X0 - 1, SHOP_Y0, BRICK_BASE_H)
	], ONLINE_STORE_PALETTE.terracottaBrick, ONLINE_STORE_PALETTE.strokeNavy, 1.6);
	drawLine(iso(BLDG_X0 + 2, SHOP_Y0 - .1, 7), iso(BLDG_X1 - 2, SHOP_Y0 - .1, 7), "rgba(247, 242, 231, 0.45)", 1);
	drawLine(iso(BLDG_X0 + 2, SHOP_Y0 - .1, 14), iso(BLDG_X1 - 2, SHOP_Y0 - .1, 14), "rgba(247, 242, 231, 0.45)", 1);
	for (let bx = BLDG_X0 + 10; bx < BLDG_X1 - 6; bx += 16) {
		drawLine(iso(bx, SHOP_Y0 - .1, 0), iso(bx, SHOP_Y0 - .1, 7), "rgba(124, 45, 18, 0.5)", 1);
		drawLine(iso(bx + 8, SHOP_Y0 - .1, 7), iso(bx + 8, SHOP_Y0 - .1, 14), "rgba(124, 45, 18, 0.5)", 1);
		drawLine(iso(bx, SHOP_Y0 - .1, 14), iso(bx, SHOP_Y0 - .1, BRICK_BASE_H), "rgba(124, 45, 18, 0.5)", 1);
	}
	// Wide Rectangular Window 1 (Left of Shop Door: x = 24..58, z = 24..56) lit warm yellow
	drawPoly([
		iso(24, SHOP_Y0 - 1.2, 24),
		iso(58, SHOP_Y0 - 1.2, 24),
		iso(58, SHOP_Y0 - 1.2, 56),
		iso(24, SHOP_Y0 - 1.2, 56)
	], "#FEF08A", ONLINE_STORE_PALETTE.strokeNavy, 1.4);
	// Wooden Shop Door (x = 66..94, z = 0..64)
	const DOOR_X0 = 66;
	const DOOR_X1 = 94;
	const DOOR_Z1 = 64;
	drawPrism(DOOR_X0 - 2, SHOP_Y0 - 1.8, 0, DOOR_X1 - DOOR_X0 + 4, 1.8, DOOR_Z1 + 2, {
		top: ONLINE_STORE_PALETTE.lightWood,
		right: ONLINE_STORE_PALETTE.warmWoodDoorDark,
		left: ONLINE_STORE_PALETTE.warmWoodDoor,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	drawPoly([
		iso(DOOR_X0, SHOP_Y0 - 1.9, 0),
		iso(DOOR_X1, SHOP_Y0 - 1.9, 0),
		iso(DOOR_X1, SHOP_Y0 - 1.9, DOOR_Z1),
		iso(DOOR_X0, SHOP_Y0 - 1.9, DOOR_Z1)
	], ONLINE_STORE_PALETTE.warmWoodDoor, ONLINE_STORE_PALETTE.strokeNavy, 1.45);
	drawPoly([
		iso(DOOR_X0 + 4, SHOP_Y0 - 2, 32),
		iso(DOOR_X1 - 4, SHOP_Y0 - 2, 32),
		iso(DOOR_X1 - 4, SHOP_Y0 - 2, 56),
		iso(DOOR_X0 + 4, SHOP_Y0 - 2, 56)
	], "#FEF08A", ONLINE_STORE_PALETTE.strokeNavy, 1.25);
	// Wide Rectangular Window 2 (Right of Shop Door, under awning: x = 102..140, z = 24..56) lit warm yellow
	drawPoly([
		iso(102, SHOP_Y0 - 1.2, 24),
		iso(140, SHOP_Y0 - 1.2, 24),
		iso(140, SHOP_Y0 - 1.2, 56),
		iso(102, SHOP_Y0 - 1.2, 56)
	], "#FEF08A", ONLINE_STORE_PALETTE.strokeNavy, 1.4);
	// Clerestory Wide Rectangular Windows lit warm yellow above the awning (z = 76..90)
	drawPoly([
		iso(26, SHOP_Y0 - 1.2, 74),
		iso(76, SHOP_Y0 - 1.2, 74),
		iso(76, SHOP_Y0 - 1.2, 90),
		iso(26, SHOP_Y0 - 1.2, 90)
	], "#FEF08A", ONLINE_STORE_PALETTE.strokeNavy, 1.3);
	drawPoly([
		iso(88, SHOP_Y0 - 1.2, 74),
		iso(138, SHOP_Y0 - 1.2, 74),
		iso(138, SHOP_Y0 - 1.2, 90),
		iso(88, SHOP_Y0 - 1.2, 90)
	], "#FEF08A", ONLINE_STORE_PALETTE.strokeNavy, 1.3);
	// Orange-and-White Striped Awning over the Shop Facade (x = 62..142)
	const AWNING_X0 = 62;
	const AWNING_X1 = 142;
	const AWNING_Z_WALL = 68;
	const AWNING_Z_FRONT = 50;
	const AWNING_Y_FRONT = SHOP_Y0 - 18;
	const STRIPE_COUNT = 6;
	const stripeW = (AWNING_X1 - AWNING_X0) / STRIPE_COUNT;
	drawPoly([
		iso(AWNING_X0, SHOP_Y0 - 1.5, AWNING_Z_WALL),
		iso(AWNING_X0, AWNING_Y_FRONT, AWNING_Z_FRONT),
		iso(AWNING_X0, SHOP_Y0 - 1.5, AWNING_Z_FRONT)
	], ONLINE_STORE_PALETTE.orangeShade, ONLINE_STORE_PALETTE.strokeNavy, 1.35);
	for (let s = 0; s < STRIPE_COUNT; s++) {
		const sx0 = AWNING_X0 + s * stripeW;
		const sx1 = sx0 + stripeW;
		const isOrange = s % 2 === 0;
		const fill = isOrange ? ONLINE_STORE_PALETTE.orangeAccent : "#FFFFFF";
		const valenceFill = isOrange ? ONLINE_STORE_PALETTE.orangeShade : "#E2E8F0";
		drawPoly([
			iso(sx0, SHOP_Y0 - 1.5, AWNING_Z_WALL),
			iso(sx1, SHOP_Y0 - 1.5, AWNING_Z_WALL),
			iso(sx1, AWNING_Y_FRONT, AWNING_Z_FRONT),
			iso(sx0, AWNING_Y_FRONT, AWNING_Z_FRONT)
		], fill, ONLINE_STORE_PALETTE.strokeNavy, 1.35);
		drawPoly([
			iso(sx0, AWNING_Y_FRONT, AWNING_Z_FRONT),
			iso(sx1, AWNING_Y_FRONT, AWNING_Z_FRONT),
			iso(sx1 - 1.2, AWNING_Y_FRONT, AWNING_Z_FRONT - 4.8),
			iso((sx0 + sx1) / 2, AWNING_Y_FRONT, AWNING_Z_FRONT - 6.5),
			iso(sx0 + 1.2, AWNING_Y_FRONT, AWNING_Z_FRONT - 4.8)
		], valenceFill, ONLINE_STORE_PALETTE.strokeNavy, 1.25);
	}
	// Two Small Potted Plants on the Shop Sidewalk
	drawPottedPlant(56, SHOP_Y0 - 11, 0, plantSway, .86);
	drawPottedPlant(140, SHOP_Y0 - 11, 0, -plantSway, .86);
	// Lively Tiny Customer in Front of the Shop Building Holding a Smartphone
	drawCharacter({
		x: 82 + ch.customerShiftX,
		y: SHOP_Y0 - 27 + ch.customerShiftY,
		z: ch.customerHopZ,
		scaleFactor: 1,
		role: "customer-smartphone",
		actionPhase: ch.customerWavePhase,
		stride: ch.customerStride
	});
	// ============================================================================
	// 8. OUTSIDE THE WAREHOUSE ROLL-UP DOOR: SMALL NAVY DELIVERY VAN WITH AN
	//    ORANGE STRIPE & TINY DELIVERY PERSON LOADING A BOX
	// ============================================================================
	// Small Navy Delivery Van with an Orange Stripe parked on the left apron in front of the warehouse
	// Oriented along the x-axis (cab at x = vanX..vanX + 14 facing down-left, rear cargo box at
	// x = vanX + 14..vanX + 46 facing the warehouse roll-up door), drawn in strict back-to-front
	// painter's order (cargo box first, cab second, wheels third, and delivery person in front)!
	// Keep the van inside the enlarged frame; the previous offset pushed its cab
	// beyond the left edge after the internal composition scale was applied.
	const vanX = -20;
	const vanY = 128;
	const vanLenX = 44;
	const vanW = 24;
	const vanZ = 5 + ch.vanBounceZ;
	// Ground shadow under van
	drawPoly([
		iso(vanX - 3, vanY - 3, .3),
		iso(vanX + vanLenX + 3, vanY - 3, .3),
		iso(vanX + vanLenX + 3, vanY + vanW + 3, .3),
		iso(vanX - 3, vanY + vanW + 3, .3)
	], "rgba(15, 23, 42, 0.22)", "none");
	// 1) Main Navy Cargo Body of the Delivery Van (x = vanX + 14..vanX + vanLenX — drawn FIRST as it has larger x)
	drawPrism(vanX + 14, vanY, vanZ, vanLenX - 14, vanW, 28, {
		top: ONLINE_STORE_PALETTE.royalBright,
		right: ONLINE_STORE_PALETTE.navyVan,
		left: ONLINE_STORE_PALETTE.navyVanDark,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.5
	});
	// Horizontal Orange Stripe along the visible front-right side of the Navy Delivery Van
	drawPoly([
		iso(vanX + 15, vanY - .2, vanZ + 6),
		iso(vanX + vanLenX - 1, vanY - .2, vanZ + 6),
		iso(vanX + vanLenX - 1, vanY - .2, vanZ + 11.5),
		iso(vanX + 15, vanY - .2, vanZ + 11.5)
	], ONLINE_STORE_PALETTE.orangeAccent, ONLINE_STORE_PALETTE.strokeNavy, 1.1);
	// Packed box loaded at the rear bumper/step of the van after the delivery person places it
	if (ch.vanLoadedBoxScale > .05) {
		const vsc = ch.vanLoadedBoxScale;
		drawCardboardBox(vanX + vanLenX - 4, vanY + 4, vanZ + 2, 8.5 * vsc, 8.5 * vsc, 8 * vsc, 1);
	}
	// 2) Van Cab at the front-left (x = vanX..vanX + 14 — drawn SECOND as smaller x is closer to viewer)
	drawPrism(vanX, vanY + 1, vanZ, 14, vanW - 2, 21, {
		top: ONLINE_STORE_PALETTE.royalBright,
		right: ONLINE_STORE_PALETTE.navyVan,
		left: ONLINE_STORE_PALETTE.navyVanDark,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Cab front windshield (facing -x) & side window (facing -y)
	drawPoly([
		iso(vanX - .15, vanY + 3.5, vanZ + 9),
		iso(vanX - .15, vanY + vanW - 3.5, vanZ + 9),
		iso(vanX - .15, vanY + vanW - 3.5, vanZ + 18),
		iso(vanX - .15, vanY + 3.5, vanZ + 18)
	], "#BAE6FD", ONLINE_STORE_PALETTE.strokeNavy, 1.15);
	drawPoly([
		iso(vanX + 3, vanY + .85, vanZ + 10),
		iso(vanX + 12, vanY + .85, vanZ + 10),
		iso(vanX + 12, vanY + .85, vanZ + 18),
		iso(vanX + 3, vanY + .85, vanZ + 18)
	], "#BAE6FD", ONLINE_STORE_PALETTE.strokeNavy, 1.15);
	// 3) Van wheels along the front-right side (y = vanY)
	const drawVanWheelX = (wx: number, wy: number) => {
		drawPrism(wx - 4.5, wy - 1.8, 0, 9, 3.6, 8.5, {
			top: "#334155",
			right: "#1E293B",
			left: "#0F172A",
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
			lineWidth: 1.2
		});
		drawPrism(wx - 2.2, wy - 2, 2.2, 4.4, 1, 4.2, {
			top: "#E2E8F0",
			right: "#E2E8F0",
			left: "#CBD5E1",
			stroke: ONLINE_STORE_PALETTE.strokeNavy,
			lineWidth: 1
		});
	};
	drawVanWheelX(vanX + 9, vanY);
	drawVanWheelX(vanX + 33, vanY);
	// 4) Tiny Delivery Person walking between the warehouse roll-up door (x = 10, y = 112)
	//    and the rear loading zone of the van (x = -6, y = 120), drawn AFTER the van because
	//    y = 112..120 < vanY = 128 (so the character is 100% visible in the foreground!)
	const loaderX = 10 - ch.loaderWalkProgress * 16;
	const loaderY = 112 + ch.loaderWalkProgress * 8;
	drawCharacter({
		x: loaderX,
		y: loaderY,
		z: 0,
		scaleFactor: .98,
		role: "delivery-loader",
		actionPhase: ch.loaderArmSwing,
		stride: ch.loaderStride,
		holdingBox: ch.loaderHasBox,
		boxLiftZ: ch.loaderBoxLiftZ,
		boxPushX: ch.loaderBoxPushX
	});
	// ============================================================================
	// 9. SEPARATE FLAT ROOF OF THE SHOP (Stopping Strictly at the Shared Wall y = SHARED_Y)
	//    + LARGE OPEN LAPTOP STANDING ON A PEDESTAL & TINY WORKER WITH WRENCH
	// ============================================================================
	// The shop roof covers the shop volume on the right (y = SHOP_Y0..SHARED_Y),
	// leaving the front-left cutaway slice (x = BLDG_X0..SHOP_ROOF_X0) open so the
	// shop interior is clearly visible, and stopping strictly at y = SHARED_Y!
	const SHOP_ROOF_X0 = BLDG_X0 + 44;
	drawPrism(SHOP_ROOF_X0, SHOP_Y0 - 2, SHOP_H - 4, BLDG_X1 - SHOP_ROOF_X0 + 2, SHARED_Y - SHOP_Y0 + 2, 8, {
		top: ONLINE_STORE_PALETTE.terracottaStucco,
		right: ONLINE_STORE_PALETTE.terracottaStuccoShade,
		left: ONLINE_STORE_PALETTE.terracottaStucco,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.55
	});
	// Recessed inner roof deck on top of the shop (stopping strictly at SHARED_Y)
	drawPoly([
		iso(SHOP_ROOF_X0 + 5, SHOP_Y0 + 4, SHOP_H + 4.2),
		iso(BLDG_X1 - 5, SHOP_Y0 + 4, SHOP_H + 4.2),
		iso(BLDG_X1 - 5, SHARED_Y - 5, SHOP_H + 4.2),
		iso(SHOP_ROOF_X0 + 5, SHARED_Y - 5, SHOP_H + 4.2)
	], "#D97706", ONLINE_STORE_PALETTE.strokeNavy, 1.25);
	// Small Pedestal under the Large Open Laptop on the Shop Roof
	const PED_X = SHOP_ROOF_X0 + 16;
	const PED_Y = SHOP_Y0 + 22;
	const PED_W = 52;
	const PED_D = 42;
	const PED_Z = SHOP_H + 4.2;
	drawPrism(PED_X, PED_Y, PED_Z, PED_W, PED_D, 7, {
		top: ONLINE_STORE_PALETTE.creamStucco,
		right: ONLINE_STORE_PALETTE.creamStuccoShade,
		left: "#FFFFFF",
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	// LARGE OPEN LAPTOP STANDING ON THE PEDESTAL ON THE SHOP ROOF (Screen facing the viewer)
	const LAP_BASE_Z = PED_Z + 7;
	const KB_X0 = SHOP_ROOF_X0 + 8;
	const KB_W = 66;
	const KB_Y0 = SHOP_Y0 + 10;
	const KB_D = 44;
	drawPrism(KB_X0, KB_Y0, LAP_BASE_Z, KB_W, KB_D, 4.5, {
		top: "#FFFFFF",
		right: "#CBD5E1",
		left: "#E2E8F0",
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.5
	});
	// Dark Navy Keyboard Key Matrix on the Laptop Base
	drawPoly([
		iso(KB_X0 + 8, KB_Y0 + 16, LAP_BASE_Z + 4.7),
		iso(KB_X0 + KB_W - 8, KB_Y0 + 16, LAP_BASE_Z + 4.7),
		iso(KB_X0 + KB_W - 8, KB_Y0 + KB_D - 6, LAP_BASE_Z + 4.7),
		iso(KB_X0 + 8, KB_Y0 + KB_D - 6, LAP_BASE_Z + 4.7)
	], ONLINE_STORE_PALETTE.navyRoof, ONLINE_STORE_PALETTE.strokeNavy, 1.15);
	for (let kr = 1; kr < 4; kr++) {
		const ky = KB_Y0 + 16 + kr * 5.5;
		drawLine(iso(KB_X0 + 9, ky, LAP_BASE_Z + 4.85), iso(KB_X0 + KB_W - 9, ky, LAP_BASE_Z + 4.85), "#93C5FD", .9);
	}
	for (let kc = 1; kc < 7; kc++) {
		const kx = KB_X0 + 8 + kc * 7.2;
		drawLine(iso(kx, KB_Y0 + 17, LAP_BASE_Z + 4.85), iso(kx, KB_Y0 + KB_D - 7, LAP_BASE_Z + 4.85), "#93C5FD", .9);
	}
	// Trackpad on the front center of the laptop base
	drawPoly([
		iso(KB_X0 + 23, KB_Y0 + 4, LAP_BASE_Z + 4.7),
		iso(KB_X0 + 43, KB_Y0 + 4, LAP_BASE_Z + 4.7),
		iso(KB_X0 + 43, KB_Y0 + 13, LAP_BASE_Z + 4.7),
		iso(KB_X0 + 23, KB_Y0 + 13, LAP_BASE_Z + 4.7)
	], "#E2E8F0", ONLINE_STORE_PALETTE.strokeNavy, 1);
	// Upright Laptop Screen Facing the Viewer
	const SCR_X0 = KB_X0;
	const SCR_W = KB_W;
	const SCR_Y = KB_Y0 + KB_D - 5;
	const SCR_Z0 = LAP_BASE_Z + 4.5;
	const SCR_H = 56;
	const SCR_Z1 = SCR_Z0 + SCR_H;
	drawPrism(SCR_X0, SCR_Y, SCR_Z0, SCR_W, 5.5, SCR_H, {
		top: ONLINE_STORE_PALETTE.royalBright,
		right: ONLINE_STORE_PALETTE.navyRoof,
		left: ONLINE_STORE_PALETTE.navyDeep,
		stroke: ONLINE_STORE_PALETTE.strokeNavy,
		lineWidth: 1.65
	});
	// White inner screen surface facing the viewer
	const sX0 = SCR_X0 + 4;
	const sX1 = SCR_X0 + SCR_W - 4;
	const sZ0 = SCR_Z0 + 4;
	const sZ1 = SCR_Z1 - 4;
	const sY = SCR_Y - .25;
	drawPoly([
		iso(sX0, sY, sZ0),
		iso(sX1, sY, sZ0),
		iso(sX1, sY, sZ1),
		iso(sX0, sY, sZ1)
	], "#FFFFFF", ONLINE_STORE_PALETTE.strokeNavy, 1.35);
	// Orange Header Strip at the top of the laptop screen
	const hdrZ0 = sZ1 - 6.2;
	drawPoly([
		iso(sX0, sY - .1, hdrZ0),
		iso(sX1, sY - .1, hdrZ0),
		iso(sX1, sY - .1, sZ1),
		iso(sX0, sY - .1, sZ1)
	], ONLINE_STORE_PALETTE.orangeAccent, ONLINE_STORE_PALETTE.strokeNavy, 1.1);
	// Grid of Product Blocks on the Laptop Screen (4 columns x 2 rows)
	const COLS = 4;
	const ROWS = 2;
	const padX = 3.5;
	const cellW = (sX1 - sX0 - padX * 2 - (COLS - 1) * 3) / COLS;
	const cellH = 11;
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLS; c++) {
			const cx0 = sX0 + padX + c * (cellW + 3);
			const cx1 = cx0 + cellW;
			const cz1 = hdrZ0 - 2.8 - r * (cellH + 4.2);
			const cz0 = cz1 - cellH;
			const isLit = ch.gridBlocksLit > (r * COLS + c) * .08;
			const blockFill = isLit ? (r + c) % 2 === 0 ? "#FDE68A" : "#BFDBFE" : "#F1F5F9";
			drawPoly([
				iso(cx0, sY - .15, cz0),
				iso(cx1, sY - .15, cz0),
				iso(cx1, sY - .15, cz1),
				iso(cx0, sY - .15, cz1)
			], blockFill, ONLINE_STORE_PALETTE.strokeNavy, 1.05);
			drawLine(iso(cx0 + 1, sY - .15, cz0 - 1.9), iso(cx1 - 1, sY - .15, cz0 - 1.9), "#94A3B8", 1.3);
		}
	}
	// Prominent Orange Button at the bottom-right of the Laptop Screen
	const btnScale = Math.max(.35, ch.orangeButtonPop);
	const btnCX = sX1 - 13.5;
	const btnCZ = sZ0 + 5;
	const btnHW = 10 * btnScale;
	const btnHH = 3.1 * btnScale;
	drawPoly([
		iso(btnCX - btnHW, sY - .2, btnCZ - btnHH),
		iso(btnCX + btnHW, sY - .2, btnCZ - btnHH),
		iso(btnCX + btnHW, sY - .2, btnCZ + btnHH),
		iso(btnCX - btnHW, sY - .2, btnCZ + btnHH)
	], ONLINE_STORE_PALETTE.orangeAccent, ONLINE_STORE_PALETTE.strokeNavy, 1.2);
	drawLine(iso(sX0 + 4, sY - .15, sZ0 + 6.2), iso(sX0 + 26, sY - .15, sZ0 + 6.2), "#64748B", 1.6);
	drawLine(iso(sX0 + 4, sY - .15, sZ0 + 3.4), iso(sX0 + 20, sY - .15, sZ0 + 3.4), "#94A3B8", 1.4);
	// Tiny Worker beside the Rooftop Laptop adjusting it with a wrench (no crane)
	drawCharacter({
		x: SCR_X0 + SCR_W + 9,
		y: SCR_Y - 5,
		z: SHOP_H + 4.5,
		scaleFactor: .92,
		role: "roof-wrench-worker",
		wrenchAngle: ch.wrenchTurnAngle,
		stride: 0
	});
	ctx.restore();
};
