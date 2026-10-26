---
version: alpha
name: Tuan Ngo — Night Signal
description: Cyberpunk 2077-inspired industrial editorial portfolio; acid yellow, dark hardware surfaces, restrained cyan signals and deliberate motion.
colors:
  primary: "#FCEE0A"
  secondary: "#45E5DE"
  tertiary: "#FF6B9D"
  neutral: "#080B10"
  surface: "#111820"
  raised: "#1A2530"
  ink: "#F3F1E8"
  muted: "#AAB5BF"
  line: "#718797"
  danger: "#FF7777"
  success: "#80E6B0"
typography:
  h1:
    fontFamily: Chakra Petch
    fontSize: 6rem
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  h2:
    fontFamily: Chakra Petch
    fontSize: 3rem
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  h3:
    fontFamily: Chakra Petch
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.25
  body-md:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.65
  body-lg:
    fontFamily: Geist
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Geist Mono
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.1em"
rounded:
  none: 0px
  sm: 2px
  md: 4px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  5xl: 128px
components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: "{spacing.lg}"
    rounded: "{rounded.none}"
  panel-muted:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    typography: "{typography.label}"
    height: 48px
    padding: "{spacing.md}"
    rounded: "{rounded.none}"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.neutral}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    height: 48px
    rounded: "{rounded.none}"
  nav-active:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
  project-hover:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
  hobby-label:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.tertiary}"
  annotation:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.line}"
  error:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger}"
  success:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.success}"
---

## Overview

**Direction: Night Signal.** A personal engineering dossier with the graphic tension of Cyberpunk 2077: oversized acid-yellow typography, hard-edged plates, cropped technical markings and cyan interface signals. Professional work remains the subject; the interface is not a game-menu replica.

Created 2026-10-26 for this existing portfolio. This is a **proposed design contract**, not a claim that the redesign is implemented. Scope: visual design, interaction and implementation guidance. Do not change the application stack or fabricate biography, clients, project dates or outcomes.

### Art direction

- Lead with strong typography and asymmetrical composition, not a neon particle background.
- Approximately 80% dark/neutral space, 15% yellow emphasis and 5% cyan/pink detail. These are visual-balance guidelines, not measured quotas.
- Yellow communicates identity and the primary action; cyan communicates navigation and technical detail; pink appears sparingly in personal-interest sections.
- A single clipped corner, a thin index rail and a solid yellow plate are the signature shapes. Repeating all three on every component makes them meaningless.
- Keep the owner’s name **Tuan Ngo** and engineering positioning visible immediately. The visual tone is assertive, precise and human—not aggressive faux-military copy.
- Inspired by the requested game's aesthetic; use original graphics and licensed assets. Do not copy its logo, proprietary typeface, screenshots or fictional corporate insignia into the brand.

### Existing-site fit

The inspected project uses Next.js App Router, React, Tailwind v4 and Framer Motion. It already contains `Hero`, `Scene`, `Reveal`, `GlitchText`, `GridFloor`, `FilmGrain`, `Scanlines`, `Timecode`, `HobbyPanel`, `BowAnim` and `IaidoAnim`. Navigation anchors are `#about`, `#skills`, `#work`, `#hobbies`, `#contact`.

The current aesthetic mixes Instrument Serif, cinematic letterboxing, cyan grids and yellow hobby panels. Unify that vocabulary: yellow-led editorial identity, disciplined dark surfaces, technical secondary detail. Preserve content and working interactions while replacing inconsistent visual treatments.

## Colors

Tokens above are normative. Do not introduce unrelated neon colors per section.

- **Primary / acid yellow `#FCEE0A`:** hero name, primary CTA, selected section indicator. Use dark text on yellow fills, never white.
- **Secondary / signal cyan `#45E5DE`:** links, diagram paths, focus accents and technical annotations. Avoid cyan-filled paragraphs or whole-page cyan glow.
- **Tertiary / electric pink `#FF6B9D`:** hobby index or one graphic accent, not a second competing primary CTA.
- **Neutral `#080B10`:** page ground; **surface `#111820`** for panels; **raised `#1A2530`** for transient/hover surfaces.
- **Ink `#F3F1E8`:** primary text; **muted `#AAB5BF`** for readable secondary copy. Do not apply additional opacity to essential text.
- **Line `#718797`:** control outlines and small annotations on the page background. Decorative separators may use this at 25% opacity; interactive boundaries remain full strength.
- **Danger / success:** use red/green with an icon and explicit message. Never encode meaning through color alone.

