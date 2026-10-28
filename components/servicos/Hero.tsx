import ProductStoryFrame from "./illustrations/ProductStoryFrame";
import { ContactModal } from "./ContactModal";

export type ServicesHeroVariant =
  | "default"
  | "diagonal"
  | "orbit"
  | "ribbon"
  | "crop"
  | "route";

export function ServicesHero({
  variant = "default",
  locale = "pt",
}: {
  variant?: ServicesHeroVariant;
  locale?: "pt" | "en";
}) {
  const t = locale === "pt" ? {
    idea: "você tem a ideia.", work: "eu faço ela funcionar.",
    lede: "sites, sistemas e integrações feitos com conversa clara e prazo combinado. sem sumiço, sem enrolação.",
    cta: "vem conhecer meus serviços",
  } : {
    idea: "you have the idea.", work: "i make it work.",
    lede: "websites, systems, and integrations built with clear communication and an agreed timeline. no disappearing, no runaround.",
    cta: "explore my services",
  };

  return (
    <section
      id="inicio"
      className={`services-hero services-anchor services-hero-${variant}`}
      aria-labelledby="services-hero-title"
    >
      <div className="services-hero-copy">
        <h1 id="services-hero-title">
          <span>{t.idea}</span>
          <em>{t.work}</em>
        </h1>
        <div className="services-hero-footer">
          <p className="services-hero-lede">
            {t.lede}
          </p>
          <div className="services-hero-ctas">
            <a className="services-hero-cta" href="#servicos">
              <span>{t.cta}</span>
              <span className="services-hero-cta-arrow" aria-hidden="true">
                ↘︎
              </span>
            </a>
            <ContactModal locale={locale} />
          </div>
        </div>
      </div>
      <div className="services-hero-graphic" aria-hidden="true">
        <ProductStoryFrame locale={locale} className="services-hero-story" />
      </div>
    </section>
  );
}
