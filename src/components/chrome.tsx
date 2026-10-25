"use client";

import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { NAV } from "@/lib/site";

/** 2.39:1 letterbox bars — full strength over the title frame, a thin
    persisting frame once the film starts. Spring so scroll-back retargets. */
export function Letterbox() {
  const { scrollY } = useScroll();
  const scale = useSpring(useTransform(scrollY, [0, 480], [1, 0.16]), {
    stiffness: 120,
    damping: 26,
    mass: 0.6,
  });
  return (
    <>
      <motion.div
        style={{ scaleY: scale }}
        className="letterbox-bar letterbox-bar--top"
        aria-hidden
      />
      <motion.div
        style={{ scaleY: scale }}
        className="letterbox-bar letterbox-bar--bottom"
        aria-hidden
      />
    </>
  );
}

/** Amber hairline across the top — the reel's running progress. */
export function Progress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-px origin-left bg-accent/60"
      aria-hidden
    />
  );
}

/** Mini nav that fades in once the title frame has scrolled away. */
export function MiniNav() {
  const { scrollY } = useScroll();
  const opacity = useSpring(useTransform(scrollY, [420, 640], [0, 1]), {
    stiffness: 120,
    damping: 20,
  });
  const y = useTransform(scrollY, [420, 640], [-10, 0]);
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setVisible(v > 420));

  return (
    <motion.nav
      style={{ opacity, y, pointerEvents: visible ? "auto" : "none" }}
      className="fixed inset-x-0 top-0 z-[70] flex items-center justify-between bg-[linear-gradient(to_bottom,rgba(10,12,13,0.9),transparent)] px-6 pb-8 pt-4 sm:px-10"
    >
      <a href="#top" className="font-display text-lg text-ink">
        tn<span className="text-accent">.</span>
      </a>
      <div className="flex gap-5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted sm:gap-7">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="transition-colors duration-150 hovers:text-accent"
          >
            {item.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