Text/background contrast must be checked on the final composited surface, especially over the hero image. Provide a solid dark scrim behind copy; a contrast pass on flat tokens does not certify text over footage. Target at least 4.5:1 for normal text and 3:1 for large text and essential control boundaries.

### Existing token migration

`--color-chrome` maps to primary yellow. Change `--color-accent` to yellow for primary actions and define `--color-signal` for cyan; audit existing cyan glow rules rather than recoloring everything yellow. Map ink/muted/background to this file. Retire warm/cool film-grade accents where they conflict. Do not globally remap colors before inspecting every usage.

## Typography

Use the font families already present in `src/app/layout.tsx`; no new font dependency is required.

- **Chakra Petch 600:** identity and section headings. Keep the normal underlying glyphs readable; decorative cuts must not erase essential strokes.
- **Geist:** paragraphs, project descriptions and form inputs. Body copy stays sentence case.
- **Geist Mono:** small labels, indexes, years and tags. Uppercase only for short labels. Replace essential 10px text with at least 12px.
- **Instrument Serif:** remove from primary headings in this direction. An optional editorial quote may use it once, but do not mix serif headings throughout the page.

Desktop token sizes are starting values. Use `clamp(3rem, 9vw, 8rem)` for the hero and `clamp(2rem, 4.5vw, 3.5rem)` for section headings. Keep paragraphs to 55–68 characters per line. At 320px width, wrap the name intentionally into two lines rather than shrinking it into a small logo. Keep Vietnamese diacritics intact if the owner supplies a preferred accented display name.

## Layout

### Page structure

1. **Hero — identity first.** Desktop: 7/5 split across a 12-column grid. Left: small `FULL-STACK / LOCAL AI` label, oversized yellow name, concise professional positioning, primary “View work” anchor and secondary “Contact”. Right: original urban/technical image or existing reel inside one cropped frame. A thin technical rail supplies a section index, not invented live telemetry. Keep both CTAs visible without scrolling.
2. **About — readable dossier.** Narrow index column plus broad prose column. Present the existing privacy-first engineering story in two concise paragraphs. Add only verified personal facts.
3. **Skills — capabilities, not power levels.** Retain the four existing groups; use a two-column panel layout on desktop and stacked panels on phones. Add small index labels and clean list separators. No arbitrary percentage bars or invented proficiency scores.
4. **Work — the proof.** Give one verified project a larger feature row, then structured project rows for the remaining work. Each contains title, real summary, stack and a genuine destination when supplied. Do not turn a card into a fake link. Use original project screenshots; a styled placeholder is explicitly labeled as such.
5. **Hobbies — human contrast.** Retain archery/parkour and Iaido panels and their existing animation components. Yellow and pink are restrained panel accents. Do not invent rank, training history or biographical details from the placeholder copy.
6. **Contact — decisive finish.** A broad yellow plate with dark heading and one clear contact action. Replace `hello@example.com` only with a user-provided address. If no real address exists, mark contact as draft rather than shipping a misleading CTA.
7. **Footer — quiet metadata.** Owner, genuine year, short nav and optional real source link. Avoid fake “encrypted”, “online”, availability, latency or security claims.

Suggested heading replacements: “Who I Am” → “Profile”; “The Toolkit” → “Capabilities”; “Filmography” → “Selected Work”; “Now Showing” → “Start a Conversation”. These are proposed editorial labels, not mandatory changes to the user's writing.

### Geometry and responsive behavior

