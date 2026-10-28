"use client";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { copy } from "@/data/translations";
import { PortfolioFooter } from "@/components/PortfolioFooter";
import { ContactModal } from "@/components/servicos/ContactModal";
type T = typeof copy.pt;

const TechGrid = dynamic(
  () => import("@/components/TechGrid").then((module) => module.TechGrid),
  {
    loading: () => <div className="tech-grid-loading" aria-hidden="true" />,
  },
);
const ProjectViewer = dynamic(
  () =>
    import("@/components/ProjectViewer").then(
      (module) => module.ProjectViewer,
    ),
  {
    loading: () => <div className="project-viewer-loading" aria-hidden="true" />,
  },
);

function AnimatedArrowPath({
  d,
  progress,
  reduced,
  className,
}: {
  d: string;
  progress: MotionValue<number>;
  reduced: boolean;
  className?: string;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPathElement>(null);
  const samplesRef = useRef<{ x: number; y: number }[]>([]);
  const headOpacity = useTransform(progress, [0, 0.04], [0, 1]);
  const updateHead = useCallback((value: number) => {
    const samples = samplesRef.current;
    const head = headRef.current;
    if (samples.length < 2 || !head) return;

    const position = Math.max(0, Math.min(1, value)) * (samples.length - 1);
    const index = Math.min(Math.floor(position), samples.length - 2);
    const fraction = position - index;
    const start = samples[index];
    const end = samples[index + 1];
    const point = {
      x: start.x + (end.x - start.x) * fraction,
      y: start.y + (end.y - start.y) * fraction,
    };
    const before = samples[Math.max(0, index - 1)];
    const after = samples[Math.min(samples.length - 1, index + 1)];
    const angle = Math.atan2(after.y - before.y, after.x - before.x);
    const baseX = point.x - Math.cos(angle) * 14;
    const baseY = point.y - Math.sin(angle) * 14;
    const sideX = Math.sin(angle) * 6;
    const sideY = -Math.cos(angle) * 6;

    head.setAttribute(
      "d",
      `M ${baseX + sideX} ${baseY + sideY} L ${point.x} ${point.y} L ${baseX - sideX} ${baseY - sideY}`,
    );
  }, []);

  useMotionValueEvent(progress, "change", updateHead);
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    const sampleCount = 120;
    samplesRef.current = Array.from({ length: sampleCount + 1 }, (_, index) => {
      const point = path.getPointAtLength((length * index) / sampleCount);
      return { x: point.x, y: point.y };
    });
    updateHead(reduced ? 1 : progress.get());
  }, [d, progress, reduced, updateHead]);

  return (
    <>
      <motion.path
        ref={pathRef}
        className={className}
        d={d}
        fill="none"
        stroke="var(--lime)"
        strokeWidth="2"
        strokeDasharray="8 10"
        pathLength="1"
        style={{ pathLength: reduced ? 1 : progress }}
      />
      <motion.path
        ref={headRef}
        className={className}
        fill="none"
        stroke="var(--lime)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: reduced ? 1 : headOpacity }}
      />
    </>
  );
}

