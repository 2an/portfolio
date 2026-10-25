"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Name that keeps a faint cyan/magenta fringe and throws a short
    slice-glitch burst rarely (not constantly) — an easter-egg, not a
    headline effect. */
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
      window.setTimeout(() => alive && setOn(false), 260);
      timer = window.setTimeout(burst, 8000 + Math.random() * 8000);
    };
    const first = window.setTimeout(burst, 3000);
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
