"use client";
import { useEffect, useState } from "react";
import type { Locale } from "@/data/translations";

const languageSteps = [
  ["PORTUGUÊS", "ENGLISH"],
  ["PORTUGUÊ", "ENGLIS"],
  ["PORTUGU", "ENGLI"],
  ["PORTUG", "ENGL"],
  ["PORTU", "ENG"],
  ["PORT", "EN"],
  ["POR", "EN"],
  ["PT", "EN"],
] as const;

export function LanguageSwitch({
  locale,
  onChange,
  compact = false,
  onAnimationComplete,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
  compact?: boolean;
  onAnimationComplete?: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(languageSteps.length - 1);
      onAnimationComplete?.();
      return;
    }

    const timers = languageSteps.slice(1).map((_, index) =>
      window.setTimeout(() => {
        setStep(index + 1);
        if (index === languageSteps.length - 2) onAnimationComplete?.();
      }, 1500 + index * (150 / 7)),
    );

    return () => timers.forEach(window.clearTimeout);
  }, [onAnimationComplete]);

  const [portuguese, english] = compact
    ? ["PT", "EN"]
    : languageSteps[step];

  return (
    <div className="language" aria-label="Language selection">
      <button
        onClick={() => onChange("pt")}
        aria-label="Português"
        aria-pressed={locale === "pt"}
      >
        {Array.from(portuguese).map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              aria-hidden="true"
              style={{ display: "inline-block", overflow: "hidden" }}
            >
              {letter}
            </span>
        ))}
      </button>
      <span aria-hidden="true">/</span>
      <button
        onClick={() => onChange("en")}
        aria-label="English"
        aria-pressed={locale === "en"}
      >
        {Array.from(english).map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              aria-hidden="true"
              style={{ display: "inline-block", overflow: "hidden" }}
            >
              {letter}
            </span>
        ))}
      </button>
    </div>
  );
}
