"use client";

import { useEffect, useState } from "react";

/** Text that RGB-glitches: once shortly after mount, then at random
    intervals. Base state keeps a subtle cyan/magenta fringe. */
export function GlitchText({ text, className }: { text: string; className?: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let alive = true;
    let timer: number;
    const burst = () => {
      if (!alive) return;
      setOn(true);
      window.setTimeout(() => alive && setOn(false), 280 + Math.random() * 320);
      timer = window.setTimeout(burst, 2500 + Math.random() * 4500);
    };
    const first = window.setTimeout(burst, 900);
    return () => {
      alive = false;
      window.clearTimeout(first);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <span data-text={text} className={`glitch ${on ? "glitching" : ""} ${className ?? ""}`}>
      {text}
    </span>
  );
}
