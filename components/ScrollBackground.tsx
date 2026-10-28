"use client";
import { useEffect } from "react";
const stops = [
  "#6C4DFF",
  "#0F0F14",
  "#F3F0E8",
  "#0F0F14",
  "#FF5A4E",
  "#0F0F14",
];
const foregrounds = [
  "#F3F0E8",
  "#F3F0E8",
  "#0F0F14",
  "#F3F0E8",
  "#0F0F14",
  "#F3F0E8",
];
const backgroundVariable = "--page-bg";
export function ScrollBackground({
  active,
  stopsOverride,
  foregroundsOverride,
}: {
  active: number;
  stopsOverride?: readonly string[];
  foregroundsOverride?: readonly string[];
}) {
  const activeStops = stopsOverride ?? stops;
  const activeForegrounds = foregroundsOverride ?? foregrounds;
  const discrete = activeStops[active] || activeStops[0];

  useEffect(() => {
    document.documentElement.style.setProperty(
      backgroundVariable,
      discrete,
    );
    document.body.style.backgroundColor = discrete;
    document.documentElement.style.setProperty(
      "--fg",
      activeForegrounds[active] || activeForegrounds[0],
    );
  }, [active, discrete]);
  return (
    <div
      className="scroll-bg"
      aria-hidden="true"
      style={{ backgroundColor: discrete }}
    />
  );
}
