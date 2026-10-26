"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Name with a constant cyan/pink RGB split that throws a hard
    multi-band "tear" burst every ~4–7 s — dramatic, but the real text
    stays stable and readable between bursts (and untouched under
    prefers-reduced-motion). */
export function GlitchText({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (reduce) return;
    let alive = true;
    let timer: number;
    const burst = () => {
      if (!alive) return;
      setOn(true);
      window.setTimeout(() => alive && setOn(false), 420);
      timer = window.setTimeout(burst, 3800 + Math.random() * 3200);
    };
    const first = window.setTimeout(burst, 2200);
    return () => {
      alive = false;
      window.clearTimeout(first);
      window.clearTimeout(timer);
    };
  }, [reduce]);

  return (
    <span data-text={text} className={`glitch ${on ? "glitching" : ""} ${className ?? ""}`}>
      {text}
    </span>
  );
}
