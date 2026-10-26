"use client";

import { motion, useReducedMotion } from "framer-motion";

const BREATH = 4.2;

/** Iaido stage: a meditating figure, a katana in front, and a shimmer
    that sweeps down the blade once per breath. Placeholder for real
    footage (arrives later). */
export function IaidoAnim() {
  const reduce = useReducedMotion();

  return (
    <svg viewBox="0 0 480 200" className="h-full w-full" aria-hidden>
      {/* Ground line */}
      <line
        x1={36}
        y1={172}
        x2={444}
        y2={172}
        stroke="var(--color-hairline)"
        strokeWidth={1}
      />
      {/* Meditating figure — breathing */}
      <motion.g
        style={{ filter: "drop-shadow(0 0 7px rgba(224, 81, 143, 0.4))" }}
        animate={reduce ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: BREATH, ease: "easeInOut", repeat: Infinity }}
      >
        <circle
          cx={170}
          cy={62}
          r={13}
          fill="none"
          stroke="var(--color-flare)"
          strokeWidth={2}
        />
        {/* Shoulders / torso */}
        <path
          d="M 138 134 Q 170 82 202 134"
          fill="none"
          stroke="var(--color-flare)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Arms resting to the knees */}
        <line
          x1={152}
          y1={106}
          x2={140}
          y2={140}
          stroke="var(--color-flare)"
          strokeOpacity={0.8}
          strokeWidth={1.5}
        />
        <line
          x1={188}
          y1={106}
          x2={200}
          y2={140}
          stroke="var(--color-flare)"
          strokeOpacity={0.8}
          strokeWidth={1.5}
        />
        {/* Crossed lap */}
        <path
          d="M 120 152 Q 170 172 220 152"
          fill="none"
          stroke="var(--color-flare)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </motion.g>
      {/* Lock-on reticle sweeping around the blade */}
      {!reduce && (
        <g className="cp-spin">
          <circle
            cx={332}
            cy={103}
            r={56}
            fill="none"
            stroke="var(--color-flare)"
            strokeOpacity={0.22}
            strokeDasharray="3 14"
          />
        </g>
      )}
      {/* Katana in front */}
      <g style={{ filter: "drop-shadow(0 0 6px rgba(224, 81, 143, 0.5))" }}>
        {/* Blade */}
        <line
          x1={352}
          y1={54}
          x2={312}
          y2={152}
          stroke="var(--color-ink)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Tsuka */}
        <line
          x1={352}
          y1={54}
          x2={364}
          y2={28}
          stroke="var(--color-ink)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* Tsuba */}
        <line
          x1={335}
          y1={70}
          x2={353}
          y2={77}
          stroke="var(--color-chrome)"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>
      {/* Shimmer sweeping down the blade, synced to the breath */}
      {!reduce && (
        <motion.path
          d="M 352 54 L 312 152"
          fill="none"
          stroke="var(--color-chrome)"
          strokeWidth={1}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.9, 0.9, 0] }}
          transition={{
            duration: BREATH,
            repeat: Infinity,
            opacity: { times: [0, 0.25, 0.7, 1] },
          }}
        />
      )}
    </svg>
  );
}
