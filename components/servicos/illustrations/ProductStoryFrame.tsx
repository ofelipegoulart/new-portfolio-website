"use client";

import { useEffect, useState, type CSSProperties } from "react";

const durations = [4800, 3400, 3400, 4800];
const buildDurations = [380, 620, 1050, 380, 420];

function createBuildDelays() {
  const order = [0, 1, 2, 3, 4];
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
  }

  const delays = Array<number>(order.length).fill(0);
  let elapsed = 0;
  order.forEach((item) => {
    delays[item] = elapsed;
    elapsed += buildDurations[item] + 20 + Math.random() * 45;
  });
  return delays;
}

export interface ProductStoryFrameProps {
  locale?: "pt" | "en";
  className?: string;
}

const copy = {
  pt: {
    steps: ["conversar", "entender quem usa", "construir", "entregar"],
    support: [
      "falo a sua língua, sem jargão. e começo perguntando, não prometendo.",
      "antes de desenhar, descubro quem vai clicar e o que essa pessoa precisa.",
      "cada tela com um objetivo só, escrita em linguagem simples.",
      "você vê funcionando e entende tudo o que foi feito.",
    ],
    clientFirst: "quero um site que meus clientes entendam.",
    me: "ótimo. como as pessoas chegam até você hoje?",
    clientLast: "pelo celular, quase todo mundo.",
    who: "quem usa: cliente, no celular, com pressa",
    path: "um caminho só: agendar",
    title: "agende em dois toques.",
    paragraph: "escolha o dia e o horário. a gente confirma no seu WhatsApp.",
    button: "agendar consulta",
    confirmation: "agendado. você recebe um aviso no WhatsApp.",
    frameAlt: "uma ideia de produto passa por conversa, entendimento, construção e entrega.",
  },
  en: {
    steps: ["talk", "understand the user", "build", "deliver"],
    support: [
      "plain language, no jargon. i start by asking, not promising.",
      "before designing, i find out who will click and what they need.",
      "one clear purpose per screen, written in simple language.",
      "you see it working and understand everything that was built.",
    ],
    clientFirst: "i need a site my customers can understand.",
    me: "great. how do people find you today?",
    clientLast: "almost everyone uses their phone.",
    who: "who uses it: a busy customer on their phone",
    path: "one clear path: book",
    title: "book in two taps.",
    paragraph: "choose a day and time. we’ll confirm on WhatsApp.",
    button: "book an appointment",
    confirmation: "booked. you’ll get a WhatsApp notification.",
    frameAlt: "A product idea moves through conversation, understanding, building, and delivery.",
  },
} as const;

