"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { EASE_OUT } from "@/lib/easing";
import { NAV } from "@/lib/site";
import { FilmGrain } from "@/components/film-grain";
import { Letterbox, MiniNav, Progress } from "@/components/chrome";
import { GridFloor } from "@/components/grid-floor";
import { GlitchText } from "@/components/glitch-text";
import { Scanlines } from "@/components/scanlines";
import { Scene } from "@/components/scene";
import { Reveal } from "@/components/reveal";
import { Timecode } from "@/components/timecode";
import { BowAnim } from "@/components/bow-anim";
import { IaidoAnim } from "@/components/iaido-anim";
import { HobbyPanel } from "@/components/hobby-panel";

const pad2 = (n: number) => String(n).padStart(2, "0");

/* Drafted from ~/Projects — swap in real copy (email, years, links) before shipping. */

const SKILLS = [
  {
    label: "Front",
    title: "Frontend & Interface",
    items: [
      "TypeScript",
      "Angular (SSR)",
      "React / Next.js",
      "Three.js / WebGL",
      "Tailwind CSS",
      "Progressive Web Apps",
    ],
  },
  {
    label: "Back",
    title: "Backend & APIs",
    items: [
      "Go",
      "Transactional API design",
      "Firebase / Firestore",
      "Tailscale networking",
      "Docker",
      "Static + integration tests",
    ],
  },
  {
    label: "AI",
    title: "AI & Local Models",
    items: [
      "Local LLMs — Ollama, MLX",
      "Agent systems (Hermes)",
      "MCP servers",
      "RAG: indexing + chat",
      "Python",
    ],
  },
  {
    label: "Ops",
    title: "Infrastructure & Ops",
    items: [
      "CI/CD — GitHub Actions",
      "macOS / launchd automation",
      "Idempotent setup scripts",
      "Dry-run deploy tooling",
      "Backups & monitoring",
    ],
  },
];

const FILMOGRAPHY = [
  {
    title: "DocVault",
    years: "2025 – 26",
    blurb:
      "A private, local-only index + chat over scanned documents. Every model call runs on the owner's own Mac; the phone reaches it over Tailscale.",
    tags: ["Go", "Angular PWA", "Ollama", "MCP"],
  },
  {
    title: "Tava Loyalty",
    years: "2025",
    blurb:
      "A digital stamp card for a neighborhood cafe — Google Wallet first, a transactional Go API behind it, and deploy tooling that rehearses every move.",
    tags: ["Go", "Firebase", "Docker", "CI/CD"],
  },
  {
    title: "Tava Cafe",
    years: "2025",
    blurb:
      "SSR Angular website for Tava Cafe — German-first, Three.js visuals, shipped to a static edge.",
    tags: ["Angular 19", "SSR", "Three.js", "Netlify"],
  },
  {
    title: "ZazenCodes — Season 3",
    years: "2025",
    blurb:
      "Source code for a YouTube coding series — building AI agents, one walkthrough at a time.",
    tags: ["TypeScript", "AI agents"],
  },
  {
    title: "Mac Studio AI Rig",
    years: "2024 – 26",
    blurb:
      "A self-hosted AI workstation: Ollama + agent stack on a Mac Studio, bootstrapped, scheduled and backed up by idempotent scripts.",
    tags: ["Bash", "launchd", "Ollama", "MLX"],
  },
];

const FRAME_COUNT = 145; // /assets/hero-frames/f001..f145.jpg — pre-extracted
                         // from hero.mp4 (ffmpeg -i hero.mp4 -q:v 4 f%03d.jpg)

