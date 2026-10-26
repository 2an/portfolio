"use client";

import type { ReactNode } from "react";
import { Reveal } from "./reveal";

/** One hobby: a 2.4:1 animation stage (placeholder for the real footage,
    which arrives later) beside the copy. `accent` picks the neon voice —
    teal or magenta. */
export function HobbyPanel({
  index,
  tag,
  title,
  copy,
  accent = "accent",
  children,
}: {
  index: string;
  tag: string;
  title: string;
  copy: string;
  accent?: "accent" | "flare";
  children: ReactNode;
}) {
  const textAccent = accent === "flare" ? "text-flare/70" : "text-accent/70";
  const stageHover = accent === "flare" ? "hovers:border-flare/40" : "hovers:border-accent/40";

  return (
    <Reveal className="group">
      <article className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-10">
        <div
          className={`border border-hairline bg-white/[0.02] transition-colors duration-200 ${stageHover}`}
        >
          <div className="relative aspect-[2.4/1] overflow-hidden">{children}</div>
          <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted/50">
            <span>
              {index} / {tag}
            </span>
            <span className="text-ink-muted/35">Placeholder · awaiting footage</span>
          </div>
        </div>
        <div>
          <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${textAccent}`}>
            {tag}
          </p>
          <h3 className="mt-3 font-cyber text-3xl text-ink sm:text-4xl">{title}</h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted">{copy}</p>
        </div>
      </article>
    </Reveal>
  );
}
