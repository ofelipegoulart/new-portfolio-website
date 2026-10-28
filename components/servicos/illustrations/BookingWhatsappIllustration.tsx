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
  role: string;
  scaleFactor?: number;
  wavePhase?: number;
  nodZ?: number;
  wrenchAngle?: number;
  stride?: number;
  armLift?: number;
  opacity?: number;
  hideLegs?: boolean;
};

export interface BookingWhatsappIllustrationProps {
  /** Cor de fundo do quadro isométrico. Padrão: "#f3f0e8" */
  backgroundColor?: string;
  /** Texto alternativo descritivo em português para SEO e leitores de tela */
  alt?: string;
  /** Multiplicador de velocidade (padrão 1.0 para loop contínuo de 4.00s) */
  speed?: number;
  /** Visual scale applied inside the clipped illustration frame. */
  zoom?: number;
  /** Classes utilitárias opcionais para o container */
  className?: string;
}

/**
 * Componente Next.js leve e SEO-friendly: Agendamento Online e Automação no WhatsApp (~15 KB, 0 requisições externas)
 */
export default function BookingWhatsappIllustration({
  backgroundColor = '#f3f0e8',
  alt = 'Ilustração isométrica em loop de uma clínica de bairro térrea em corte lateral sobre base clara ladrilhada: no telhado plano, um grande smartphone em pé exibe dois balões de conversa arredondados com barras cinzas (um com check verde) e uma grade de agenda com um bloco laranja destacado, enquanto um pequeno trabalhador ao lado ajusta o aparelho; no interior, a recepcionista trabalha no computador com agenda semanal ao lado da sala de espera e, no consultório ao fundo, o médico de jaleco branco atende próximo à maca e armário de suprimentos.',
  speed = 1,
  zoom = 1,
  className = 'w-full max-w-[640px] aspect-square mx-auto',
}: BookingWhatsappIllustrationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let isVisible = true;
    let animTime = 1.45; // Renderiza o quadro com bloco laranja na agenda e check verde do WhatsApp no primeiro paint (LCP imediato)
    let lastTs: number | null = null;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    drawBookingWhatsappScene(ctx, canvas.width, canvas.height, animTime, false, backgroundColor);

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
        drawBookingWhatsappScene(ctx, canvas.width, canvas.height, animTime, false, backgroundColor);
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

const BOOKING_LOOP_DURATION = 4;
const BOOKING_PALETTE = {
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
  "potTerracottaDark": "#B45309",
  "whatsappGreen": "#22C55E",
  "whatsappGreenLight": "#DCFCE7",
  "waterJugBlue": "#7DD3FC",
  "waterJugDark": "#38BDF8"
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
  if (x === 0) return 0;
  if (x === 1) return 1;
  const c1 = 2.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function computeClinicChoreography(tSec: number) {
  const fadeOut = tSec >= 3.48 ? 1 - easeInOutCubic((tSec - 3.48) / 0.52) : 1;
  const wrenchTurnAngle =
    tSec >= 0.15 && tSec <= 2.65 ? Math.sin((tSec - 0.15) * Math.PI * 5) * 0.75 : 0;
  const patientTapMotion =
    tSec >= 0.12 && tSec <= 0.56 ? Math.sin(((tSec - 0.12) / 0.44) * Math.PI) : 0;
  const orangeBlockPop = easeOutBackPop((tSec - 0.26) / 0.28) * fadeOut;
  const receptionistNodZ =
    tSec >= 0.36 && tSec <= 1.20
      ? -Math.abs(Math.sin(((tSec - 0.36) / 0.84) * Math.PI * 2)) * 1.8
      : 0;
  const bubble1Lit = easeOutCubic((tSec - 0.65) / 0.25) * fadeOut;
  const chatBubbleLit = easeOutCubic((tSec - 0.90) / 0.25) * fadeOut;
  const greenCheckPop = easeOutBackPop((tSec - 1.08) / 0.28) * fadeOut;

  let patientX = 96;
  let patientY = -48;
  let patientStride = 0;
  let patientOpacity = 1;
  let doorSwing = 0.22;

  if (tSec < 0.20) {
    patientOpacity = easeOutCubic(tSec / 0.20);
  } else if (tSec >= 1.75 && tSec < 3.25) {
    const p = easeInOutCubic((tSec - 1.75) / 1.50);
    patientX = 96 - p * 38;
    patientY = -48 + p * 54;
    patientStride = Math.sin(((tSec - 1.75) / 1.50) * Math.PI * 6);
    const distToDoor = Math.abs(patientY - -4);
    if (distToDoor < 30) {
      doorSwing = 0.22 + 0.72 * Math.cos((distToDoor / 30) * (Math.PI / 2));
    }
  } else if (tSec >= 3.25 && tSec < 3.52) {
    patientX = 58;
    patientY = 6;
    patientStride = 0;
    doorSwing = 0.45;
  } else if (tSec >= 3.52) {
    const r = easeInOutCubic((tSec - 3.52) / 0.48);
    patientX = 58;
    patientY = 6;
    patientOpacity = 1 - r;
    doorSwing = 0.22;
  }

  const walkProgress = clamp01((patientY + 48) / 54);

  return {
    fadeOut,
    wrenchTurnAngle,
    patientTapMotion,
    orangeBlockPop,
    receptionistNodZ,
    bubble1Lit,
    chatBubbleLit,
    greenCheckPop,
    patientX,
    patientY,
    patientStride,
    patientOpacity,
    doorSwing,
    walkProgress,
  };
}

const drawBookingWhatsappScene = function drawBookingWhatsappScene(
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
	const scale = width / 1e3;
	ctx.scale(scale, scale);
	// Centered isometric origin for the wide single-story stepped neighborhood clinic
	const originX = 485;
	const originY = 735;
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
		const st = colors.stroke ?? BOOKING_PALETTE.strokeNavy;
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
	const ch = computeClinicChoreography(tSec);
	const harmonic = Math.sin(tSec / BOOKING_LOOP_DURATION * Math.PI * 2);
	const waveHarmonic = Math.sin(tSec / BOOKING_LOOP_DURATION * Math.PI * 8);
	/**
	* Draws tiny blocky navy-and-white characters at the exact same small scale as the style reference,
	* each doing a small action (receptionist typing/nodding, seated waiting patient, doctor in white coat
	* waving in consulting room, sidewalk patient holding smartphone, roof worker adjusting phone).
	*/
	const drawCharacter = (opts: CharacterOptions) => {
		const { x, y, z, scaleFactor = 1, role, wavePhase = 0, stride = 0, nodZ = 0, wrenchAngle = 0, opacity = 1 } = opts;
		ctx.save();
		ctx.globalAlpha = opacity;
		const s = scaleFactor;
		const legSpread = stride * 3.6 * s;
		const isDoctor = role === "doctor-white-coat";
		// Ground contact shadow
		drawPoly([
			iso(x - 6 * s, y - 6 * s, z + .3),
			iso(x + 6 * s, y - 6 * s, z + .3),
			iso(x + 6 * s, y + 6 * s, z + .3),
			iso(x - 6 * s, y + 6 * s, z + .3)
		], "rgba(21, 39, 94, 0.20)", "none");
		// Left leg
		drawPrism(x - 3.8 * s, y - 2.4 * s + legSpread, z, 3.4 * s, 4.4 * s, 2.5 * s, {
			top: "#FFFFFF",
			right: "#E2E8F0",
			left: "#FFFFFF",
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		drawPrism(x - 3.8 * s, y - 2.4 * s + legSpread, z + 2.5 * s, 3.4 * s, 4.4 * s, 8.8 * s, {
			top: BOOKING_PALETTE.royalBright,
			right: BOOKING_PALETTE.navyRoof,
			left: BOOKING_PALETTE.royalFacade,
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		// Right leg
		drawPrism(x + .4 * s, y - 2.4 * s - legSpread, z, 3.4 * s, 4.4 * s, 2.5 * s, {
			top: "#FFFFFF",
			right: "#CBD5E1",
			left: "#FFFFFF",
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		drawPrism(x + .4 * s, y - 2.4 * s - legSpread, z + 2.5 * s, 3.4 * s, 4.4 * s, 8.8 * s, {
			top: BOOKING_PALETTE.royalBright,
			right: BOOKING_PALETTE.navyRoof,
			left: BOOKING_PALETTE.royalFacade,
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		// Torso (White medical coat for the doctor, navy/royal blue & white for others)
		drawPrism(x - 4.8 * s, y - 3.4 * s, z + 11.3 * s, 9.6 * s, 6.8 * s, 13 * s, {
			top: isDoctor ? "#FFFFFF" : BOOKING_PALETTE.royalBright,
			right: isDoctor ? "#E2E8F0" : BOOKING_PALETTE.royalFacade,
			left: "#FFFFFF",
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.4
		});
		if (isDoctor) {
			// Doctor's blue scrub V-neck / lapel stripe
			drawPrism(x - 1.6 * s, y - 3.55 * s, z + 13 * s, 3.2 * s, .4 * s, 10.5 * s, {
				top: BOOKING_PALETTE.royalBright,
				right: BOOKING_PALETTE.royalFacade,
				left: BOOKING_PALETTE.royalBright,
				stroke: BOOKING_PALETTE.strokeNavy,
				lineWidth: 1
			});
		}
		// Collar strip
		drawPrism(x - 4.9 * s, y - 3.5 * s, z + 22.8 * s, 9.8 * s, 7 * s, 1.8 * s, {
			top: "#FFFFFF",
			right: "#E2E8F0",
			left: "#FFFFFF",
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.2
		});
		// Left Arm (Extended with wrench for the tiny worker on the flat roof adjusting the phone)
		if (role === "roof-wrench-worker") {
			const armZ = z + 16.5 * s + wrenchAngle * 1.6;
			drawPrism(x - 9.2 * s, y - 2.2 * s, armZ, 5 * s, 4 * s, 3.8 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: BOOKING_PALETTE.strokeNavy,
				lineWidth: 1.25
			});
			const wrX = x - 11.5 * s;
			const wrY = y - 1 * s;
			const wrZ = armZ + 2.5 * s;
			drawLine(iso(wrX + 2.5 * s, wrY, wrZ - 2 * s), iso(wrX - 3.5 * s, wrY, wrZ + 6.5 * s + wrenchAngle * 2.2), BOOKING_PALETTE.strokeNavy, 4);
			drawLine(iso(wrX + 2.5 * s, wrY, wrZ - 2 * s), iso(wrX - 3.5 * s, wrY, wrZ + 6.5 * s + wrenchAngle * 2.2), "#E2E8F0", 2.2);
			const headX = wrX - 3.8 * s;
			const headZ = wrZ + 7 * s + wrenchAngle * 2.2;
			drawPoly([
				iso(headX - 2.4, wrY, headZ + 2.4),
				iso(headX + 2.4, wrY, headZ + 2.4),
				iso(headX + 2.4, wrY, headZ - 2.4),
				iso(headX - 2.4, wrY, headZ - 2.4)
			], "#CBD5E1", BOOKING_PALETTE.strokeNavy, 1.15);
		} else {
			drawPrism(x - 7.4 * s, y - 2.4 * s, z + 13.8 * s, 2.6 * s, 4.8 * s, 9 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: BOOKING_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		}
		// Right Arm
		if (role === "receptionist" || role === "doctor-white-coat") {
			const waveLift = (4.2 + wavePhase * 2.2) * s;
			const waveOut = (1.4 + wavePhase * 1.6) * s;
			drawPrism(x + 4.8 * s, y - 2.4 * s, z + 19 * s, 4.2 * s, 4.2 * s, 4 * s, {
				top: "#FFFFFF",
				right: isDoctor ? "#E2E8F0" : BOOKING_PALETTE.royalFacade,
				left: "#FFFFFF",
				stroke: BOOKING_PALETTE.strokeNavy,
				lineWidth: 1.35
			});
			drawPrism(x + 6.4 * s + waveOut * .4, y - 2.2 * s, z + 21 * s + waveLift * .4, 3.2 * s, 3.8 * s, 8 * s, {
				top: "#FFFFFF",
				right: "#E2E8F0",
				left: "#FFFFFF",
				stroke: BOOKING_PALETTE.strokeNavy,
				lineWidth: 1.4
			});
		} else if (role === "patient-smartphone") {
			drawPrism(x + 4.8 * s, y - 3.2 * s, z + 16.5 * s + ch.patientTapMotion * 1.6, 4.5 * s, 5.2 * s, 4.2 * s, {
				top: "#FFFFFF",
				right: BOOKING_PALETTE.royalFacade,
				left: "#FFFFFF",
				stroke: BOOKING_PALETTE.strokeNavy,
				lineWidth: 1.35
			});
			// Handheld smartphone held by the sidewalk patient
			const phX0 = x + 9.5 * s;
			const phW = 19;
			const phY = y - 6.5 * s;
			const phZ0 = z + 10.5 * s;
			const phH = 28;
			drawPrism(phX0, phY, phZ0, phW, 2.4, phH, {
				top: BOOKING_PALETTE.royalBright,
				right: BOOKING_PALETTE.navyRoof,
				left: BOOKING_PALETTE.navyDeep,
				stroke: BOOKING_PALETTE.strokeNavy,
				lineWidth: 1.4
			});
			const scX0 = phX0 + 1.8;
			const scX1 = phX0 + phW - 1.8;
			const scY = phY - .25;
			const scZ0 = phZ0 + 2.4;
			const scZ1 = phZ0 + phH - 2.4;
			drawPoly([
				iso(scX0, scY, scZ0),
				iso(scX1, scY, scZ0),
				iso(scX1, scY, scZ1),
				iso(scX0, scY, scZ1)
			], "#FFFFFF", BOOKING_PALETTE.strokeNavy, 1.15);
			// Top bar on smartphone screen
			drawPoly([
				iso(scX0 + 1, scY - .1, scZ1 - 3.2),
				iso(scX1 - 1, scY - .1, scZ1 - 3.2),
				iso(scX1 - 1, scY - .1, scZ1 - 1),
				iso(scX0 + 1, scY - .1, scZ1 - 1)
			], BOOKING_PALETTE.navyRoof);
			// Chat bubble with gray bars + small green check mark inside the smartphone screen
			const cbZ0 = scZ1 - 10.2;
			const cbZ1 = scZ1 - 4.2;
			drawPoly([
				iso(scX0 + 1.4, scY - .12, cbZ0),
				iso(scX1 - 1.4, scY - .12, cbZ0),
				iso(scX1 - 1.4, scY - .12, cbZ1),
				iso(scX0 + 1.4, scY - .12, cbZ1)
			], ch.chatBubbleLit > .1 ? "#ECFDF5" : "#F1F5F9", BOOKING_PALETTE.strokeNavy, .95);
			drawLine(iso(scX0 + 2.6, scY - .16, cbZ1 - 2.2), iso(scX1 - 6.2, scY - .16, cbZ1 - 2.2), "#94A3B8", 1.4);
			drawLine(iso(scX0 + 2.6, scY - .16, cbZ0 + 1.8), iso(scX1 - 7.8, scY - .16, cbZ0 + 1.8), "#CBD5E1", 1.3);
			// Small green check mark badge inside the chat bubble on the phone screen
			const chkScale = Math.max(.25, ch.greenCheckPop);
			const chkCX = scX1 - 3.6;
			const chkCZ = (cbZ0 + cbZ1) / 2;
			const chkR = 2.2 * chkScale;
			const chkPts = [];
			for (let i = 0; i < 14; i++) {
				const a = i / 14 * Math.PI * 2;
				chkPts.push(iso(chkCX + Math.cos(a) * chkR, scY - .2, chkCZ + Math.sin(a) * chkR));
			}
			drawPoly(chkPts, BOOKING_PALETTE.whatsappGreen, BOOKING_PALETTE.strokeNavy, .9);
			drawLine(iso(chkCX - 1 * chkScale, scY - .24, chkCZ), iso(chkCX - .2 * chkScale, scY - .24, chkCZ - .9 * chkScale), "#FFFFFF", 1.3);
			drawLine(iso(chkCX - .2 * chkScale, scY - .24, chkCZ - .9 * chkScale), iso(chkCX + 1.2 * chkScale, scY - .24, chkCZ + 1 * chkScale), "#FFFFFF", 1.3);
			// Calendar grid on lower half of patient's smartphone screen with ONE orange block
			const calZ0 = scZ0 + 1.4;
			const calZ1 = cbZ0 - 1.2;
			drawPoly([
				iso(scX0 + 1.4, scY - .12, calZ0),
				iso(scX1 - 1.4, scY - .12, calZ0),
				iso(scX1 - 1.4, scY - .12, calZ1),
				iso(scX0 + 1.4, scY - .12, calZ1)
			], "#F8FAFC", BOOKING_PALETTE.strokeNavy, .95);
			for (let mc = 0; mc < 3; mc++) {
				for (let mr = 0; mr < 2; mr++) {
					const cx0 = scX0 + 2.2 + mc * 3.8;
					const cx1 = cx0 + 3;
					const cz0 = calZ0 + 1.2 + mr * 3.5;
					const cz1 = cz0 + 2.6;
					const isOrange = mc === 1 && mr === 1;
					drawPoly([
						iso(cx0, scY - .16, cz0),
						iso(cx1, scY - .16, cz0),
						iso(cx1, scY - .16, cz1),
						iso(cx0, scY - .16, cz1)
					], isOrange && ch.orangeBlockPop > .15 ? BOOKING_PALETTE.orangeAccent : (mc + mr) % 2 === 0 ? "#93C5FD" : "#CBD5E1");
				}
			}
		} else {
			drawPrism(x + 4.8 * s, y - 2.4 * s, z + 13.8 * s, 2.6 * s, 4.8 * s, 9 * s, {
				top: "#FFFFFF",
				right: "#CBD5E1",
				left: "#FFFFFF",
				stroke: BOOKING_PALETTE.strokeNavy,
				lineWidth: 1.3
			});
		}
		// Head
		drawPrism(x - 4 * s, y - 3.3 * s, z + (24.6 + nodZ) * s, 8 * s, 6.6 * s, 8.8 * s, {
			top: "#FFFFFF",
			right: "#F1F5F9",
			left: "#FFFFFF",
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.4
		});
		// Cap / Hair / Hard-hat top
		const isHardHat = role === "roof-wrench-worker";
		drawPrism(x - 4.4 * s, y - 3.7 * s, z + (32.5 + nodZ) * s, 8.8 * s, 7.4 * s, 3 * s, {
			top: isHardHat ? BOOKING_PALETTE.royalBright : BOOKING_PALETTE.navyRoof,
			right: BOOKING_PALETTE.navyDeep,
			left: BOOKING_PALETTE.royalFacade,
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.35
		});
		ctx.restore();
	};
	const drawPottedPlant = (px: number, py: number, pz: number, sway: number, scaleP = 1) => {
		drawPoly([
			iso(px - 8 * scaleP, py - 8 * scaleP, pz + .2),
			iso(px + 8 * scaleP, py - 8 * scaleP, pz + .2),
			iso(px + 8 * scaleP, py + 8 * scaleP, pz + .2),
			iso(px - 8 * scaleP, py + 8 * scaleP, pz + .2)
		], "rgba(15, 23, 42, 0.16)", "none");
		drawPrism(px - 6.5 * scaleP, py - 6.5 * scaleP, pz, 13 * scaleP, 13 * scaleP, 11 * scaleP, {
			top: BOOKING_PALETTE.potTerracotta,
			right: BOOKING_PALETTE.potTerracottaDark,
			left: BOOKING_PALETTE.orangeAccent,
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		drawPrism(px - 7.8 * scaleP, py - 7.8 * scaleP, pz + 10 * scaleP, 15.6 * scaleP, 15.6 * scaleP, 3.5 * scaleP, {
			top: BOOKING_PALETTE.orangeAccent,
			right: BOOKING_PALETTE.potTerracottaDark,
			left: BOOKING_PALETTE.potTerracotta,
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		const leafZ = pz + 13.5 * scaleP;
		drawPoly([
			iso(px, py, leafZ),
			iso(px + (-10 + sway) * scaleP, py + 4 * scaleP, leafZ + 8 * scaleP),
			iso(px + (-8 + sway) * scaleP, py - 2 * scaleP, leafZ + 17 * scaleP),
			iso(px - 1 * scaleP, py - 2 * scaleP, leafZ + 10 * scaleP)
		], BOOKING_PALETTE.plantGreenMid, BOOKING_PALETTE.strokeNavy, 1.3);
		drawPoly([
			iso(px, py, leafZ),
			iso(px + (10 + sway) * scaleP, py - 4 * scaleP, leafZ + 8 * scaleP),
			iso(px + (8 + sway) * scaleP, py + 2 * scaleP, leafZ + 17 * scaleP),
			iso(px + 1 * scaleP, py + 2 * scaleP, leafZ + 10 * scaleP)
		], BOOKING_PALETTE.plantGreenDark, BOOKING_PALETTE.strokeNavy, 1.3);
		drawPoly([
			iso(px - 4 * scaleP, py - 3 * scaleP, leafZ + 2 * scaleP),
			iso(px + sway * 1.2 * scaleP, py, leafZ + 23 * scaleP),
			iso(px + 4 * scaleP, py + 3 * scaleP, leafZ + 2 * scaleP)
		], BOOKING_PALETTE.plantGreenLight, BOOKING_PALETTE.strokeNavy, 1.35);
	};
	// ============================================================================
	// DISTINCT BUILDING DIMENSIONS: WIDE SINGLE-STORY STEPPED NEIGHBORHOOD CLINIC
	// - Front/Left Wing (Reception & Waiting Room): x = 0..104, y = 0..158, height Z = 96
	// - Back/Right Wing (Consulting Room): x = 104..216, y = 0..158, stepped height Z = 114
	// ============================================================================
	const BX_SPLIT = 104;
	const BX_TOTAL = 216;
	const BY_TOTAL = 158;
	const RECEPTION_H = 96;
	const CONSULT_H = 114;
	const WAINSCOT_H = 24;
	const WALL_T = 7;
	// ============================================================================
	// 1. THIN LIGHT BASE PLATE WITH TILE LINES AND OUTLINE
	// ============================================================================
	const GX0 = -36;
	const GX1 = BX_TOTAL + 42;
	const GY0 = -76;
	const GY1 = BY_TOTAL + 36;
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
	// Tile lines on the front sidewalk and left walkway
	drawLine(iso(GX0, 0, .2), iso(GX1, 0, .2), "#CBD5E1", 1.2);
	drawLine(iso(GX0, -38, .2), iso(GX1, -38, .2), "#E2E8F0", 1.1);
	for (let tx = GX0 + 34; tx < GX1; tx += 34) {
		drawLine(iso(tx, 0, .2), iso(tx, GY0, .2), "#E2E8F0", 1);
	}
	for (let ty = 0; ty <= GY1; ty += 34) {
		drawLine(iso(GX0, ty, .2), iso(0, ty, .2), "#E2E8F0", 1);
	}
	if (showGuides) {
		for (let gx = GX0; gx <= GX1; gx += 28) {
			drawLine(iso(gx, GY0, 0), iso(gx, GY1, 0), "rgba(37, 99, 235, 0.14)", 1, [3, 3]);
		}
		for (let gy = GY0; gy <= GY1; gy += 28) {
			drawLine(iso(GX0, gy, 0), iso(GX1, gy, 0), "rgba(37, 99, 235, 0.14)", 1, [3, 3]);
		}
	}
	// ============================================================================
	// 2. WARM YELLOW-LIT CLINIC FLOOR & STEPPED BACK WALLS
	// ============================================================================
	// Reception Wing Back Wall (x = 0..BX_SPLIT, y = BY_TOTAL, z = 0..RECEPTION_H)
	drawPoly([
		iso(0, BY_TOTAL, 0),
		iso(BX_SPLIT, BY_TOTAL, 0),
		iso(BX_SPLIT, BY_TOTAL, RECEPTION_H),
		iso(0, BY_TOTAL, RECEPTION_H)
	], BOOKING_PALETTE.warmInteriorWall, BOOKING_PALETTE.strokeNavy, 1.5);
	// Consulting Room Stepped Back Wall (x = BX_SPLIT..BX_TOTAL, y = BY_TOTAL, z = 0..CONSULT_H)
	drawPoly([
		iso(BX_SPLIT, BY_TOTAL, 0),
		iso(BX_TOTAL, BY_TOTAL, 0),
		iso(BX_TOTAL, BY_TOTAL, CONSULT_H),
		iso(BX_SPLIT, BY_TOTAL, CONSULT_H)
	], BOOKING_PALETTE.warmInteriorWall, BOOKING_PALETTE.strokeNavy, 1.5);
	// Rightmost Interior End Wall (x = BX_TOTAL, y = 0..BY_TOTAL, z = 0..CONSULT_H)
	drawPoly([
		iso(BX_TOTAL, 0, 0),
		iso(BX_TOTAL, BY_TOTAL, 0),
		iso(BX_TOTAL, BY_TOTAL, CONSULT_H),
		iso(BX_TOTAL, 0, CONSULT_H)
	], "#FDE68A", BOOKING_PALETTE.strokeNavy, 1.5);
	// Warm Yellow Interior Floor across both rooms
	drawPoly([
		iso(0, 0, 1),
		iso(BX_TOTAL, 0, 1),
		iso(BX_TOTAL, BY_TOTAL, 1),
		iso(0, BY_TOTAL, 1)
	], BOOKING_PALETTE.warmInteriorFloor, BOOKING_PALETTE.strokeNavy, 1.4);
	// Subtle floor tile grid inside the clinic
	for (let fx = 26; fx < BX_TOTAL; fx += 26) {
		drawLine(iso(fx, 2, 1.2), iso(fx, BY_TOTAL - 2, 1.2), "rgba(217, 119, 6, 0.16)", 1);
	}
	for (let fy = 26; fy < BY_TOTAL; fy += 26) {
		drawLine(iso(2, fy, 1.2), iso(BX_TOTAL - 2, fy, 1.2), "rgba(217, 119, 6, 1.2)", 1);
	}
	// Warm light spill onto the front sidewalk outside the entrance and large window
	drawPoly([
		iso(36, 0, .3),
		iso(196, 0, .3),
		iso(202, -28, .3),
		iso(30, -28, .3)
	], "rgba(254, 240, 138, 0.45)", "none");
	// ============================================================================
	// 3. ROOM B (RIGHT/BACK WING): CONSULTING ROOM WITH DENSE MEDICAL DETAILS
	//    (x = 104..216, y = 0..158)
	// ============================================================================
	// Back-wall framed window inside the consulting room (lit warm yellow)
	drawPoly([
		iso(118, BY_TOTAL - .5, 44),
		iso(146, BY_TOTAL - .5, 44),
		iso(146, BY_TOTAL - .5, 86),
		iso(118, BY_TOTAL - .5, 86)
	], BOOKING_PALETTE.royalBright, BOOKING_PALETTE.strokeNavy, 1.3);
	drawPoly([
		iso(120.5, BY_TOTAL - .8, 46.5),
		iso(143.5, BY_TOTAL - .8, 46.5),
		iso(143.5, BY_TOTAL - .8, 83.5),
		iso(120.5, BY_TOTAL - .8, 83.5)
	], "#FEF9C3", BOOKING_PALETTE.strokeNavy, 1.1);
	// Large Multi-Tier Medical Supply Cabinet & Shelves on the Consulting Room Back Wall
	const drawDenseSupplyCabinet = (sx: number, sy: number, sz: number) => {
		const cabW = 54;
		const cabD = 15;
		const baseH = 22;
		const totalH = 68;
		// Lower closed cabinet with doors
		drawPrism(sx, sy, sz, cabW, cabD, baseH, {
			top: "#FEF3C7",
			right: BOOKING_PALETTE.warmWoodDark,
			left: BOOKING_PALETTE.warmWoodLight,
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.3
		});
		// Upper shelving frame
		drawPrism(sx, sy + 2, sz + baseH, cabW, cabD - 2, totalH - baseH, {
			top: "#FDE68A",
			right: BOOKING_PALETTE.warmWoodMid,
			left: BOOKING_PALETTE.warmWoodLight,
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.25
		});
		// 3 tiers of dense medical bottles, boxes, and jars
		for (let tier = 0; tier < 3; tier++) {
			const tz = sz + baseH + tier * 15;
			drawPrism(sx - 1, sy + 1, tz, cabW + 2, cabD, 2.5, {
				top: "#FEF9C3",
				right: BOOKING_PALETTE.warmWoodDark,
				left: BOOKING_PALETTE.warmWoodLight,
				stroke: BOOKING_PALETTE.strokeNavy,
				lineWidth: 1.05
			});
			for (let item = 0; item < 4; item++) {
				const ix = sx + 4 + item * 12.2;
				const iy = sy + 2;
				const iz = tz + 2.5;
				const paletteChoice = (tier + item) % 4;
				const itemCol = paletteChoice === 0 ? {
					top: "#FFFFFF",
					right: BOOKING_PALETTE.orangeShade,
					left: BOOKING_PALETTE.orangeAccent
				} : paletteChoice === 1 ? {
					top: "#FFFFFF",
					right: BOOKING_PALETTE.navyRoof,
					left: BOOKING_PALETTE.royalBright
				} : paletteChoice === 2 ? {
					top: "#FFFFFF",
					right: "#CBD5E1",
					left: "#FFFFFF"
				} : {
					top: "#FFFFFF",
					right: BOOKING_PALETTE.plantGreenDark,
					left: BOOKING_PALETTE.plantGreenMid
				};
				drawPrism(ix, iy, iz, 8.5, 8.5, 9, {
					...itemCol,
					stroke: BOOKING_PALETTE.strokeNavy,
					lineWidth: 1
				});
			}
		}
	};
	drawDenseSupplyCabinet(154, BY_TOTAL - 18, 2);
	// Examination Bed in Consulting Room (with navy base, crisp white mattress, blue sheet band & pillow)
	const bedX = 114;
	const bedY = 92;
	const bedW = 34;
	const bedD = 54;
	drawPrism(bedX, bedY, 2, bedW, bedD, 11, {
		top: "#E2E8F0",
		right: BOOKING_PALETTE.navyRoof,
		left: BOOKING_PALETTE.royalFacade,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	drawPrism(bedX - 1, bedY - 1, 13, bedW + 2, bedD + 2, 5.5, {
		top: "#FFFFFF",
		right: "#E2E8F0",
		left: "#FFFFFF",
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.35
	});
	// Royal blue sanitary sheet runner across the lower half of the examination bed
	drawPrism(bedX - 1.2, bedY + 6, 13.2, bedW + 2.4, 16, 5.6, {
		top: BOOKING_PALETTE.royalBright,
		right: BOOKING_PALETTE.navyRoof,
		left: BOOKING_PALETTE.royalFacade,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.2
	});
	// Raised white pillow at the head of the bed
	drawPrism(bedX + 4, bedY + bedD - 14, 18.5, bedW - 8, 11, 4, {
		top: "#FFFFFF",
		right: "#CBD5E1",
		left: "#E2E8F0",
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.15
	});
	// Rolling Medical Instrument Cart beside the examination bed
	drawPrism(114, 64, 2, 18, 16, 18, {
		top: "#FFFFFF",
		right: "#CBD5E1",
		left: "#E2E8F0",
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.2
	});
	drawPrism(117, 67, 20, 6, 6, 6.5, {
		top: "#FFFFFF",
		right: BOOKING_PALETTE.orangeShade,
		left: BOOKING_PALETTE.orangeAccent,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1
	});
	drawPrism(125, 67, 20, 5, 5, 5, {
		top: "#FFFFFF",
		right: BOOKING_PALETTE.navyRoof,
		left: BOOKING_PALETTE.royalBright,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1
	});
	// Tiny Doctor in a White Coat next to the examination bed and supply shelf
	drawCharacter({
		x: 158 + harmonic * 2.5,
		y: 96,
		z: 2,
		scaleFactor: 1.04,
		role: "doctor-white-coat",
		wavePhase: waveHarmonic,
		stride: Math.cos(tSec / BOOKING_LOOP_DURATION * Math.PI * 2) * .3
	});
	// Doctor's Consultation Desk & Chair on the right wall of the consulting room
	const docDeskX = 176;
	const docDeskY = 44;
	drawPrism(docDeskX, docDeskY, 2, 32, 48, 19, {
		top: "#FEF3C7",
		right: BOOKING_PALETTE.warmWoodDark,
		left: BOOKING_PALETTE.warmWoodLight,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.35
	});
	// Laptop / Monitor on the doctor's desk
	drawPrism(docDeskX + 8, docDeskY + 18, 21, 12, 14, 10, {
		top: "#FFFFFF",
		right: BOOKING_PALETTE.navyRoof,
		left: BOOKING_PALETTE.royalBright,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.15
	});
	// Medical chart display board on the right consulting room wall
	drawPoly([
		iso(BX_TOTAL - .6, 52, 44),
		iso(BX_TOTAL - .6, 88, 44),
		iso(BX_TOTAL - .6, 88, 74),
		iso(BX_TOTAL - .6, 52, 74)
	], BOOKING_PALETTE.navyRoof, BOOKING_PALETTE.strokeNavy, 1.3);
	drawPoly([
		iso(BX_TOTAL - .9, 55, 47),
		iso(BX_TOTAL - .9, 85, 47),
		iso(BX_TOTAL - .9, 85, 71),
		iso(BX_TOTAL - .9, 55, 71)
	], "#FFFFFF", BOOKING_PALETTE.strokeNavy, 1);
	// Abstract chart bars on the medical board
	drawPoly([
		iso(BX_TOTAL - 1.1, 58, 52),
		iso(BX_TOTAL - 1.1, 68, 52),
		iso(BX_TOTAL - 1.1, 68, 66),
		iso(BX_TOTAL - 1.1, 58, 66)
	], "#93C5FD");
	drawPoly([
		iso(BX_TOTAL - 1.1, 72, 52),
		iso(BX_TOTAL - 1.1, 81, 52),
		iso(BX_TOTAL - 1.1, 81, 61),
		iso(BX_TOTAL - 1.1, 72, 61)
	], BOOKING_PALETTE.orangeAccent);
	// ============================================================================
	// 4. INTERIOR PARTITION WALL BETWEEN RECEPTION AND CONSULTING ROOM (x = BX_SPLIT)
	// ============================================================================
	// Back section of partition wall (y = 58..BY_TOTAL)
	drawPrism(BX_SPLIT - 3, 56, 2, 6, BY_TOTAL - 56, RECEPTION_H - 2, {
		top: BOOKING_PALETTE.creamStucco,
		right: "#FDE68A",
		left: BOOKING_PALETTE.warmInteriorWall,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	// Framed interior doorway header (y = 22..56, z = 62..RECEPTION_H)
	drawPrism(BX_SPLIT - 3, 22, 62, 6, 34, RECEPTION_H - 62, {
		top: BOOKING_PALETTE.creamStucco,
		right: "#FDE68A",
		left: BOOKING_PALETTE.warmInteriorWall,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.35
	});
	// Front stub of partition wall (y = 0..22)
	drawPrism(BX_SPLIT - 3, 0, 2, 6, 22, RECEPTION_H - 2, {
		top: BOOKING_PALETTE.creamStucco,
		right: "#FDE68A",
		left: BOOKING_PALETTE.warmInteriorWall,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	// Wooden door frame trim on the interior partition doorway
	drawLine(iso(BX_SPLIT - 3.2, 22, 2), iso(BX_SPLIT - 3.2, 22, 62), BOOKING_PALETTE.warmWoodDark, 2.2);
	drawLine(iso(BX_SPLIT - 3.2, 56, 2), iso(BX_SPLIT - 3.2, 56, 62), BOOKING_PALETTE.warmWoodDark, 2.2);
	drawLine(iso(BX_SPLIT - 3.2, 22, 62), iso(BX_SPLIT - 3.2, 56, 62), BOOKING_PALETTE.warmWoodDark, 2.2);
	// Wall-mounted Weekly Calendar Grid on the interior partition wall (facing the reception room)
	const wcY0 = 76;
	const wcY1 = 114;
	const wcZ0 = 46;
	const wcZ1 = 76;
	const wcX = BX_SPLIT - 3.4;
	drawPoly([
		iso(wcX, wcY0, wcZ0),
		iso(wcX, wcY1, wcZ0),
		iso(wcX, wcY1, wcZ1),
		iso(wcX, wcY0, wcZ1)
	], "#FFFFFF", BOOKING_PALETTE.strokeNavy, 1.3);
	// Orange top strip on wall calendar
	drawPoly([
		iso(wcX - .1, wcY0, wcZ1 - 5),
		iso(wcX - .1, wcY1, wcZ1 - 5),
		iso(wcX - .1, wcY1, wcZ1),
		iso(wcX - .1, wcY0, wcZ1)
	], BOOKING_PALETTE.orangeAccent, BOOKING_PALETTE.strokeNavy, 1.1);
	// Grid cells on wall calendar with one orange block highlighted
	for (let wy = 0; wy < 4; wy++) {
		for (let wz = 0; wz < 3; wz++) {
			const cy0 = wcY0 + 3 + wy * 8.2;
			const cy1 = cy0 + 6.4;
			const cz0 = wcZ0 + 2.5 + wz * 7;
			const cz1 = cz0 + 5.2;
			const isHighlighted = wy === 2 && wz === 1;
			drawPoly([
				iso(wcX - .2, cy0, cz0),
				iso(wcX - .2, cy1, cz0),
				iso(wcX - .2, cy1, cz1),
				iso(wcX - .2, cy0, cz1)
			], isHighlighted && ch.orangeBlockPop > .15 ? BOOKING_PALETTE.orangeAccent : (wy + wz) % 2 === 0 ? "#93C5FD" : "#E2E8F0");
		}
	}
	// ============================================================================
	// 5. ROOM A (LEFT/FRONT WING): RECEPTION & WAITING ROOM WITH DENSE DETAILS
	//    (x = 0..104, y = 0..158)
	// ============================================================================
	// Back-wall framed window on the left side of the reception room
	drawPoly([
		iso(14, BY_TOTAL - .5, 42),
		iso(42, BY_TOTAL - .5, 42),
		iso(42, BY_TOTAL - .5, 78),
		iso(14, BY_TOTAL - .5, 78)
	], BOOKING_PALETTE.royalBright, BOOKING_PALETTE.strokeNavy, 1.3);
	drawPoly([
		iso(16.5, BY_TOTAL - .8, 44.5),
		iso(39.5, BY_TOTAL - .8, 44.5),
		iso(39.5, BY_TOTAL - .8, 75.5),
		iso(16.5, BY_TOTAL - .8, 75.5)
	], "#FEF9C3", BOOKING_PALETTE.strokeNavy, 1.1);
	// Tall Bookcase / Patient Records Cabinet on the Reception Back Wall
	drawDenseSupplyCabinet(48, BY_TOTAL - 18, 2);
	// Small potted plant on top of the reception bookcase
	const plantSway = Math.sin(tSec / BOOKING_LOOP_DURATION * Math.PI * 2) * 1.1;
	drawPottedPlant(58, BY_TOTAL - 11, 70, plantSway * .6, .62);
	// Water Cooler Dispenser in the Left Corner of the Reception Room (x = 12, y = 132)
	drawPrism(10, 128, 2, 14, 14, 22, {
		top: "#FFFFFF",
		right: "#CBD5E1",
		left: "#FFFFFF",
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.25
	});
	// Blue water jug on top of the dispenser
	drawPrism(12, 130, 24, 10, 10, 14, {
		top: "#BAE6FD",
		right: BOOKING_PALETTE.waterJugDark,
		left: BOOKING_PALETTE.waterJugBlue,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.2
	});
	// Indoor Potted Plant beside the water cooler
	drawPottedPlant(32, 136, 2, plantSway * .7, .78);
	// Tiny Receptionist behind the reception desk
	drawCharacter({
		x: 42,
		y: 102,
		z: 2,
		scaleFactor: 1.04,
		role: "receptionist",
		wavePhase: waveHarmonic,
		nodZ: ch.receptionistNodZ,
		stride: 0
	});
	// Reception Desk (Warm wood & cream top)
	const rDeskX = 22;
	const rDeskY = 74;
	const rDeskW = 54;
	const rDeskD = 20;
	drawPrism(rDeskX, rDeskY, 2, rDeskW, rDeskD, 20, {
		top: "#FEF3C7",
		right: BOOKING_PALETTE.warmWoodDark,
		left: BOOKING_PALETTE.warmWoodLight,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	// Front white inset panel on the reception counter
	drawPoly([
		iso(rDeskX + 4, rDeskY - .2, 5),
		iso(rDeskX + rDeskW - 4, rDeskY - .2, 5),
		iso(rDeskX + rDeskW - 4, rDeskY - .2, 19),
		iso(rDeskX + 4, rDeskY - .2, 19)
	], "#FFFFFF", BOOKING_PALETTE.strokeNavy, 1.15);
	// Glowing Computer Monitor on the Reception Desk showing Weekly Calendar Grid + 1 Orange Block
	const monX = 42;
	const monY = 78;
	const monZ = 22;
	drawPrism(monX + 6, monY + 3, monZ, 6, 5, 3.5, {
		top: "#CBD5E1",
		right: BOOKING_PALETTE.navyRoof,
		left: "#94A3B8",
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.1
	});
	drawPrism(monX, monY, monZ + 3, 21, 3.2, 15.5, {
		top: BOOKING_PALETTE.royalBright,
		right: BOOKING_PALETTE.navyRoof,
		left: BOOKING_PALETTE.royalFacade,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.3
	});
	const mScreenY = monY - .25;
	drawPoly([
		iso(monX + 1.6, mScreenY, monZ + 4.4),
		iso(monX + 19.4, mScreenY, monZ + 4.4),
		iso(monX + 19.4, mScreenY, monZ + 17),
		iso(monX + 1.6, mScreenY, monZ + 17)
	], "#FFFFFF", BOOKING_PALETTE.strokeNavy, 1.05);
	drawPoly([
		iso(monX + 2.2, mScreenY - .1, monZ + 14.5),
		iso(monX + 18.8, mScreenY - .1, monZ + 14.5),
		iso(monX + 18.8, mScreenY - .1, monZ + 16.4),
		iso(monX + 2.2, mScreenY - .1, monZ + 16.4)
	], BOOKING_PALETTE.navyRoof);
	// Weekly calendar grid of colored blocks on receptionist's monitor (3 cols x 2 rows)
	for (let col = 0; col < 3; col++) {
		for (let row = 0; row < 2; row++) {
			const cx0 = monX + 2.6 + col * 5.3;
			const cx1 = cx0 + 4.4;
			const cz0 = monZ + 5.4 + row * 4.2;
			const cz1 = cz0 + 3.2;
			const isHighlightedOrange = col === 1 && row === 1;
			const cellFill = isHighlightedOrange ? ch.orangeBlockPop > .15 ? BOOKING_PALETTE.orangeAccent : "#FDE68A" : (col + row) % 2 === 0 ? "#93C5FD" : "#CBD5E1";
			drawPoly([
				iso(cx0, mScreenY - .15, cz0),
				iso(cx1, mScreenY - .15, cz0),
				iso(cx1, mScreenY - .15, cz1),
				iso(cx0, mScreenY - .15, cz1)
			], cellFill);
		}
	}
	// File organizer & small succulent on reception desk
	drawPrism(26, 80, 22, 8, 7, 6, {
		top: "#FFFFFF",
		right: BOOKING_PALETTE.orangeShade,
		left: BOOKING_PALETTE.orangeAccent,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.1
	});
	drawPottedPlant(69, 84, 22, plantSway * .4, .45);
	// Waiting Area Chairs & Second Tiny Waiting Patient in the Front-Left Reception Room
	const drawWaitingChair = (cx: number, cy: number, isWarmYellow = false) => {
		const topC = isWarmYellow ? "#FDE047" : BOOKING_PALETTE.royalBright;
		const rightC = isWarmYellow ? BOOKING_PALETTE.warmWoodMid : BOOKING_PALETTE.navyRoof;
		const leftC = isWarmYellow ? "#FACC15" : BOOKING_PALETTE.royalFacade;
		// Seat cushion
		drawPrism(cx, cy, 2, 15, 14, 8.5, {
			top: topC,
			right: rightC,
			left: leftC,
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.2
		});
		// Backrest along left cutaway wall
		drawPrism(cx, cy, 10.5, 4, 14, 13, {
			top: topC,
			right: rightC,
			left: leftC,
			stroke: BOOKING_PALETTE.strokeNavy,
			lineWidth: 1.2
		});
	};
	drawWaitingChair(12, 48, false);
	drawWaitingChair(12, 26, true);
	// Second tiny patient waiting in the reception area
	drawCharacter({
		x: 24,
		y: 48,
		z: 2,
		scaleFactor: .98,
		role: "waiting-patient",
		stride: 0
	});
	// Sidewalk patient after stepping inside the reception doorway
	if (ch.patientY >= -3) {
		drawCharacter({
			x: ch.patientX,
			y: ch.patientY,
			z: 2,
			scaleFactor: 1.06,
			role: "patient-smartphone",
			stride: ch.patientStride,
			opacity: ch.patientOpacity
		});
	}
	// ============================================================================
	// 6. LOW CUTAWAY TERRACOTTA BRICK WAINSCOT WALL ON LEFT SIDE + STEPPED ROOF RIM
	// ============================================================================
	// Low cutaway wainscot along the open left side (x = -WALL_T..0, y = 0..BY_TOTAL, z = 0..18)
	drawPrism(-WALL_T, 0, 0, WALL_T, BY_TOTAL, 18, {
		top: BOOKING_PALETTE.creamStucco,
		right: BOOKING_PALETTE.terracottaBrickDark,
		left: BOOKING_PALETTE.terracottaBrick,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	for (let by = 14; by < BY_TOTAL - 8; by += 18) {
		drawLine(iso(-WALL_T - .1, by, 6), iso(-WALL_T - .1, by + 10, 6), "rgba(247, 242, 231, 0.45)", 1);
		drawLine(iso(-WALL_T - .1, by + 6, 12), iso(-WALL_T - .1, by + 16, 12), "rgba(247, 242, 231, 0.45)", 1);
	}
	// Rear-left vertical cutaway column (x = -WALL_T..0, y = BY_TOTAL - WALL_T..BY_TOTAL, z = 18..RECEPTION_H)
	drawPrism(-WALL_T, BY_TOTAL - WALL_T, 18, WALL_T, WALL_T, RECEPTION_H - 18, {
		top: BOOKING_PALETTE.creamStucco,
		right: BOOKING_PALETTE.creamStuccoShade,
		left: BOOKING_PALETTE.creamStucco,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	// Front-left vertical cutaway corner pillar (x = -WALL_T..0, y = -2..16, z = 18..RECEPTION_H)
	drawPrism(-WALL_T, -2, 18, WALL_T, 18, RECEPTION_H - 18, {
		top: BOOKING_PALETTE.creamStucco,
		right: BOOKING_PALETTE.creamStuccoShade,
		left: BOOKING_PALETTE.creamStucco,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	// ============================================================================
	// 7. DISTINCT CLINIC FRONT FACADE (y = 0, x = 0..BX_TOTAL):
	//    CREAM STUCCO + TERRACOTTA BRICK WAINSCOT + STEPPED SILHOUETTE
	// ============================================================================
	// Left Wing Upper Cream Stucco Facade (x = 0..BX_SPLIT, z = WAINSCOT_H..RECEPTION_H)
	drawPoly([
		iso(0, 0, WAINSCOT_H),
		iso(BX_SPLIT, 0, WAINSCOT_H),
		iso(BX_SPLIT, 0, RECEPTION_H),
		iso(0, 0, RECEPTION_H)
	], BOOKING_PALETTE.creamStucco, BOOKING_PALETTE.strokeNavy, 1.6);
	// Right Wing Stepped Taller Cream Stucco Facade (x = BX_SPLIT..BX_TOTAL, z = WAINSCOT_H..CONSULT_H)
	drawPoly([
		iso(BX_SPLIT, 0, WAINSCOT_H),
		iso(BX_TOTAL, 0, WAINSCOT_H),
		iso(BX_TOTAL, 0, CONSULT_H),
		iso(BX_SPLIT, 0, CONSULT_H)
	], BOOKING_PALETTE.creamStucco, BOOKING_PALETTE.strokeNavy, 1.6);
	// Terracotta Brick Wainscot Base across the entire front facade (z = 0..WAINSCOT_H)
	drawPoly([
		iso(0, 0, 0),
		iso(BX_TOTAL, 0, 0),
		iso(BX_TOTAL, 0, WAINSCOT_H),
		iso(0, 0, WAINSCOT_H)
	], BOOKING_PALETTE.terracottaBrick, BOOKING_PALETTE.strokeNavy, 1.6);
	// Subtle brick mortar lines on the front wainscot
	drawLine(iso(4, -.1, 8), iso(BX_TOTAL - 4, -.1, 8), "rgba(247, 242, 231, 0.42)", 1);
	drawLine(iso(4, -.1, 16), iso(BX_TOTAL - 4, -.1, 16), "rgba(247, 242, 231, 0.42)", 1);
	for (let bx = 14; bx < BX_TOTAL - 10; bx += 18) {
		drawLine(iso(bx, -.1, 0), iso(bx, -.1, 8), "rgba(184, 80, 43, 0.45)", 1);
		drawLine(iso(bx + 9, -.1, 8), iso(bx + 9, -.1, 16), "rgba(184, 80, 43, 0.45)", 1);
		drawLine(iso(bx, -.1, 16), iso(bx, -.1, 24), "rgba(184, 80, 43, 0.45)", 1);
	}
	// Cream stone sill cap atop the terracotta brick wainscot
	drawPrism(-WALL_T, -2, WAINSCOT_H - 2, BX_TOTAL + WALL_T, 2, 3.5, {
		top: "#FFFFFF",
		right: BOOKING_PALETTE.creamStucco,
		left: BOOKING_PALETTE.creamStuccoShade,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.25
	});
	// ============================================================================
	// 8. WOODEN CLINIC ENTRANCE DOOR, MEDICAL CROSS SIGN & WIDE PANORAMIC WINDOW
	// ============================================================================
	// Wooden Entrance Door (x = 42..76, z = 0..72)
	const DOOR_X0 = 42;
	const DOOR_X1 = 76;
	const DOOR_Z1 = 72;
	drawPrism(DOOR_X0 - 2.5, -2.2, 0, DOOR_X1 - DOOR_X0 + 5, 2.2, DOOR_Z1 + 2, {
		top: BOOKING_PALETTE.royalBright,
		right: BOOKING_PALETTE.navyRoof,
		left: BOOKING_PALETTE.royalFacade,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	drawPoly([
		iso(DOOR_X0, -2.1, 0),
		iso(DOOR_X1, -2.1, 0),
		iso(DOOR_X1, -2.1, DOOR_Z1),
		iso(DOOR_X0, -2.1, DOOR_Z1)
	], BOOKING_PALETTE.warmInteriorFloor, BOOKING_PALETTE.strokeNavy, 1.4);
	const doorSwingY = -2.2 - 11 * ch.doorSwing;
	const doorSwingX = DOOR_X0 + (DOOR_X1 - DOOR_X0) * (1 - ch.doorSwing * .22);
	drawPoly([
		iso(DOOR_X0, -2.2, 0),
		iso(doorSwingX, doorSwingY, 0),
		iso(doorSwingX, doorSwingY, DOOR_Z1),
		iso(DOOR_X0, -2.2, DOOR_Z1)
	], BOOKING_PALETTE.warmWoodDoor, BOOKING_PALETTE.strokeNavy, 1.6);
	const lerpIso = (fx: number, z: number): Point => {
		const x = DOOR_X0 + (doorSwingX - DOOR_X0) * fx;
		const y = -2.2 + (doorSwingY - -2.2) * fx;
		return iso(x, y, z);
	};
	drawPoly([
		lerpIso(.16, 34),
		lerpIso(.84, 34),
		lerpIso(.84, 64),
		lerpIso(.16, 64)
	], "#FEF08A", BOOKING_PALETTE.strokeNavy, 1.3);
	drawPoly([
		lerpIso(.16, 6),
		lerpIso(.84, 6),
		lerpIso(.84, 27),
		lerpIso(.16, 27)
	], BOOKING_PALETTE.warmWoodDoorDark, BOOKING_PALETTE.strokeNavy, 1.2);
	drawLine(lerpIso(.88, 26), lerpIso(.88, 38), "#FACC15", 2.2);
	// Projecting Clinic Sign with a Simple Medical Cross to the left of the door (x = 15..33, z = 50..70)
	const signX0 = 15;
	const signX1 = 33;
	const signZ0 = 50;
	const signZ1 = 70;
	drawPrism(signX0, -4.2, signZ0, signX1 - signX0, 4.2, signZ1 - signZ0, {
		top: "#FFFFFF",
		right: "#FFFFFF",
		left: BOOKING_PALETTE.creamStuccoShade,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	const crossCX = (signX0 + signX1) / 2;
	const crossCZ = (signZ0 + signZ1) / 2;
	// Vertical bar of medical cross
	drawPoly([
		iso(crossCX - 2, -4.4, crossCZ - 5.5),
		iso(crossCX + 2, -4.4, crossCZ - 5.5),
		iso(crossCX + 2, -4.4, crossCZ + 5.5),
		iso(crossCX - 2, -4.4, crossCZ + 5.5)
	], BOOKING_PALETTE.navyRoof, BOOKING_PALETTE.strokeNavy, 1);
	// Horizontal bar of medical cross
	drawPoly([
		iso(crossCX - 5.5, -4.4, crossCZ - 2),
		iso(crossCX + 5.5, -4.4, crossCZ - 2),
		iso(crossCX + 5.5, -4.4, crossCZ + 2),
		iso(crossCX - 5.5, -4.4, crossCZ + 2)
	], BOOKING_PALETTE.navyRoof, BOOKING_PALETTE.strokeNavy, 1);
	// Wide Framed Clinic Window on the Right Wing (x = 116..196, z = 26..80)
	const WIN_X0 = 116;
	const WIN_X1 = 196;
	const WIN_Z0 = 26;
	const WIN_Z1 = 80;
	// Projecting stone window sill
	drawPrism(WIN_X0 - 3, -4.5, WIN_Z0 - 4, WIN_X1 - WIN_X0 + 6, 4.5, 4, {
		top: "#FFFFFF",
		right: BOOKING_PALETTE.creamStucco,
		left: BOOKING_PALETTE.creamStuccoShade,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.35
	});
	// Navy window frame
	drawPrism(WIN_X0 - 2, -2, WIN_Z0, WIN_X1 - WIN_X0 + 4, 2, WIN_Z1 - WIN_Z0 + 2, {
		top: BOOKING_PALETTE.royalBright,
		right: BOOKING_PALETTE.navyRoof,
		left: BOOKING_PALETTE.royalFacade,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Warm yellow-lit window glass
	drawPoly([
		iso(WIN_X0 + 1.5, -2.2, WIN_Z0 + 2),
		iso(WIN_X1 - 1.5, -2.2, WIN_Z0 + 2),
		iso(WIN_X1 - 1.5, -2.2, WIN_Z1 - 1.5),
		iso(WIN_X0 + 1.5, -2.2, WIN_Z1 - 1.5)
	], "#FEF08A", BOOKING_PALETTE.strokeNavy, 1.3);
	// Clean window mullions + diagonal reflection highlight
	drawLine(iso(WIN_X0 + 26, -2.3, WIN_Z0 + 2), iso(WIN_X0 + 26, -2.3, WIN_Z1 - 1.5), BOOKING_PALETTE.royalBright, 2);
	drawLine(iso(WIN_X0 + 54, -2.3, WIN_Z0 + 2), iso(WIN_X0 + 54, -2.3, WIN_Z1 - 1.5), BOOKING_PALETTE.royalBright, 2);
	drawPoly([
		iso(WIN_X0 + 18, -2.4, WIN_Z0 + 3),
		iso(WIN_X0 + 32, -2.4, WIN_Z0 + 3),
		iso(WIN_X0 + 58, -2.4, WIN_Z1 - 2),
		iso(WIN_X0 + 44, -2.4, WIN_Z1 - 2)
	], "rgba(255, 255, 255, 0.38)", "none");
	// ============================================================================
	// 9. STEPPED PARAPET ROOF COPING + FLAT ROOF SECTION WITH LARGE SMARTPHONE
	//    & TINY WORKER ADJUSTING IT (NO CRANE)
	// ============================================================================
	// Left Wing Roof Parapet Coping (x = -WALL_T..BX_SPLIT, z = RECEPTION_H - 4..RECEPTION_H + 5)
	drawPrism(-WALL_T, -2.5, RECEPTION_H - 4, BX_SPLIT + WALL_T, 8.5, 9, {
		top: "#FFFFFF",
		right: BOOKING_PALETTE.creamStucco,
		left: BOOKING_PALETTE.creamStuccoShade,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.5
	});
	drawPrism(-WALL_T, BY_TOTAL - 4, RECEPTION_H - 4, BX_SPLIT + WALL_T, 6, 9, {
		top: "#FFFFFF",
		right: BOOKING_PALETTE.creamStucco,
		left: BOOKING_PALETTE.creamStuccoShade,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.4
	});
	// Right Wing Back & Side Parapet Coping
	drawPrism(BX_SPLIT - 2, BY_TOTAL - 4, CONSULT_H - 4, BX_TOTAL - BX_SPLIT + 4, 6, 10, {
		top: "#FFFFFF",
		right: BOOKING_PALETTE.creamStucco,
		left: BOOKING_PALETTE.creamStuccoShade,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	drawPrism(BX_TOTAL - 4, -2.5, CONSULT_H - 4, 6, BY_TOTAL + 4.5, 10, {
		top: "#FFFFFF",
		right: BOOKING_PALETTE.creamStucco,
		left: BOOKING_PALETTE.creamStuccoShade,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.45
	});
	// Flat Roof Section on the Front of the Right Wing (x = BX_SPLIT - 2..BX_TOTAL + 2, y = -2.8..42, z = CONSULT_H - 4..CONSULT_H + 5)
	const FLAT_ROOF_Y1 = 42;
	drawPrism(BX_SPLIT - 2, -2.8, CONSULT_H - 4, BX_TOTAL - BX_SPLIT + 4, FLAT_ROOF_Y1 + 2.8, 9, {
		top: "#E2E8F0",
		right: BOOKING_PALETTE.creamStucco,
		left: "#FFFFFF",
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.55
	});
	// Inner recessed flat roof deck surface
	drawPoly([
		iso(BX_SPLIT + 4, 3, CONSULT_H + 5.2),
		iso(BX_TOTAL - 4, 3, CONSULT_H + 5.2),
		iso(BX_TOTAL - 4, FLAT_ROOF_Y1 - 4, CONSULT_H + 5.2),
		iso(BX_SPLIT + 4, FLAT_ROOF_Y1 - 4, CONSULT_H + 5.2)
	], "#CBD5E1", BOOKING_PALETTE.strokeNavy, 1.25);
	// LARGE SMARTPHONE STANDING ON THE FLAT ROOF (Main focal point, taller than roof thickness, no crane)
	const PH_X0 = 114;
	const PH_W = 72;
	const PH_Y = 12;
	const PH_BASE_Z = CONSULT_H + 7;
	const PH_H = 76;
	const PH_TOP_Z = PH_BASE_Z + PH_H;
	// Roof support brackets under the standing smartphone
	drawPrism(PH_X0 + 12, PH_Y - 3.5, CONSULT_H + 5, 8, 8, 4, {
		top: "#FFFFFF",
		right: "#94A3B8",
		left: "#CBD5E1",
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.15
	});
	drawPrism(PH_X0 + PH_W - 20, PH_Y - 3.5, CONSULT_H + 5, 8, 8, 4, {
		top: "#FFFFFF",
		right: "#94A3B8",
		left: "#CBD5E1",
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.15
	});
	// Tiny worker standing beside the phone on the flat roof adjusting it
	drawCharacter({
		x: PH_X0 + PH_W + 13,
		y: PH_Y + 5,
		z: CONSULT_H + 5.5,
		scaleFactor: .94,
		role: "roof-wrench-worker",
		wrenchAngle: ch.wrenchTurnAngle,
		stride: 0
	});
	// Outer navy smartphone chassis standing upright on the flat roof
	drawPrism(PH_X0, PH_Y, PH_BASE_Z, PH_W, 7, PH_H, {
		top: BOOKING_PALETTE.royalBright,
		right: BOOKING_PALETTE.navyRoof,
		left: BOOKING_PALETTE.navyDeep,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1.7
	});
	// Side volume button accents on the left bezel of the large rooftop smartphone
	drawPrism(PH_X0 - .8, PH_Y + 1.5, PH_TOP_Z - 24, .8, 3, 8, {
		top: BOOKING_PALETTE.royalBright,
		right: BOOKING_PALETTE.royalFacade,
		left: BOOKING_PALETTE.cyanHighlight,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1
	});
	drawPrism(PH_X0 - .8, PH_Y + 1.5, PH_TOP_Z - 36, .8, 3, 8, {
		top: BOOKING_PALETTE.royalBright,
		right: BOOKING_PALETTE.royalFacade,
		left: BOOKING_PALETTE.cyanHighlight,
		stroke: BOOKING_PALETTE.strokeNavy,
		lineWidth: 1
	});
	// Inner white smartphone screen
	const SX0 = PH_X0 + 4.5;
	const SX1 = PH_X0 + PH_W - 4.5;
	const SZ0 = PH_BASE_Z + 5;
	const SZ1 = PH_TOP_Z - 5;
	const fY = PH_Y - .25;
	drawPoly([
		iso(SX0, fY, SZ0),
		iso(SX1, fY, SZ0),
		iso(SX1, fY, SZ1),
		iso(SX0, fY, SZ1)
	], "#FFFFFF", BOOKING_PALETTE.strokeNavy, 1.4);
	// Smartphone top earpiece notch pill
	const notchCX = (SX0 + SX1) / 2;
	drawPoly([
		iso(notchCX - 10, fY - .1, SZ1 - 3.6),
		iso(notchCX + 10, fY - .1, SZ1 - 3.6),
		iso(notchCX + 10, fY - .1, SZ1 - 1),
		iso(notchCX - 10, fY - .1, SZ1 - 1)
	], BOOKING_PALETTE.navyRoof);
	// Helper to draw an isometric rounded-corner chat bubble on the rooftop smartphone screen
	const drawScreenRoundedBubble = (bx0: number, bx1: number, bz0: number, bz1: number, fill: string, stroke: string, tailSide: string) => {
		const c = 2;
		const pts = [
			iso(bx0 + c, fY - .12, bz0),
			iso(bx1 - c, fY - .12, bz0),
			iso(bx1, fY - .12, bz0 + c),
			iso(bx1, fY - .12, bz1 - c),
			iso(bx1 - c, fY - .12, bz1),
			iso(bx0 + c, fY - .12, bz1),
			iso(bx0, fY - .12, bz1 - c),
			iso(bx0, fY - .12, bz0 + c)
		];
		drawPoly(pts, fill, stroke, 1.15);
		if (tailSide === "left") {
			drawPoly([
				iso(bx0 + 2.5, fY - .13, bz0 + .5),
				iso(bx0 - 1.8, fY - .13, bz0 - 2),
				iso(bx0 + 6, fY - .13, bz0 + .5)
			], fill, stroke, 1);
		} else {
			drawPoly([
				iso(bx1 - 6, fY - .13, bz0 + .5),
				iso(bx1 + 1.8, fY - .13, bz0 - 2),
				iso(bx1 - 2.5, fY - .13, bz0 + .5)
			], fill, stroke, 1);
		}
	};
	// --- CHAT BUBBLE 1 (Top-left rounded chat bubble made of gray bars) ---
	const b1X0 = SX0 + 4;
	const b1X1 = SX1 - 13;
	const b1Z1 = SZ1 - 6;
	const b1Z0 = b1Z1 - 11.5;
	const b1Fill = ch.bubble1Lit > .1 ? "#F1F5F9" : "#F8FAFC";
	const bar1Color = ch.bubble1Lit > .2 ? "#94A3B8" : "#CBD5E1";
	const bar1SubColor = ch.bubble1Lit > .2 ? "#CBD5E1" : "#E2E8F0";
	drawScreenRoundedBubble(b1X0, b1X1, b1Z0, b1Z1, b1Fill, BOOKING_PALETTE.strokeNavy, "left");
	drawPoly([
		iso(b1X0 + 3.5, fY - .18, b1Z1 - 4.8),
		iso(b1X1 - 5, fY - .18, b1Z1 - 4.8),
		iso(b1X1 - 5, fY - .18, b1Z1 - 2.6),
		iso(b1X0 + 3.5, fY - .18, b1Z1 - 2.6)
	], bar1Color);
	drawPoly([
		iso(b1X0 + 3.5, fY - .18, b1Z0 + 2.6),
		iso(b1X1 - 11.5, fY - .18, b1Z0 + 2.6),
		iso(b1X1 - 11.5, fY - .18, b1Z0 + 4.8),
		iso(b1X0 + 3.5, fY - .18, b1Z0 + 4.8)
	], bar1SubColor);
	// --- CHAT BUBBLE 2 (Second rounded chat bubble made of gray bars + small green check mark) ---
	const b2X0 = SX0 + 11;
	const b2X1 = SX1 - 4;
	const b2Z1 = b1Z0 - 3;
	const b2Z0 = b2Z1 - 12;
	const b2Fill = ch.chatBubbleLit > .1 ? "#ECFDF5" : "#F8FAFC";
	const bar2Color = ch.chatBubbleLit > .2 ? "#64748B" : "#CBD5E1";
	const bar2SubColor = ch.chatBubbleLit > .2 ? "#94A3B8" : "#E2E8F0";
	drawScreenRoundedBubble(b2X0, b2X1, b2Z0, b2Z1, b2Fill, BOOKING_PALETTE.strokeNavy, "right");
	drawPoly([
		iso(b2X0 + 3.5, fY - .18, b2Z1 - 4.8),
		iso(b2X1 - 13, fY - .18, b2Z1 - 4.8),
		iso(b2X1 - 13, fY - .18, b2Z1 - 2.6),
		iso(b2X0 + 3.5, fY - .18, b2Z1 - 2.6)
	], bar2Color);
	drawPoly([
		iso(b2X0 + 3.5, fY - .18, b2Z0 + 2.6),
		iso(b2X1 - 16.5, fY - .18, b2Z0 + 2.6),
		iso(b2X1 - 16.5, fY - .18, b2Z0 + 4.8),
		iso(b2X0 + 3.5, fY - .18, b2Z0 + 4.8)
	], bar2SubColor);
	// Small Green Check Mark inside Chat Bubble 2
	const chkScale = Math.max(.3, ch.greenCheckPop);
	const chkCX = b2X1 - 6.6;
	const chkCZ = (b2Z0 + b2Z1) / 2;
	const chkR = 3.8 * chkScale;
	const chkPts = [];
	for (let i = 0; i < 18; i++) {
		const a = i / 18 * Math.PI * 2;
		chkPts.push(iso(chkCX + Math.cos(a) * chkR, fY - .22, chkCZ + Math.sin(a) * chkR));
	}
	drawPoly(chkPts, BOOKING_PALETTE.whatsappGreen, BOOKING_PALETTE.strokeNavy, 1.05);
	drawLine(iso(chkCX - 1.8 * chkScale, fY - .26, chkCZ + .2 * chkScale), iso(chkCX - .4 * chkScale, fY - .26, chkCZ - 1.5 * chkScale), "#FFFFFF", 1.7);
	drawLine(iso(chkCX - .4 * chkScale, fY - .26, chkCZ - 1.5 * chkScale), iso(chkCX + 2.1 * chkScale, fY - .26, chkCZ + 1.6 * chkScale), "#FFFFFF", 1.7);
	// --- CALENDAR GRID WITH ONE ORANGE BLOCK HIGHLIGHTED (Below the chat bubbles) ---
	const calX0 = SX0 + 4;
	const calX1 = SX1 - 4;
	const calZ1 = b2Z0 - 3.2;
	const calZ0 = SZ0 + 3;
	drawPoly([
		iso(calX0, fY - .12, calZ0),
		iso(calX1, fY - .12, calZ0),
		iso(calX1, fY - .12, calZ1),
		iso(calX0, fY - .12, calZ1)
	], "#F8FAFC", BOOKING_PALETTE.strokeNavy, 1.2);
	// Calendar top header bar (navy blue)
	const calHdrZ0 = calZ1 - 4.8;
	drawPoly([
		iso(calX0, fY - .16, calHdrZ0),
		iso(calX1, fY - .16, calHdrZ0),
		iso(calX1, fY - .16, calZ1),
		iso(calX0, fY - .16, calZ1)
	], BOOKING_PALETTE.navyRoof, BOOKING_PALETTE.strokeNavy, 1.1);
	// 4 columns x 3 rows of calendar grid cells with ONE orange block highlighted
	const COLS = 4;
	const ROWS = 3;
	const gridPadX = 2.6;
	const gridPadZ = 2.2;
	const availW = calX1 - calX0 - gridPadX * 2;
	const availH = calHdrZ0 - calZ0 - gridPadZ * 2;
	const cellW = (availW - (COLS - 1) * 2) / COLS;
	const cellH = (availH - (ROWS - 1) * 1.8) / ROWS;
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLS; c++) {
			const cx0 = calX0 + gridPadX + c * (cellW + 2);
			const cx1 = cx0 + cellW;
			const cz0 = calZ0 + gridPadZ + r * (cellH + 1.8);
			const cz1 = cz0 + cellH;
			const isOrangeSlot = r === 1 && c === 2;
			if (isOrangeSlot) {
				const oScale = Math.max(.35, ch.orangeBlockPop);
				const midX = (cx0 + cx1) / 2;
				const midZ = (cz0 + cz1) / 2;
				const hw = cellW / 2 * oScale;
				const hh = cellH / 2 * oScale;
				drawPoly([
					iso(midX - hw, fY - .22, midZ - hh),
					iso(midX + hw, fY - .22, midZ - hh),
					iso(midX + hw, fY - .22, midZ + hh),
					iso(midX - hw, fY - .22, midZ + hh)
				], BOOKING_PALETTE.orangeAccent, BOOKING_PALETTE.strokeNavy, 1.15);
			} else {
				const isBlueSlot = (r + c) % 3 === 0;
				const slotFill = isBlueSlot ? "#BFDBFE" : "#E2E8F0";
				drawPoly([
					iso(cx0, fY - .16, cz0),
					iso(cx1, fY - .16, cz0),
					iso(cx1, fY - .16, cz1),
					iso(cx0, fY - .16, cz1)
				], slotFill, "#94A3B8", .75);
			}
		}
	}
	// ============================================================================
	// 10. POTTED PLANTS, SIDEWALK PATIENT WITH SMARTPHONE & NAVY-AND-WHITE AWNING
	// ============================================================================
	drawPottedPlant(22, -14, 0, plantSway, .95);
	drawPottedPlant(92, -14, 0, -plantSway, .95);
	drawPottedPlant(204, -14, 0, plantSway * .8, .95);
	if (ch.patientY < -3) {
		drawCharacter({
			x: ch.patientX,
			y: ch.patientY,
			z: 0,
			scaleFactor: 1.06,
			role: "patient-smartphone",
			stride: ch.patientStride,
			opacity: ch.patientOpacity
		});
	}
	// Navy-and-white striped awning over the clinic entrance door (x = 32..88)
	const AWNING_X0 = 32;
	const AWNING_X1 = 88;
	const AWNING_Z_WALL = 88;
	const AWNING_Z_FRONT = 68;
	const AWNING_Y_FRONT = -22;
	const STRIPE_COUNT = 6;
	const stripeW = (AWNING_X1 - AWNING_X0) / STRIPE_COUNT;
	drawPoly([
		iso(AWNING_X0, -2, AWNING_Z_WALL),
		iso(AWNING_X0, AWNING_Y_FRONT, AWNING_Z_FRONT),
		iso(AWNING_X0, -2, AWNING_Z_FRONT)
	], BOOKING_PALETTE.navyRoof, BOOKING_PALETTE.strokeNavy, 1.4);
	for (let s = 0; s < STRIPE_COUNT; s++) {
		const sx0 = AWNING_X0 + s * stripeW;
		const sx1 = sx0 + stripeW;
		const isNavyStripe = s % 2 === 0;
		const fill = isNavyStripe ? BOOKING_PALETTE.navyRoof : "#FFFFFF";
		const valenceFill = isNavyStripe ? BOOKING_PALETTE.navyDeep : "#E2E8F0";
		drawPoly([
			iso(sx0, -2, AWNING_Z_WALL),
			iso(sx1, -2, AWNING_Z_WALL),
			iso(sx1, AWNING_Y_FRONT, AWNING_Z_FRONT),
			iso(sx0, AWNING_Y_FRONT, AWNING_Z_FRONT)
		], fill, BOOKING_PALETTE.strokeNavy, 1.35);
		drawPoly([
			iso(sx0, AWNING_Y_FRONT, AWNING_Z_FRONT),
			iso(sx1, AWNING_Y_FRONT, AWNING_Z_FRONT),
			iso(sx1 - 1.2, AWNING_Y_FRONT, AWNING_Z_FRONT - 5.2),
			iso((sx0 + sx1) / 2, AWNING_Y_FRONT, AWNING_Z_FRONT - 7),
			iso(sx0 + 1.2, AWNING_Y_FRONT, AWNING_Z_FRONT - 5.2)
		], valenceFill, BOOKING_PALETTE.strokeNavy, 1.3);
	}
	ctx.restore();
};
