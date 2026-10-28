"use client";
import { useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import {
  siSpringboot, siPython, siTypescript, siNextdotjs, siReact,
  siMysql, siPostgresql, siDocker, siGitlab, siGit, siGithub,
  siPandas, siMetabase, siClaudecode, siCursor,
} from "simple-icons";
import {
  Coffee, Cloud, Network, FlaskConical, ScanSearch, Bot,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { technologies } from "@/data/technologies";

const brandIcons = {
  springboot: siSpringboot, python: siPython, typescript: siTypescript,
  nextdotjs: siNextdotjs, react: siReact, mysql: siMysql, postgresql: siPostgresql,
  docker: siDocker, gitlab: siGitlab, git: siGit, github: siGithub,
  pandas: siPandas, metabase: siMetabase,
  claudecode: siClaudecode, cursor: siCursor,
} as const;

const utilityIcons: Record<string, LucideIcon> = {
  coffee: Coffee, cloud: Cloud, api: Network,
  test: FlaskConical, scraping: ScanSearch,
};
export function TechGrid({
  copy,
}: {
  copy: {
    title: string;
    hint: string;
    filters: readonly string[];
    note: string;
  };
}) {
  const [filters, setFilters] = useState<Set<string>>(new Set());
  const [revealedCategory, setRevealedCategory] = useState<string | null>(null);
  const keys = ["all", "backend", "frontend", "databases", "devops", "tools"];
  const toggleFilter = (key: string) => {
    setFilters((current) => {
      if (key === "all") return new Set();
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  return (
    <>
      <div className="section-heading light-heading">
        <div>
          <h2>
            {copy.title}
          </h2>
        </div>
        <p className="hand-note">
          <svg
            className="hand-note-arrow"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path d="M17 2C14 8 9 12 3 15M3 15l1-5m-1 5 5-1" />
          </svg>
          {copy.hint}
        </p>
      </div>
      <div className="tech-filters">
        {copy.filters.map((label, i) => (
          <button
            key={label}
            onClick={() => toggleFilter(keys[i])}
            className={(i === 0 ? filters.size === 0 : filters.has(keys[i])) ? "selected" : ""}
            aria-pressed={i === 0 ? filters.size === 0 : filters.has(keys[i])}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="tech-note">{copy.note}</p>
      <LayoutGroup>
        <div className="tech-grid">
          {technologies.map((tech, i) => {
            const active = filters.size === 0 || filters.has(tech.category);
            const categoryLabel = copy.filters[keys.indexOf(tech.category)];
            return (
              <motion.button
                layout
                type="button"
                key={tech.name}
                className={`tech-item ${active ? "tech-active" : "tech-muted"} ${revealedCategory === tech.name ? "category-revealed" : ""}`}
                onClick={() => setRevealedCategory((current) => current === tech.name ? null : tech.name)}
                aria-label={`${tech.name}: ${categoryLabel}`}
                aria-expanded={revealedCategory === tech.name}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              >
                <span
                  className="tech-mark"
                  style={{ transitionDelay: `${i * 15}ms` }}
                >
                  {tech.icon in brandIcons ? (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                      style={{ fill: `#${brandIcons[tech.icon as keyof typeof brandIcons].hex}` }}
                    >
                      <path d={brandIcons[tech.icon as keyof typeof brandIcons].path} />
                    </svg>
                  ) : (() => {
                    const Icon = utilityIcons[tech.icon] ?? Bot;
                    return <Icon aria-hidden="true" size={32} strokeWidth={1.8} />;
                  })()}
                </span>
                <span>{tech.name}</span>
                <span className="tech-category" aria-hidden="true">{categoryLabel}</span>
                <small>0{i + 1}</small>
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
    </>
  );
}
