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

const HERO_FPS = 24; // source frame rate of /assets/hero.mp4
const HERO_TAIL_SECONDS = 2; // ping-pong tail length (fallback mode)

function Hero() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
  const exitOpacity = useTransform(scrollYProgress, [0.72, 1], [0, 1]);

  // Scroll-pinned reel. The video plays once as the intro; during that play
  // we capture every frame (drawImage — zero seeks; the source has a single
  // keyframe, so random seeks are unreliable). When the play ends, the
  // canvas takes over and the scroll position scrubs the captured frames:
  // scrolling the runway plays the film. If the capture comes up short, fall
  // back to a real-time ping-pong of the tail frames.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduce) return;
    let raf = 0;
    let rafDraw = 0;
    let lastCapture = -1;
    let mode: "capture" | "scrub" | "pong" = "capture";
    let retries = 0;
    let slots: (ImageBitmap | undefined)[] = [];
    const scratch = document.createElement("canvas");
    const sctx = scratch.getContext("2d");

    const startScrub = () => {
      mode = "scrub";
      v.pause();
      setCanvasLive(true);
      const c = canvasRef.current;
      if (!c) return;
      c.width = v.videoWidth;
      c.height = v.videoHeight;
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
        rafDraw = requestAnimationFrame(loop);
      };
      rafDraw = requestAnimationFrame(loop);
    };

    const startPong = () => {
      mode = "pong";
      v.pause();
      setCanvasLive(true);
      const c = canvasRef.current;
      if (!c) return;
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const tail = slots
        .slice(-Math.round(HERO_TAIL_SECONDS * HERO_FPS))
        .filter(Boolean) as ImageBitmap[];
      if (!tail.length) return;
      let i = tail.length - 1;
      let dir = -1;
      let last = performance.now();
      const frameMs = 1000 / HERO_FPS;
      const step = (now: number) => {
        ctx.drawImage(tail[i], 0, 0);
        if (now - last >= frameMs) {
          last += frameMs;
          i += dir;
          if (i >= tail.length) {
            i = tail.length - 1;
            dir = -1;
          } else if (i < 0) {
            i = 0;
            dir = 1;
          }
        }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const tick = () => {
      if (mode !== "capture") return;
      if (v.duration && !slots.length) {
        slots = new Array(Math.max(1, Math.round(v.duration * HERO_FPS)));
      }
      if (sctx && v.playbackRate > 0 && v.currentTime > 0) {
        // Capture window: the one-shot play crosses each frame once — grab
        // every frame as it happens (the only reliable decode path here).
        const idx = Math.min(
          slots.length - 1,
          Math.floor(v.currentTime * HERO_FPS),
        );
        while (lastCapture < idx) {
          lastCapture += 1;
          const n = lastCapture;
          scratch.width = v.videoWidth;
          scratch.height = v.videoHeight;
          sctx.drawImage(v, 0, 0);
          createImageBitmap(scratch)
            .then((b) => (slots[n] = b))
            .catch(() => {});
        }
      }
      if (v.ended) {
        const got = slots.filter(Boolean).length;
        if (got >= slots.length * 0.85) {
          startScrub();
        } else if (got >= slots.length * 0.5 || retries >= 2) {
          startPong();
        } else {
          retries += 1;
          v.currentTime = 0;
          void v.play().catch(() => {});
        }
      }
      if (mode === "capture") raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rafDraw);
      slots.forEach((b) => b?.close());
    };
  }, [reduce, scrollYProgress]);

  return (
    <div ref={wrapRef} id="top" className="relative h-[250vh]">
      <section className="sticky top-0 flex h-svh min-h-[640px] flex-col overflow-hidden">
        <div className="hero-sky" aria-hidden />
        {/* Reel — the video plays once as the intro, then the canvas
            (scroll-scrubbed frames) keeps the pinned viewport alive.
            Gradient sky stays as the loading / reduced-motion fallback. */}
        {!reduce && (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
              src="/assets/hero.mp4"
              autoPlay
              muted
              playsInline
              preload="metadata"
              aria-hidden
            />
            <motion.canvas
              ref={canvasRef}
              style={{ scale: canvasScale }}
              className={`absolute inset-0 h-full w-full object-cover ${
                canvasLive ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden
            />
          </>
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
          title="Filmography"
          wide
        >
          <div>
            {FILMOGRAPHY.map((film, i) => (
              <Reveal key={film.title} delay={(i % 3) * 0.06} className="group">
                <article className="grid grid-cols-[4rem_1fr] gap-4 border-b border-hairline py-7 sm:grid-cols-[7rem_1fr] sm:gap-8">
                  <span className="pt-2 font-mono text-xs text-ink-muted/60">
                    {film.years}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-ink transition-colors duration-150 group-hovers:text-accent sm:text-3xl">
                      {film.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
                      {film.blurb}
                    </p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted/50">
                      {film.tags.join("  ·  ")}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Scene>

        <Scene
          id="contact"
          number="04"
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
