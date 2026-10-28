import { useEffect, useState } from "react";
import type { Locale } from "@/data/translations";
import { LanguageSwitch } from "./LanguageSwitch";
export function SideNav({
  items,
  locale,
  onLocale,
  active,
  accent = "#D4FF3A",
  variant = "list",
  ids,
}: {
  items: readonly string[];
  locale: Locale;
  onLocale: (l: Locale) => void;
  active: number;
  accent?: string;
  variant?: "list" | "dots";
  ids?: readonly string[];
}) {
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    if (pending === null) return;

    const delay = active === pending ? 700 : 2500;
    const timeout = window.setTimeout(() => setPending(null), delay);
    return () => window.clearTimeout(timeout);
  }, [active, pending]);

  return (
    <aside
      className={`sidenav${active === 2 || active === 4 ? " is-light-background" : ""}`}
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <div className="nav-top" />
      <div className="nav-middle">
        <LanguageSwitch locale={locale} onChange={onLocale} />
        <nav
          className={`nav-links ${variant}`}
          aria-label="Navegação principal"
        >
          {items.map((item, i) => (
            <a
              key={item}
              href={`#${(ids ?? ["sobre", "processo", "tecnologias", "projetos", "servicos", "contato"])[i]}`}
              className={active === i ? "active" : ""}
              aria-label={item}
              aria-current={active === i ? "location" : undefined}
              onClick={() => setPending(i)}
            >
              <i />
              <span>{item}</span>
              <b className="nav-tooltip">{item}</b>
            </a>
          ))}
        </nav>
        {pending !== null && variant === "dots" && (
          <output className="nav-destination-preview" aria-live="polite">
            {locale === "pt" ? "indo para" : "going to"} · {items[pending]}
          </output>
        )}
      </div>
      <span className="nav-index"></span>
    </aside>
  );
}
