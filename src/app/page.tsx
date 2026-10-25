"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const NAV = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

// Placeholder content — replace with real details (do not ship as-is).
const EXPERIENCE = [
  { period: "20XX — now", role: "Role", company: "Company" },
  { period: "20XX — 20XX", role: "Role", company: "Company" },
  { period: "20XX — 20XX", role: "Role", company: "Company" },
];

const PROJECTS = [
  { title: "Project", blurb: "One line about what it is and why it exists." },
  { title: "Project", blurb: "One line about what it is and why it exists." },
  { title: "Project", blurb: "One line about what it is and why it exists." },
  { title: "Project", blurb: "One line about what it is and why it exists." },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <a href="/" className="font-mono text-sm text-neutral-400 transition-colors hover:text-neutral-100">
          tn.
        </a>
        <nav className="flex gap-5 text-sm text-neutral-500 sm:gap-7">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-neutral-100">
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center gap-6 px-6 py-28 text-center sm:py-40">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-xs uppercase tracking-[0.3em] text-neutral-500"
          >
            Portfolio
          </motion.p>
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-5xl font-semibold tracking-tight text-neutral-50 sm:text-7xl"
          >
            Tuan Ngo
          </motion.h1>
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-md text-lg text-neutral-400"
          >
            Software developer — building a website that is about me, and about
            what the web can do.
          </motion.p>
        </section>

        <Section id="about" eyebrow="About" title="Who I am">
          <Reveal delay={0.1}>
            <p className="max-w-xl italic leading-relaxed text-neutral-600">
              A few sentences about who I am, what I build, and what I am
              looking for. Placeholder — replace with your own words.
            </p>
          </Reveal>
        </Section>

        <Section id="experience" eyebrow="CV" title="Experience">
          <div>
            {EXPERIENCE.map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-neutral-800/60 py-5 sm:grid-cols-[10rem_1fr]">
                  <span className="pt-1 font-mono text-xs text-neutral-500">{item.period}</span>
                  <div>
                    <p className="italic text-neutral-400">{item.role}</p>
                    <p className="mt-0.5 text-sm italic text-neutral-600">{item.company}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="projects" eyebrow="Work" title="Projects">
          <div className="grid gap-4 sm:grid-cols-2">
            {PROJECTS.map((item, i) => (
              <Reveal key={i} delay={(i % 2) * 0.08}>
                <article className="group h-full rounded-lg border border-neutral-800/80 p-6 transition-colors hover:border-neutral-600">
                  <h3 className="font-medium text-neutral-100">{item.title}</h3>
                  <p className="mt-2 text-sm italic leading-relaxed text-neutral-600">{item.blurb}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="contact" eyebrow="Contact" title="Get in touch">
          <Reveal delay={0.1}>
            <p className="max-w-md leading-relaxed text-neutral-400">
              Placeholder — your email and the places people can find you go
              here.
            </p>
            <a
              href="mailto:hello@example.com"
              className="mt-6 inline-flex items-center rounded-full border border-neutral-700 px-5 py-2.5 font-mono text-sm text-neutral-200 transition-colors hover:border-neutral-400 hover:text-white"
            >
              hello@example.com
            </a>
          </Reveal>
        </Section>
      </main>

      <footer className="border-t border-neutral-800/80">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-8 font-mono text-xs text-neutral-600">
          <span>© 2026 Tuan Ngo</span>
          <span>Next.js · Framer Motion</span>
        </div>
      </footer>
    </div>
  );
}
