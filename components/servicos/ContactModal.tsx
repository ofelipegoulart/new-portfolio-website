"use client";

import { useEffect, useState } from "react";

export function ContactModal({
  locale,
  className = "",
  label,
}: {
  locale: "pt" | "en";
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const isPortuguese = locale === "pt";

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <button
        className={`services-hero-cta services-hero-cta-contact ${className}`}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span>{label ?? (isPortuguese ? "vamos conversar" : "let’s talk")}</span>
        <span className="services-hero-cta-arrow" aria-hidden="true">
          ↘︎
        </span>
      </button>
      {open && (
        <div
          className="contact-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            className="contact-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <button
              className="contact-modal-close"
              type="button"
              aria-label={isPortuguese ? "fechar contatos" : "close contacts"}
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <h2 id="contact-modal-title">
              {isPortuguese ? "vamos conversar?" : "let’s talk"}
            </h2>
            <div className="contact-modal-links">
              <a href="mailto:ofelipegoulart@gmail.com">
                e-mail <span>ofelipegoulart@gmail.com</span>
              </a>
              <a
                href="https://linkedin.com/in/ofelipegoulart"
                target="_blank"
                rel="noreferrer"
              >
                linkedin <span>/in/ofelipegoulart</span>
              </a>
              <a
                href="https://wa.me/5548991636186?text=ol%C3%A1%2C%20Felipe%21%20Quero%20conversar%20sobre%20um%20projeto."
                target="_blank"
                rel="noreferrer"
              >
                {isPortuguese ? "telefone" : "phone"} <span>+55 48 99163-6186</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
