"use client";

import type { ReactNode } from "react";
import { Reveal } from "./reveal";

/** Page section with hairline top border, eyebrow label, and title. */
export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-neutral-800/80">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-50 sm:text-4xl">
            {title}
          </h2>
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
