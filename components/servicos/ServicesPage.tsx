"use client";

import { useEffect, useState } from "react";
import { GrainOverlay } from "@/components/GrainOverlay";
import { ScrollBackground } from "@/components/ScrollBackground";
import { type Locale } from "@/data/translations";
import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { ServicesHero, type ServicesHeroVariant } from "./Hero";
import { ServicesNav } from "./ServicesNav";
import { ServicesSection } from "./ServicesSection";

const sections = ["inicio", "servicos", "sobre", "contato"] as const;
export function ServicesPage({
  heroVariant = "default",
}: {
  heroVariant?: ServicesHeroVariant;
}) {
  const [locale, setLocale] = useState<Locale>("pt");
  const [active, setActive] = useState(0);
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("felipe-locale");
    if (saved === "pt" || saved === "en") setLocale(saved);

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
          setActive(sections.indexOf((activeEntry.target as HTMLElement).id as typeof sections[number]));
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let previousY = window.scrollY;
    setNavVisible(previousY <= 80);

    const handleScroll = () => {
      const currentY = Math.max(0, window.scrollY);
      if (currentY <= 80) {
        setNavVisible(true);
      } else if (currentY < previousY - 4) {
        setNavVisible(true);
      } else if (currentY > previousY + 4) {
        setNavVisible(false);
      }
      previousY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLocale = (value: Locale) => {
    setLocale(value);
    localStorage.setItem("felipe-locale", value);
    document.documentElement.lang = value === "pt" ? "pt-BR" : "en";
  };

  return (
    <>
      <ScrollBackground
        active={active}
        stopsOverride={["var(--violet)", "var(--ink)", "var(--paper)", "var(--ink)"]}
        foregroundsOverride={["var(--paper)", "var(--paper)", "var(--ink)", "var(--paper)"]}
      />
      <GrainOverlay />
      <ServicesNav
        locale={locale}
        onLocale={changeLocale}
        active={active}
        ids={sections}
        hidden={!navVisible}
      />
      <main className="page services-page tiny-black-arrow">
        <ServicesHero variant={heroVariant} locale={locale} />
        <ServicesSection locale={locale} />
        <AboutSection locale={locale} />
        <ContactSection locale={locale} />
      </main>
    </>
  );
}