- Content width: 1280px maximum; long-form reading width: 680px.
- Grid: 12 columns with 24px gaps above 1024px; 6 columns with 20px gaps at 768–1023px; 4 columns with 16px gaps below 768px.
- Side gutters: 48px desktop, 32px tablet, 20px phone. Section spacing: 112px desktop, 80px tablet, 64px phone.
- Mobile hero is one column, content first, image second. No mandatory 250vh intro runway, pinned navigation trap or full-height blank loading frame.
- Use normal page scrolling. If the cinematic pinned reel is retained, confine it to desktop as optional enhancement; never gate content access on completing it.
- Sticky header: 64px desktop, 56px mobile. Give anchor targets matching scroll margins. On phones use a labeled Menu button with an accessible menu rather than squeezing five labels into one row.
- Horizontal overflow is prohibited at 320px. Allow long project titles, translated labels and enlarged text to wrap.

## Elevation & Depth

Use opaque layers and hard framing rather than glassmorphism. Surface changes establish depth; shadows are secondary.

- Resting panels: flat surface, 1px decorative separator, no permanent halo.
- Hover/focus: one cyan edge or yellow index marker; hover lift at most 2px.
- Small elevated overlays: `0 12px 32px rgba(0,0,0,0.35)` with a visible border.
- Neon glow is a local decorative accent, e.g. `0 0 18px rgba(69,229,222,0.14)`, never the only way to read text or identify a control.
- Hero scrim and background contrast are more important than bloom or grain.

## Shapes

Use square edges and an 8–12px clipped top-right or bottom-left corner for selected decorative plates. Essential controls keep their full rectangular hit area and an unclipped outer focus ring; put the visual cut on an inner decorative layer.

Buttons have a 48px minimum height. All tap targets have at least 44×44px effective area. Tags use small rectangular outlines, not pills. Reserve circles for actual circular icons; avoid rounded SaaS-card styling.

Hazard stripes appear at most once per major section, as a small separator rather than a background. Use original 1px technical line icons with consistent stroke weight. Decorative marks are hidden from assistive technology and never intercept pointer events.

## Components

### Navigation and actions

Use real links for destinations and buttons for actions. Current section is indicated with a yellow rule and `aria-current` where appropriate. Hover/focus adds an underline or edge, not just a subtle color shift. Primary buttons use yellow/dark; secondary buttons use dark/cyan with a clear outline. Provide default, hover, active, focus-visible and disabled states. Disabled actions explain why they are unavailable when relevant.

Focus ring: 2px cyan with a 3px dark separation gap. Never clip it. Keyboard navigation and anchor jumps respond immediately. Keep one visually primary CTA per viewport.

### Project rows and panels

Feature image on one side, editorial content on the other; alternate only when it helps the narrative, not mechanically. Desktop rows can carry a small number/date column; mobile folds this above the title. Supporting links have explicit labels such as “View source”. Show real results only; no fabricated client logos, counters or “mission completed” badges.

`HobbyPanel` can retain HUD corners and clipped decorative plates, but simplify repeated rings and microtext. `BowAnim` and `IaidoAnim` must include meaningful static fallback artwork; content descriptions are ordinary accessible text.

### Motion specification — restrained, responsive

Apply Emil Kowalski's frequency-and-purpose test: motion should clarify feedback, hierarchy or continuity. No entrance screen, fake boot progress, typing delay or forced audio.

- Press feedback: 120ms, scale 0.98; keyboard actions remain immediate.
- Hover: 140ms color/opacity transition, optional translateY(-2px) on pointer-fine devices only.
- Section reveal: 220ms opacity + translateY(8px), once per element, optional 40ms stagger capped at 120ms total delay. Content is readable when JavaScript is unavailable.
- Menu: 180ms in / 140ms out. No bouncing navigation.
- Use `cubic-bezier(0.23, 1, 0.32, 1)` for entries and feedback; preserve `EASE_OUT` in the existing easing module. Specify animated properties instead of `transition: all`.
- Glitch is optional: one brief, low-amplitude decorative title displacement on initial reveal, no continuous flashing or recurring random timer. Keep the real text stable and accessible; duplicate visual layers are `aria-hidden`.
- Scanlines/grain: static, optional, maximum 3% effective visible opacity, restricted to imagery. Never cover reading text or focused controls.
- Retire the continuously moving perspective grid; use a faint static technical grid or image crop rather than a synthwave floor dominating the page.
- Pause decorative loops when offscreen or the tab is hidden. Avoid animating layout or background-position. Profile any animated masks/filters rather than assuming GPU acceleration.
- Honor `prefers-reduced-motion`: no scrub, parallax, glitch, blinking REC indicators, motion-based reveals or smooth scrolling; use the final static composition. Decorative loops also have a pause/off control if retained.

