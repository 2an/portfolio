"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.p
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-sm tracking-[0.3em] uppercase text-neutral-500"
      >
        Portfolio
      </motion.p>
      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-5xl sm:text-7xl font-semibold tracking-tight text-neutral-50"
      >
        Tuan Ngo
      </motion.h1>
      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="max-w-md text-neutral-400"
      >
        Software developer. Building a website that is about me — and about what
        the web can do.
      </motion.p>
      <motion.p
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-sm text-neutral-600"
      >
        This page is a starter — the story comes next.
      </motion.p>
    </main>
  );
}
