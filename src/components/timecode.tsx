"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

const FPS = 24;
const REEL_SECONDS = 24;

const pad = (n: number) => String(n).padStart(2, "0");

/** Corner timecode that advances as you scroll — the page as a 24s reel. */
export function Timecode() {
  const { scrollYProgress } = useScroll();
  const [tc, setTc] = useState("TC 00:00:00:00");

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const frame = Math.round(v * REEL_SECONDS * FPS);
    const f = frame % FPS;
    const s = Math.floor(frame / FPS) % 60;
    const m = Math.floor(frame / (FPS * 60));
    const next = `TC 00:${pad(m)}:${pad(s)}:${pad(f)}`;
    setTc((prev) => (prev === next ? prev : next));
  });

  return (
    <div
      className="fixed bottom-4 right-5 z-[70] font-mono text-[10px] tracking-[0.3em] text-ink-muted/60"
      aria-hidden
    >
      {tc}
    </div>
  );
}