export function Hero({ t }: { t: T }) {
  return (
    <>
      <section id="sobre" className="section hero" data-index="0">
        <div className="hero-wrap">
          <div className="hero-copy">
            <h1>
              {t.hero.title}
              <br />
              <span className="highlight-word">{t.hero.name}</span>
            </h1>
            <div className="portrait-wrap">
              <div className="portrait-back" />
              <div className="portrait">
                <Image
                  src="/images/felipe.webp"
                  alt="Retrato de Felipe em estúdio"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 700px) 72vw, 34vw"
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </div>
              <span className="photo-caption">FIG. 01 — FELIPE</span>
            </div>
            <p>{t.hero.intro}</p>
          </div>
        </div>
      </section>
      <section id="sobre-mim" className="section about" data-index="0">
        <h2>
          {t.hero.about}
        </h2>
        <p>{t.hero.aboutText}</p>
      </section>
    </>
  );
}
export function Work({ t, active }: { t: T; active: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const firstArrow = useTransform(
    scrollYProgress,
    isMobile ? [0.24, 0.39] : [0, 0.36],
    [0, 1],
  );
  const secondArrow = useTransform(
    scrollYProgress,
    isMobile ? [0.47, 0.62] : [0.36, 0.6],
    [0, 1],
  );
  const thirdArrow = useTransform(
    scrollYProgress,
    isMobile ? [0.69, 0.84] : [0.5, 0.7],
    [0, 1],
  );
  const reduced = useReducedMotion() ?? false;
  const arrowPaths = isMobile
    ? [
        "M182 115 C205 135 206 365 264 445",
        "M340 630 C330 700 280 820 193 907",
        "M208 1000 C252 1110 240 1270 264 1310",
      ]
    : [
        "M300 100 C455 115 515 365 659 445",
        "M850 610 C825 700 700 820 534 889",
        "M520 1000 C630 1110 600 1270 660 1310",
      ];
  return (
    <section
      id="processo"
      ref={ref}
      className={`section work ${active ? "is-active" : ""}`}
      data-index="1"
    >
      <div className="section-heading">
        <div>
          <h2>
            {t.work.title}
          </h2>
        </div>
      </div>
      <div className="steps">
        <svg
          className="path-svg"
          viewBox={isMobile ? "0 0 400 1600" : "0 0 1000 1600"}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <AnimatedArrowPath
            d={arrowPaths[0]}
            progress={firstArrow}
            reduced={reduced}
          />
          <AnimatedArrowPath
            d={arrowPaths[1]}
            progress={secondArrow}
            reduced={reduced}
            className="arrow-second"
          />
          <AnimatedArrowPath
            d={arrowPaths[2]}
            progress={thirdArrow}
            reduced={reduced}
          />
        </svg>
        {t.work.steps.map((step, i) => (
          <motion.article
            key={step.title}
            className={`step step-${i + 1}`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, delay: 0.06 }}
          >
            <span className="step-number">
              0{i + 1}
            </span>
            <h3>
              {step.title}
            </h3>
            <p>{step.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
export function Technologies({ t, active }: { t: T; active: boolean }) {
  return (
    <section
      id="tecnologias"
      className={`section technologies ${active ? "is-active" : ""}`}
      data-index="2"
    >
      <TechGrid copy={t.tech} />
    </section>
  );
}
export function Projects({
  t,
  onAccent,
  active,
}: {
  t: T;
  onAccent: (color: string) => void;
  active: boolean;
}) {
  return (
    <section
      id="projetos"
      className={`section projects ${active ? "is-active" : ""}`}
      data-index="3"
    >
      <div className="section-heading">
        <div>
          <h2>
            {t.projects.title}
          </h2>
        </div>
      </div>
      <ProjectViewer text={t.projects} onAccent={onAccent} />
    </section>
  );
}
export function Services({ t }: { t: T }) {
  return (
    <section id="servicos" className="section services" data-index="4">
      
      <h2>{t.services.title}</h2>
      <p>{t.services.text}</p>
      <a href="/servicos" className="service-button">
        {t.services.button}
        <span className="arrow-character" aria-hidden="true">↗︎</span>
      </a>
    </section>
  );
}
export function Contact({ t, locale }: { t: T; locale: "pt" | "en" }) {
  return (
    <section id="contato" className="section contact" data-index="5">
      <div className="contact-main">
        <div>
          <h2>{t.contact.title}</h2>
          <p>{t.contact.text}</p>
          <ContactModal
            locale={locale}
            className="home-contact-cta"
            label={t.contact.email}
          />
        </div>
        <div className="socials">
          {t.contact.socials.map((s, i) => (
            <a
              key={s}
              href={
                [
                  "https://linkedin.com/in/ofelipegoulart",
                  "https://github.com/ofelipegoulart"
                ][i]
              }
              target="_blank"
              rel="noreferrer"
            >
              {s}
              <span className="arrow-character" aria-hidden="true">↗︎</span>
            </a>
          ))}
        </div>
      </div>
      <PortfolioFooter />
    </section>
  );
}
