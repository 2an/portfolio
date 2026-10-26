"use client";

import type { ReactNode } from "react";
import { Reveal } from "./reveal";
import { GlitchText } from "./glitch-text";

const VOICE = {
  chrome: {
    text: "text-chrome/80",
    border: "hovers:border-chrome/50",
    corner: "text-chrome/60",
    dot: "bg-chrome",
    hazard: "",
  },
  flare: {
    text: "text-flare/80",
    border: "hovers:border-flare/50",
    corner: "text-flare/60",
    dot: "bg-flare",
    hazard: "cp-hazard--flare",
  },
} as const;

/** One hobby, Cyberpunk 2077 voice: chamfered plate with HUD corner
    brackets, REC blink, hazard band, and a skewed glitching title.
    The 2.4:1 stage holds the placeholder animation (real footage later). */
export function HobbyPanel({
  index,
  tag,
  title,
  copy,
  accent = "chrome",
  children,
}: {
  index: string;
  tag: string;
  title: string;
  copy: string;
  accent?: "chrome" | "flare";
  children: ReactNode;
}) {
  const v = VOICE[accent];

  return (
    <Reveal className="group">
      <article className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-10">
        {/* Stage plate */}
        <div
          className={`chamfer relative border border-hairline bg-white/[0.02] transition-colors duration-200 ${v.border}`}
        >
          <span className={`hud-corner hud-corner--tl ${v.corner}`} aria-hidden />
          <span className={`hud-corner hud-corner--br ${v.corner}`} aria-hidden />
          <div className="relative aspect-[2.4/1] overflow-hidden">
            <div className="cp-hud-grid absolute inset-0" aria-hidden />
            <div className="absolute inset-0">{children}</div>
            {/* HUD readouts */}
            <div
              className="absolute right-3 top-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-ink-muted/60"
              aria-hidden
            >
              <span className={`cp-blink inline-block h-1.5 w-1.5 rounded-full ${v.dot}`} />
              <span>Rec</span>
            </div>
            <div
              className="absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted/45"
              aria-hidden
            >
              Subject // {tag}
            </div>
          </div>
          <div className={`cp-hazard mx-2 h-1.5 ${v.hazard}`} aria-hidden />
          <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted/50">
            <span>
              {index} / {tag}
            </span>
            <span className="text-ink-muted/35">Placeholder · awaiting footage</span>
          </div>
        </div>
        {/* Copy */}
        <div>
          <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${v.text}`}>
            <span className="mr-2 opacity-60">///</span>
            {tag}
          </p>
          <h3 className="mt-3 -skew-x-6 font-cyber text-3xl uppercase italic text-ink sm:text-4xl">
            <GlitchText text={title} className="cp-title" />
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted">{copy}</p>
        </div>
      </article>
    </Reveal>
  );
}