function Hero() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasLive, setCanvasLive] = useState(false);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const y = useTransform(scrollYProgress, [0.5, 1], [0, reduce ? 0 : -110]);
  const opacity = useTransform(scrollYProgress, [0.5, 0.92], [1, 0]);
  const frameOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
  const exitOpacity = useTransform(scrollYProgress, [0.72, 1], [0, 1]);

  // Scroll-pinned reel — no video playback at all. The source mp4 is a
  // single-keyframe H.264 that cannot be seeked, so the film was flattened
  // to a JPEG sequence at build time. On mount the frames decode into
  // ImageBitmaps; the title screen stays static until the user scrolls,
  // then the canvas scrubs the film.
  useEffect(() => {
    if (reduce) return;
    let alive = true;
    let raf = 0;
    const slots: (ImageBitmap | undefined)[] = new Array(FRAME_COUNT);

    const startScrub = () => {
      const first = slots[0];
      if (!first) return;
      setCanvasLive(true);
      const c = canvasRef.current;
      if (!c) return;
      c.width = first.width;
      c.height = first.height;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      // Smoothed scrub: lerp toward the raw scroll position every frame,
      // and blend between the two neighbouring frames so the reel moves in
      // sub-frame steps instead of 24fps jumps.
      let smoothed = scrollYProgress.get();
      let lastKey = "";
      const loop = () => {
        const target = scrollYProgress.get();
        smoothed += (target - smoothed) * 0.16;
        if (Math.abs(target - smoothed) < 0.0004) smoothed = target;
        const f = smoothed * (slots.length - 1);
        const i = Math.max(0, Math.min(slots.length - 1, Math.floor(f)));
        const frac = f - i;
        const key = i + ":" + (frac < 0.04 ? 0 : Math.round(frac * 25));
        const b0 = slots[i];
        if (b0 && key !== lastKey) {
          lastKey = key;
          ctx.drawImage(b0, 0, 0);
          const b1 = slots[i + 1];
          if (frac > 0.04 && b1) {
            ctx.globalAlpha = frac;
            ctx.drawImage(b1, 0, 0);
            ctx.globalAlpha = 1;
          }
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    let loaded = 0;
    Array.from({ length: FRAME_COUNT }, (_, i) =>
      fetch(`/assets/hero-frames/f${String(i + 1).padStart(3, "0")}.jpg`)
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error("http"))))
        .then((b) => createImageBitmap(b))
        .then((b) => {
          slots[i] = b;
          loaded += 1;
          if (alive && loaded === Math.ceil(FRAME_COUNT * 0.9)) startScrub();
        })
        .catch(() => {}),
    );

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      slots.forEach((b) => b?.close());
    };
  }, [reduce, scrollYProgress]);

  return (
    <div ref={wrapRef} id="top" className="relative h-[250vh]">
      <section className="sticky top-0 flex h-svh min-h-[640px] flex-col overflow-hidden">
        <div className="hero-sky" aria-hidden />
        {/* Reel — pre-extracted frames, no video playback. Hidden at the
            top of the runway (title screen); fades in on the first scroll
            and scrubs with the pin. Gradient sky is the loading /
            reduced-motion fallback. */}
        {!reduce && (
          <motion.canvas
            ref={canvasRef}
            style={{ scale: canvasScale, opacity: canvasLive ? canvasOpacity : 0 }}
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden
          />
        )}
      <div className="absolute inset-0 bg-black/10" aria-hidden />
      <div className="hero-veil" aria-hidden />
      <GridFloor />
      <div className="hero-vignette" aria-hidden />
      {/* Dissolve: the pinned reel fades to the page background over the
          last stretch of the runway, so the next section arrives on a
          clean surface instead of a hard cut. */}
      <motion.div
        style={{ opacity: exitOpacity }}
        className="pointer-events-none absolute inset-0 bg-[#050507]"
        aria-hidden
      />

      {/* Title-frame nav — fades out as the film starts */}
      <motion.nav
        style={{ opacity: frameOpacity }}
        className="relative z-10 flex items-center justify-between px-6 pt-[calc(9vh+1.25rem)] sm:px-10"
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

      {/* Title */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.15, ease: EASE_OUT }}
          className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/90"
        >
          A portfolio in one reel
        </motion.p>
        <div className="line-mask mt-6">
          <motion.h1
            initial={{ y: reduce ? "0%" : "112%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.2, delay: 0.3, ease: EASE_OUT }}
            className="font-cyber text-[clamp(3rem,11vw,8rem)] leading-none text-ink"
          >
            <GlitchText text="TUAN NGO" />
          </motion.h1>
        </div>
        <div className="line-mask mt-5">
          <motion.p
            initial={{ y: reduce ? "0%" : "112%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, delay: 0.45, ease: EASE_OUT }}
            className="text-lg text-ink/85 [text-shadow:0_1px_18px_rgba(0,0,0,0.5)] sm:text-xl"
          >
            Full-stack developer &amp; local-AI craftsman
          </motion.p>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.95 }}
          className="mt-10 font-mono text-[10px] uppercase tracking-[0.35em] text-ink-muted/70"
        >
          2.39:1 · Teal &amp; Orange · Reel 01 · 2026
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: frameOpacity }}
        className="relative z-10 flex flex-col items-center gap-3 pb-[calc(9vh+1.25rem)]"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-ink-muted/80">
          Scroll to begin
        </span>
        <span className="scroll-cue" aria-hidden />
      </motion.div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-full">
      <FilmGrain />
      <Scanlines />
      <Letterbox />
      <Progress />
      <MiniNav />
      <Timecode />

      <main className="flex-1">
        <Hero />

        <Scene id="about" number="01" eyebrow="About" title="Who I Am">
          <Reveal>
            <p className="font-display text-3xl leading-snug text-ink sm:text-4xl">
              Every build is a production.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl leading-relaxed text-ink-muted">
              I&apos;m a full-stack developer who writes the whole film —
              transactional Go backends, Angular and React frontends, and AI
              that stays on your own hardware. Local-first isn&apos;t a slogan
              here; it&apos;s the architecture.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-muted">
              The through-line is the same in every project: privacy by design,
              clean architecture, and software that behaves on the first try.
              If it can run on a Mac in a kitchen, it probably does.
            </p>
          </Reveal>
        </Scene>

        <Scene
          id="skills"
          number="02"
          eyebrow="Capabilities"
          title="The Toolkit"
          wide
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {SKILLS.map((group, i) => (
              <Reveal key={group.title} delay={(i % 2) * 0.08} className="h-full">
                <article className="h-full border border-hairline bg-white/[0.02] p-7 transition-colors duration-150 hovers:border-accent/40">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
                    {group.label}
                  </p>
                  <h3 className="mt-3 font-display text-2xl text-ink">
                    {group.title}
                  </h3>
                  <ul className="mt-5 flex flex-col">
                    {group.items.map((item, j) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-3 border-b border-hairline/60 py-2.5 last:border-0"
                      >
                        <span className="font-mono text-[10px] text-ink-muted/50">
                          {pad2(j + 1)}
                        </span>
                        <span className="text-sm text-ink-muted">{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </Scene>

        <Scene
          id="work"
          number="03"
          eyebrow="Selected Work"
          title="Selected Work"
          wide
          titleClassName="font-cyber text-4xl font-semibold uppercase leading-tight tracking-[-0.025em] text-ink sm:text-5xl"
        >
          <div>
            {/* One small hazard tick per section — separator, not background */}
            <div className="cp-hazard h-1 w-12" aria-hidden />

            {/* Feature row — the flagship project, Night Signal plate */}
            <Reveal className="mt-10">
              <article className="chamfer-tr relative border border-hairline border-l-2 border-l-chrome bg-surface p-5 sm:p-7 lg:grid lg:grid-cols-[1fr_1.15fr] lg:gap-10">
                {/* Placeholder plate — explicitly labeled, per the design
                    contract (real screenshots arrive with the project data) */}
                <div className="chamfer-tr relative aspect-video overflow-hidden border border-hairline bg-neutral">
                  <div className="cp-hud-grid absolute inset-0" aria-hidden />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="border border-line/40 px-3 py-2 font-mono text-xs uppercase tracking-[0.15em] text-muted">
                      Screenshot — placeholder
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="bg-chrome px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-[0.1em] text-neutral">
                      Featured
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {FILMOGRAPHY[0].years}
                    </span>
                  </div>
                  <h3 className="mt-4 font-cyber text-3xl font-semibold tracking-[-0.025em] text-ink sm:text-4xl">
                    {FILMOGRAPHY[0].title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                    {FILMOGRAPHY[0].blurb}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {FILMOGRAPHY[0].tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-line/30 px-2 py-1 font-mono text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>

            {/* Structured rows for the remaining work */}
            <div className="mt-12">
              {FILMOGRAPHY.slice(1).map((film, i) => (
                <Reveal key={film.title} delay={(i % 3) * 0.04}>
                  <article className="group grid grid-cols-[3.5rem_1fr] gap-4 border-b border-hairline py-6 pl-4 pr-2 transition-colors duration-150 hover:bg-raised hover:shadow-[inset_2px_0_0_var(--color-accent)] sm:grid-cols-[6rem_1fr] sm:gap-8 sm:pl-6 sm:pr-3 sm:py-7">
                    <div className="flex flex-col items-start gap-2 pt-1">
                      <span className="font-mono text-xs font-medium text-chrome/80">
                        {pad2(i + 2)}
                      </span>
                      <span className="font-mono text-xs text-muted/70">
                        {film.years}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-cyber text-xl font-semibold tracking-[-0.02em] text-ink transition-colors duration-150 group-hover:text-chrome sm:text-2xl">
                        {film.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                        {film.blurb}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {film.tags.map((tag) => (
                          <span
                            key={tag}
                            className="border border-line/30 px-2 py-1 font-mono text-xs text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </Scene>

        <Scene
          id="hobbies"
          number="04"
          eyebrow="Off Duty"
          title="Hobbies"
          wide
        >
          <div className="flex flex-col gap-20">
            <HobbyPanel
              index="01"
              tag="Archery"
              title="Bow & Parkour"
              accent="chrome"
              copy="Running the vertical lines of the city, stopping in the air, drawing the bow. 3D parkour and archery — placeholder copy, details coming."
            >
              <BowAnim />
            </HobbyPanel>
            <HobbyPanel
              index="02"
              tag="Iaido"
              title="One-Handed Sword"
              accent="flare"
              copy="Katana in one hand, one breath before the cut. Iaido — placeholder copy, dojo and rank details coming."
            >
              <IaidoAnim />
            </HobbyPanel>
          </div>
        </Scene>

        <Scene
          id="contact"
          number="05"
          eyebrow="Contact"
          title="Now Showing"
        >
          <Reveal>
            <p className="font-display text-3xl leading-snug text-ink sm:text-4xl">
              The next scene is unwritten.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md leading-relaxed text-ink-muted">
              Have a project that needs a full stack and a steady hand — or a
              cafe that needs a stamp card? Say hello.
            </p>
            <a
              href="mailto:hello@example.com"
              className="mt-8 inline-flex items-center rounded-full border border-accent/40 px-6 py-3 font-mono text-sm text-accent transition-colors duration-150 hovers:border-accent hovers:bg-accent/10"
            >
              hello@example.com
            </a>
          </Reveal>
        </Scene>
      </main>

      <footer className="relative border-t border-hairline">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-8 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted/60 sm:px-10">
          <span>© 2026 Tuan Ngo</span>
          <span>Written, shot &amp; cut in one viewport</span>
          <span className="text-accent/70">Reel 01 · v0.3</span>
        </div>
      </footer>
    </div>
  );
}
