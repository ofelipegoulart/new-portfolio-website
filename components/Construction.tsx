"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { copy, type Locale } from "@/data/translations";
export function Construction() {
  const [locale, setLocale] = useState<Locale>("pt");
  useEffect(() => {
    const stored = localStorage.getItem("felipe-locale");
    setLocale(
      stored === "en" || stored === "pt"
        ? stored
        : navigator.language.toLowerCase().startsWith("pt")
          ? "pt"
          : "en",
    );
  }, []);
  const text = copy[locale].servicePage;
  return (
    <main className="construction">
      <span className="eyebrow">FELIPE · PORTFÓLIO</span>
      <h1>
        {text.title}
        <span>.</span>
      </h1>
      <p>{text.text}</p>
      <Link href="/"><span className="arrow-character" aria-hidden="true">←︎</span> {text.back}</Link>
    </main>
  );
}
