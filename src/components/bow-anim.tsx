"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Easing } from "framer-motion";

const REST = 132; // nock x at rest
const DRAWN = 96; // nock x at full draw
const CYCLE = 3.8;
// idle → draw → hold → loose → settle
const TIMES = [0, 0.18, 0.48, 0.6, 0.7, 1];
const EASES: Easing[] = ["easeInOut", "easeInOut", "easeOut", "linear", "linear"];

const STRING_REST = `M 120 28 L ${REST} 100 L 120 172`;
const STRING_DRAWN = `M 120 28 L ${DRAWN} 100 L 120 172`;

/** Neon line-art archer: draw, hold, loose — on loop. Placeholder stage
    for the real parkour-archery footage (arrives later). */
export function BowAnim() {
  const reduce = useReducedMotion();

  if (reduce) {
    // Static full-draw pose
    return (
      <svg viewBox="0 0 480 200" className="h-full w-full" aria-hidden>
        <circle
          cx={400}
          cy={100}
          r={30}
          fill="none"
          stroke="var(--color-flare)"
          strokeOpacity={0.4}
          strokeDasharray="4 6"
        />
        <circle
          cx={400}
          cy={100}
          r={11}
          fill="none"
          stroke="var(--color-flare)"
          strokeOpacity={0.5}
        />
        <path
          d="M 120 28 Q 76 100 120 172"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <path
          d={STRING_DRAWN}
          fill="none"
          stroke="var(--color-ink)"
          strokeOpacity={0.75}
          strokeWidth={1.5}
        />
        <g transform={`translate(${DRAWN - REST}, 0)`}>
          <Arrow />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 480 200" className="h-full w-full" aria-hidden>
      {/* Target — lock-on ring spins slowly, flares when the arrow arrives */}
      <g className={reduce ? undefined : "cp-spin"}>
        <motion.circle
          cx={400}
          cy={100}
          r={30}
          fill="none"
          stroke="var(--color-chrome)"
          strokeDasharray="6 8"
          animate={{ strokeOpacity: [0.35, 0.35, 0.95, 0.35, 0.35] }}
          transition={{
            duration: CYCLE,
            times: [0, 0.62, 0.78, 0.9, 1],
            repeat: Infinity,
          }}
        />
      </g>
      <circle
        cx={400}
        cy={100}
        r={11}
        fill="none"
        stroke="var(--color-flare)"
        strokeOpacity={0.55}
      />
      {/* Limb — thumps on release */}
      <motion.path
        d="M 120 28 Q 76 100 120 172"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={3}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 6px rgba(69, 229, 222, 0.45))" }}
        animate={{ scaleY: [1, 1, 0.955, 1, 1] }}
        transition={{
          duration: CYCLE,
          times: [0, 0.6, 0.66, 0.78, 1],
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      {/* String */}
      <motion.path
        d={STRING_REST}
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.75}
        strokeWidth={1.5}
        animate={{ d: [STRING_REST, STRING_REST, STRING_DRAWN, STRING_DRAWN, STRING_REST, STRING_REST] }}
        transition={{ duration: CYCLE, times: TIMES, repeat: Infinity, ease: EASES }}
      />
      {/* Drawing hand on the nock */}
      <motion.circle
        cy={100}
        r={4}
        fill="var(--color-accent)"
        animate={{ cx: [REST, REST, DRAWN, DRAWN, REST, REST] }}
        transition={{ duration: CYCLE, times: TIMES, repeat: Infinity, ease: EASES }}
      />
      {/* Arrow — drawn with the hand, then loose */}
      <motion.g
        animate={{
          x: [0, 0, DRAWN - REST, DRAWN - REST, 268, 268],
          opacity: [1, 1, 1, 1, 1, 0, 0, 1],
        }}
        transition={{
          x: { duration: CYCLE, times: TIMES, repeat: Infinity, ease: EASES },
          opacity: {
            duration: CYCLE,
            times: [0, 0.18, 0.6, 0.7, 0.78, 0.8, 0.95, 1],
            repeat: Infinity,
          },
        }}
      >
        <Arrow />
      </motion.g>
    </svg>
  );
}

function Arrow() {
  return (
    <g>
      <line x1={REST} y1={100} x2={216} y2={100} stroke="var(--color-ink)" strokeWidth={2} />
      <line x1={216} y1={100} x2={205} y2={93} stroke="var(--color-chrome)" strokeWidth={2} />
      <line x1={216} y1={100} x2={205} y2={107} stroke="var(--color-chrome)" strokeWidth={2} />
      {/* Fletching */}
      <line
        x1={REST + 6}
        y1={100}
        x2={REST + 13}
        y2={94}
        stroke="var(--color-chrome)"
        strokeWidth={2}
      />
      <line
        x1={REST + 6}
        y1={100}
        x2={REST + 13}
        y2={106}
        stroke="var(--color-chrome)"
        strokeWidth={2}
      />
    </g>
  );
}
