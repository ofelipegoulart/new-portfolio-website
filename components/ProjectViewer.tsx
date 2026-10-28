"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/data/projects";
import type { copy } from "@/data/translations";
type ProjectCopy = typeof copy.pt.projects;
export function ProjectViewer({
  text,
  onAccent,
}: {
  text: ProjectCopy;
  onAccent: (color: string) => void;
}) {
  const [selected, setSelected] = useState(0);
  const project = projects[selected];
  const item = text.items[selected];
  function choose(i: number) {
    setSelected(i);
    onAccent(projects[i].accentColor);
  }
  return (
    <div
      className="project-layout"
      style={{ "--project-accent": project.accentColor } as React.CSSProperties}
    >
      <div className="project-list">
        {projects.map((p, i) => (
          <button
            key={p.id}
            onClick={() => choose(i)}
            className={i === selected ? "current" : ""}
          >
            <span>{p.id}</span>
            <strong>{text.items[i].title}</strong>
            <small>{text.items[i].description}</small>
            <b className="arrow-character" aria-hidden="true">↗︎</b>
          </button>
        ))}
      </div>
      <div className="project-detail">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            className="project-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <picture className="project-image">
              <source media="(max-width: 700px)" srcSet={project.mobileImage} />
              <img src={project.desktopImage} alt={item.title} />
            </picture>
          </motion.div>
        </AnimatePresence>
        <div className="project-caption">
          <div>
            <span className="eyebrow">
              0{selected + 1} / {String(projects.length).padStart(2, "0")} · {project.year}
            </span>
            <h3>{item.title}</h3>
            <p>{item.details}</p>
            <div className="stack">
              {project.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
          <div className="project-actions">
            <a href={project.url} target="_blank" rel="noreferrer">
              {text.visit} <span className="arrow-character" aria-hidden="true">↗︎</span>
            </a>
            <a href={project.repo} target="_blank" rel="noreferrer">
              {text.code} <span className="arrow-character" aria-hidden="true">↗︎</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
