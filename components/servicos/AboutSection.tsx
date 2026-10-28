import type { Locale } from "@/data/translations";

export function AboutSection({ locale }: { locale: Locale }) {
  const content = locale === "pt"
    ? {
        title: "sobre mim",
        text: "com 6 anos de experiência em desenvolvimento de software e graduado em Ciências da Computação pela UFSC, ajudo empresas a transformar ideias em produtos digitais, aplicações web e sistemas sob medida. gosto de construir soluções que fazem sentido para quem usa, com tecnologia, design e estratégia para gerar resultados reais.",
      }
    : {
        title: "about me",
        text: "with 6 years of experience in software development and a degree in Computer Science from UFSC, i help businesses turn ideas into digital products, web applications, and custom software. i enjoy building solutions that make sense to the people who use them, combining technology, design, and strategy to create real results.",
      };

  return (
    <section id="sobre" className="section about services-about services-anchor" aria-labelledby="about-title">
      <h2 id="about-title">{content.title}</h2>
      <p>{content.text}</p>
      <div className="services-about-slot" aria-hidden="true" />
    </section>
  );
}
