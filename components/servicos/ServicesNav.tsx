import { useCallback, useState } from "react";
import type { Locale } from "@/data/translations";
import { LanguageSwitch } from "@/components/LanguageSwitch";

const navLabels = {
  pt: ["início", "serviços", "sobre", "contato"],
  en: ["home", "services", "about", "contact"],
} as const;

export function ServicesNav({
  locale,
  onLocale,
  active,
  ids,
  hidden = false,
}: {
  locale: Locale;
  onLocale: (locale: Locale) => void;
  active: number;
  ids: readonly string[];
  hidden?: boolean;
}) {
  const [languageReady, setLanguageReady] = useState(false);
  const handleLanguageAnimationComplete = useCallback(
    () => setLanguageReady(true),
    [],
  );

  return (
    <header
      className={`services-topbar${hidden ? " is-hidden" : ""}${languageReady ? " is-language-ready" : " is-language-animating"}`}
    >
      <nav
        className="services-topbar-links"
        aria-label={locale === "pt" ? "Navegação principal" : "Main navigation"}
      >
        {navLabels[locale].map((label, index) => (
          <a
            key={ids[index]}
            href={`#${ids[index]}`}
            aria-current={active === index ? "location" : undefined}
            className={active === index ? "is-active" : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
      <LanguageSwitch
        locale={locale}
        onChange={onLocale}
        compact={languageReady}
        onAnimationComplete={handleLanguageAnimationComplete}
      />
    </header>
  );
}