export default function ProductStoryFrame({ locale = "pt", className = "" }: ProductStoryFrameProps) {
  const [scene, setScene] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [buildDelays, setBuildDelays] = useState<number[]>([0, 0, 0, 0, 0]);
  const t = copy[locale];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) setScene(3);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setTimeout(() => {
      const nextScene = (scene + 1) % 4;
      if (nextScene === 2) setBuildDelays(createBuildDelays());
      setScene(nextScene);
    }, durations[scene]);
    return () => window.clearTimeout(timer);
  }, [scene, reducedMotion, timerKey]);

  const selectScene = (index: number) => {
    if (index === 2) setBuildDelays(createBuildDelays());
    setScene(index);
    setTimerKey((key) => key + 1);
  };

  return (
    <div className={`product-story ${className}`}>
      <figure
        className="product-story-frame"
        aria-hidden="true"
        data-scene={scene}
        style={{
          "--build-delay-1": `${buildDelays[0]}ms`,
          "--build-delay-2": `${buildDelays[1]}ms`,
          "--build-delay-3": `${buildDelays[2]}ms`,
          "--build-delay-4": `${buildDelays[3]}ms`,
          "--build-delay-5": `${buildDelays[4]}ms`,
        } as CSSProperties}
      >
        <div className="product-story-stage">
          <div className="product-story-scene product-story-scene-conversation">
            <div className="product-story-bubbles">
              <p className="product-story-bubble product-story-bubble-client">{t.clientFirst}</p>
              <p className="product-story-bubble product-story-bubble-me">{t.me}</p>
              <p className="product-story-bubble product-story-bubble-client">{t.clientLast}</p>
            </div>
          </div>
          <div className="product-story-scene product-story-scene-understand">
            <p className="product-story-tag product-story-tag-top">{t.who}</p>
            <div className="product-story-product product-story-wireframe">
              <span className="product-story-product-logo" />
              <h2>{t.title}</h2>
              <p>{t.paragraph}</p>
              <button type="button">{t.button}</button>
            </div>
            <p className="product-story-tag product-story-tag-bottom">{t.path}</p>
          </div>
          <div className="product-story-scene product-story-scene-build">
            <ProductScreen
              key={scene === 2 ? timerKey + 2 : scene}
              t={t}
              typing={scene === 2 && !reducedMotion}
              titleDelay={buildDelays[1]}
              copyDelay={buildDelays[2]}
            />
          </div>
          <div className="product-story-scene product-story-scene-deliver">
            <ProductScreen t={t} deliver />
          </div>
        </div>
      </figure>
      <div className="product-story-controls">
        <div className="product-story-step-grid" role="group" aria-label={locale === "pt" ? "Etapas do trabalho" : "Work stages"}>
          {t.steps.map((step, index) => (
            <button
              key={step}
              type="button"
              className={`product-story-step${scene === index ? " is-active" : ""}`}
              aria-current={scene === index ? "step" : undefined}
              onClick={() => selectScene(index)}
            >
              <span className="product-story-step-number" aria-hidden="true">{index + 1}</span>
              <span className="product-story-step-label">{step}</span>
            </button>
          ))}
        </div>
        <p className="product-story-step-support">{t.support[scene]}</p>
      </div>
    </div>
  );
}

function ProductScreen({
  t,
  deliver = false,
  typing = false,
  titleDelay = 0,
  copyDelay = 0,
}: {
  t: (typeof copy)["pt"] | (typeof copy)["en"];
  deliver?: boolean;
  typing?: boolean;
  titleDelay?: number;
  copyDelay?: number;
}) {
  return (
    <div className={`product-story-product${deliver ? " product-story-product-deliver" : " product-story-product-build"}`}>
      <div className="product-story-product-header">
        <span className="product-story-product-logo" />
        <span className="product-story-product-menu" aria-hidden="true"><i /><i /><i /></span>
      </div>
      <h2 className="product-story-product-title">
        {deliver ? t.title : <TypingText text={t.title} active={typing} delay={titleDelay} />}
      </h2>
      <p className="product-story-product-copy">
        {deliver ? t.paragraph : <TypingText text={t.paragraph} active={typing} delay={copyDelay} />}
      </p>
      <span className="product-story-product-divider" aria-hidden="true" />
      <button type="button">{t.button}</button>
      {deliver && <>
        <span className="product-story-cursor" />
        <p className="product-story-confirmation">{t.confirmation}</p>
      </>}
    </div>
  );
}

function TypingText({ text, active, delay }: { text: string; active: boolean; delay: number }) {
  const characters = Array.from(text);
  const [visibleCount, setVisibleCount] = useState(active ? 0 : characters.length);

  useEffect(() => {
    if (!active) {
      setVisibleCount(characters.length);
      return;
    }

    setVisibleCount(0);
    let count = 0;
    let typingTimer = 0;
    const startTimer = window.setTimeout(() => {
      typingTimer = window.setInterval(() => {
        count += 1;
        setVisibleCount(count);
        if (count >= characters.length) window.clearInterval(typingTimer);
      }, 16);
    }, delay);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(typingTimer);
    };
  }, [active, delay, text]);

  return (
    <span className="product-story-typed-text">
      {characters.slice(0, visibleCount).join("")}
      {active && <i className="product-story-text-caret" aria-hidden="true" />}
    </span>
  );
}
