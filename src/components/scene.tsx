"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { EASE_OUT } from "@/lib/easing";
import { Reveal } from "./reveal";

/** A "scene": slate eyebrow, serif title revealed through a line mask, and a
    ghost scene number drifting on its own parallax layer. */
export function Scene({
  id,
  number,
  eyebrow,
  title,
  children,
  wide = false,
}: {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const reduce = useReducedMotion();
  const ghostRef = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ghostRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section id={id} className="relative overflow-hidden border-t border-hairline">
      <motion.span
        ref={ghostRef}
        style={{ y: reduce ? 0 : y }}
        className="scene-ghost"
        aria-hidden
      >
        {number}
      </motion.span>
      <div
        className={`relative mx-auto w-full px-6 py-24 sm:py-32 ${
          wide ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent/80">
            SC. {number} · {eyebrow}
          </p>
        </Reveal>
        <div className="line-mask mt-4">
          <motion.h2
            initial={{ y: reduce ? "0%" : "112%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
            className="font-display text-5xl leading-tight text-ink sm:text-6xl"
          >
            {title}
          </motion.h2>
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
