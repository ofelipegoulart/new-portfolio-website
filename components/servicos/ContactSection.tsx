import type { Locale } from "@/data/translations";
import { PortfolioFooter } from "@/components/PortfolioFooter";
import { ContactModal } from "./ContactModal";

export function ContactSection({ locale }: { locale: Locale }) {
  const content = locale === "pt"
    ? {
      title: "vamos conversar?",
      text: "tem uma ideia, um desafio ou só quer trocar experiências? minha caixa de entrada está aberta.",
    cta: "mande um oi",
    }
    : {
    title: "let’s talk.",
    text: "have an idea, a challenge, or just want to exchange thoughts? my inbox is open.",
    cta: "say hello",
    };

  return (
    <section id="contato" className="services-contact services-anchor" aria-labelledby="contact-title">
      <h2 id="contact-title">{content.title}</h2>
      <p>{content.text}</p>
      <ContactModal
        locale={locale}
        className="services-contact-cta"
        label={content.cta}
      />
      <PortfolioFooter backTo="#inicio" />
    </section>
  );
}