### Hero media and loading

The current hero code requests 145 JPEGs and decodes image bitmaps before showing its scroll reel. Do not use that as the mobile default. First paint should show a responsive poster and actual title/CTA without waiting for frame decode. For a retained desktop sequence, load progressively with bounded decode concurrency and a memory cap; cancel fetches and close bitmaps on teardown. Never run an endless draw loop when the scroll/frame has not changed.

Use local, appropriately licensed imagery; maintain natural image proportions and explicit dimensions to prevent layout shift. Load only the hero poster eagerly and lazy-load below-fold imagery. Empty/missing-media states show a composed static panel, not a broken image or spinner forever. Preserve useful image alt text; decorative backgrounds remain silent.

### Repository integration map (future implementation)

- `src/app/globals.css`: reconcile token names, primary palette, surfaces, focus styles, shape utilities and reduced-motion rules.
- `src/app/layout.tsx`: retain Geist/Mono/Chakra; remove Instrument Serif only if no remaining use needs it.
- `src/app/page.tsx`: adjust hero composition and project hierarchy; preserve section IDs and truthful content.
- `src/components/chrome.tsx`: simplify letterbox/mini-navigation overlays; keep mobile controls uncluttered.
- `scene.tsx` / `reveal.tsx`: unify section spacing, headings, reveal timing and readable static state.
- `glitch-text.tsx`, `grid-floor.tsx`, `scanlines.tsx`, `film-grain.tsx`, `timecode.tsx`: reduce or remove ornamental runtime work. A retained timecode must be explicitly decorative, not a fake system metric.
- `hobby-panel.tsx`, `bow-anim.tsx`, `iaido-anim.tsx`: preserve original artwork and meaning while applying shared spacing and motion rules.
- `src/lib/site.ts`: keep navigation labels synchronized with visible headings.

The neighboring token exports are reference artifacts, not automatically wired into the site. When implementing, reconcile existing aliases and Next font variables rather than importing conflicting duplicate themes. Keep design docs public-safe: this directory is web-served; no credentials, private notes or machine configuration belong here.

## Do's and Don'ts

**Do:** use yellow with restraint; keep substantial dark breathing room; make work and contact easy to find; repeat consistent angular geometry; expose real project evidence; preserve mobile readability and keyboard access.

**Don't:** flood every section with neon; use fake terminal logs; animate paragraphs; make the cursor custom; hide ordinary navigation behind lore; use constant RGB glitches; add random Japanese glyphs as decoration; pretend third-party game branding belongs to this portfolio.

### Acceptance checklist for the future redesign

- [ ] Name, role, “View work” and contact route are clear in the first viewport.
- [ ] About, Skills, Work, Hobbies and Contact anchors remain functional.
- [ ] All essential text uses documented, measured contrast; over-image text checked separately.
- [ ] Keyboard focus is visible and unclipped; menu has accessible naming, focus handling and Escape behavior.
- [ ] Test at 320, 390, 768, 1024 and 1440px widths and with 200% text zoom; no horizontal overflow or obscured content.
- [ ] Reduced-motion and JavaScript-disabled views show usable content and a static hero.
- [ ] No fake credentials, metrics, biography, dates, availability or contact details are introduced.
- [ ] Do not ship existing placeholder hobby copy or `hello@example.com` as verified information.
- [ ] Hero poster loads independently of animation; image sequence does not monopolize phone memory.
- [ ] All project links work; no decorative panel is styled as clickable without an action.
- [ ] Motion defaults remain quiet; meaningful controls work on touch without hover.
- [ ] Run the project's lint/build and inspect browser behavior when implementation occurs. This documentation-only task does not assert those future checks pass.

### Provenance

Design intent: user's Cyberpunk 2077-inspired request. Project observations: current source, not a rendered-site audit. Craft guidance: installed `emil-design-eng` skill. Token structure: Google DESIGN.md specification (`google-labs-code/design.md`). Palette and composition are authored for this project, not extracted official game brand values. No visual application changes are included with this document.
