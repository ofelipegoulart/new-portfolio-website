"use client";
import { useEffect, useState } from "react";
import { copy, type Locale } from "@/data/translations";
import { SideNav } from "./SideNav";
import { ScrollBackground } from "./ScrollBackground";
import { GrainOverlay } from "./GrainOverlay";
import {
  Hero,
  Work,
  Technologies,
  Projects,
  Services,
  Contact,
} from "./sections/Sections";
export function Portfolio() {
  const [locale, setLocale] = useState<Locale>("pt");
  const [active, setActive] = useState(0);
  const [accent, setAccent] = useState("#D4FF3A");
  const t = copy[locale] as typeof copy.pt;
  useEffect(() => {
    const saved = localStorage.getItem("felipe-locale") as Locale | null;
    const browser = navigator.language.toLowerCase().startsWith("pt")
      ? "pt"
      : "en";
    setLocale(saved === "pt" || saved === "en" ? saved : browser);
  }, []);
  useEffect(() => {
    if (active !== 3)
      setAccent(
        ["#D4FF3A", "#D4FF3A", "#6C4DFF", "#D4FF3A", "#F3F0E8", "#D4FF3A"][
          active
        ],
      );
  }, [active]);
  function changeLocale(value: Locale) {
    setLocale(value);
    localStorage.setItem("felipe-locale", value);
    document.documentElement.lang = value === "pt" ? "pt-BR" : "en";
  }
  useEffect(() => {
    const ids = [
      "sobre",
      "processo",
      "tecnologias",
      "projetos",
      "servicos",
      "contato",
    ];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const visibility = new Map<Element, IntersectionObserverEntry>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visibility.set(entry.target, entry));

        const activeEntry = Array.from(visibility.values())
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio ||
              a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];

        if (activeEntry) {
          setActive(ids.indexOf((activeEntry.target as HTMLElement).id));
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <ScrollBackground active={active} />
      <GrainOverlay />
      <SideNav
        items={t.nav}
        locale={locale}
        onLocale={changeLocale}
        active={active}
        accent={accent}
        variant="dots"
      />
      <main
        className="page tiny-black-arrow"
        style={{ "--accent": accent } as React.CSSProperties}
      >
        <Hero t={t} />
        <Work t={t} active={active === 1} />
        <Technologies t={t} active={active === 2} />
        <Projects t={t} onAccent={setAccent} active={active === 3} />
        <Services t={t} />
        <Contact t={t} locale={locale} />
      </main>
    </>
  );
}
