import Image from "next/image";
import { services } from "@/data/services";
import BookingWhatsappIllustration from "./illustrations/BookingWhatsappIllustration";
import CustomSoftwareIllustration from "./illustrations/CustomSoftwareIllustration";
import DigitalMenuCafeIllustration from "./illustrations/DigitalMenuCafeIllustration";
import IsometricStorefrontIllustration from "./illustrations/IsometricStorefrontIllustration";
import OnlineStoreIllustration from "./illustrations/OnlineStoreIllustration";
import type { Locale } from "@/data/translations";

export function ServicesSection({ locale }: { locale: Locale }) {
  return (
    <section id="servicos" className="services-section services-anchor" aria-labelledby="services-title">
      <div className="services-section-intro">
        <h2 id="services-title">{locale === "pt" ? "o que fazemos?" : "what we do?"}</h2>
      </div>
      <div className="services-stack">
        {services.map((service, index) => (
          <article
            className="service-card"
            id={service.id}
            style={{ "--service-top": `${24 + index * 18}px` } as React.CSSProperties}
            key={service.id}
          >
            <div className="service-card-copy">
              <p className="service-card-number">0{index + 1}</p>
              <h3>{service.title[locale]}</h3>
              <p className="service-card-description">{service.description[locale]}</p>
              <ul className="service-tags" aria-label={locale === "pt" ? "categorias do serviço" : "service categories"}>
                {service.tags.slice(0, 3).map((tag) => <li key={tag[locale]}>{tag[locale]}</li>)}
                {service.tags.length > 3 && (
                  <li className="service-tags-more">+{service.tags.length - 3}</li>
                )}
              </ul>
              <a className="services-pill services-pill-dark" href={`#${service.id}`}>
                {locale === "pt" ? "ver mais" : "see more"}
              </a>
            </div>
            <div className="service-card-image">
              {service.id === "sites-negocios-locais" ? (
                <IsometricStorefrontIllustration
                  alt={service.title[locale]}
                  zoom={1.55}
                  className="service-card-illustration"
                />
              ) : service.id === "sistema-gestao-sob-medida" ? (
                <CustomSoftwareIllustration
                  alt={service.title[locale]}
                  zoom={1.55}
                  className="service-card-illustration"
                />
              ) : service.id === "cardapio-digital-pedidos-online" ? (
                <DigitalMenuCafeIllustration
                  alt={service.title[locale]}
                  zoom={1.55}
                  className="service-card-illustration"
                />
              ) : service.id === "loja-virtual" ? (
                <OnlineStoreIllustration
                  alt={service.title[locale]}
                  zoom={1.55}
                  className="service-card-illustration"
                />
              ) : service.id === "agendamento-automacao-whatsapp" ? (
                <BookingWhatsappIllustration
                  alt={service.title[locale]}
                  zoom={1.55}
                  className="service-card-illustration"
                />
              ) : (
                <Image
                  src={service.image}
                  alt={service.title[locale]}
                  fill
                  sizes="(max-width: 700px) 100vw, 52vw"
                />
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
