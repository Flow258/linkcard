import Link from "next/link";
import { QrCode, Palette, Share2, ShieldCheck } from "lucide-react";
import ProfileCard from "@/components/card/ProfileCard";
import { EMPTY_PROFILE, Profile } from "@/lib/types";
import { TEMPLATES } from "@/lib/templates";

const DEMO_PROFILE: Profile = {
  ...EMPTY_PROFILE,
  username: "jong",
  displayName: "jong doe",
  jobTitle: "Software Developer",
  bio: "Building software and web applications.",
  location: "Cebu City, PH",
  links: [
    { id: "1", type: "github", label: "GitHub", url: "#", visible: true },
    { id: "2", type: "linkedin", label: "LinkedIn", url: "#", visible: true },
    { id: "3", type: "portfolio", label: "Portfolio", url: "#", visible: true },
  ],
  colors: { background: "#FFFFFF", text: "#1B211F", accent: "#7A2E3B", button: "#1B211F" },
  fontId: "display",
  layout: { photoShape: "circle", align: "center", buttonStyle: "text" },
};

const STEPS = [
  {
    title: "Design your card",
    body: "Fill in your details, pick a template, and adjust the colors, font, and layout until it feels like you.",
  },
  {
    title: "Claim your link",
    body: "Choose a username. Your card lives at linkcard.site/you — no hosting or code required.",
  },
  {
    title: "Share it anywhere",
    body: "Hand over your link, show your QR code, or let someone save your details straight to their phone.",
  },
];

const FEATURES = [
  {
    icon: Palette,
    title: "Templates for every field",
    body: "Professional, developer, creative, and business styles — each with its own colors, type, and layout.",
  },
  {
    icon: QrCode,
    title: "A QR code on every card",
    body: "Generated automatically, ready to print, screen-share, or drop onto a real business card.",
  },
  {
    icon: Share2,
    title: "One tap to save a contact",
    body: "Visitors download a real .vcf contact card — not just a name they'll forget to write down.",
  },
  {
    icon: ShieldCheck,
    title: "You choose what's public",
    body: "Email and phone stay private by default. Nothing shows on your card unless you turn it on.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-paper">
      <header className="border-b border-black/10 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="font-display text-lg text-ink">LinkCard</span>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="hidden text-sm font-medium text-ink-soft hover:text-ink sm:inline">
              My cards
            </Link>
            <Link
              href="/create"
              className="focus-ring rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper hover:bg-ink/85"
            >
              Create your card
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div className="flex flex-col gap-6">
          <h1 className="font-display text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-[3.4rem]">
            Your professional identity, in one link.
          </h1>
          <p className="max-w-md text-lg text-ink-soft">
            Create a digital business card in minutes, then share it with one link or QR code —
            no website-building required.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/create"
              className="focus-ring rounded-full bg-seal px-7 py-3.5 text-sm font-semibold text-white hover:bg-seal-dim"
            >
              Create your card
            </Link>
            <Link
              href="#templates"
              className="focus-ring text-sm font-semibold text-ink underline underline-offset-4 decoration-black/25 hover:decoration-black"
            >
              Browse templates
            </Link>
          </div>
          <p className="font-stamp text-xs text-ink-soft">linkcard.site/you · free, no credit card</p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <ProfileCard profile={DEMO_PROFILE} className="hero-card-anim -rotate-3" />
        </div>
      </section>

      <section className="border-y border-black/10 bg-white/50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl text-ink">How it works</h2>
          <ol className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-2">
                <span className="font-stamp text-sm text-seal">0{i + 1}</span>
                <h3 className="font-display text-lg text-ink">{s.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="templates" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl text-ink">A template for every field</h2>
        <p className="mt-2 max-w-lg text-sm text-ink-soft">
          Nine starting points across four categories. Every one is fully customizable — colors,
          fonts, alignment, and button style are yours to change.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {TEMPLATES.map((t) => (
            <div
              key={t.id}
              className="flex flex-col gap-2 rounded-xl border border-black/10 p-3"
              style={{ backgroundColor: t.colors.background }}
            >
              <div className="h-7 w-7 rounded-full" style={{ backgroundColor: t.colors.accent }} />
              <div className="h-1.5 w-3/4 rounded-full opacity-70" style={{ backgroundColor: t.colors.text }} />
              <div className="h-1.5 w-1/2 rounded-full opacity-40" style={{ backgroundColor: t.colors.text }} />
              <p className="mt-1 text-xs font-medium" style={{ color: t.colors.text }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-black/10 bg-white/50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl text-ink">Built for how you actually network</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col gap-3">
                <f.icon className="h-5 w-5 text-seal" />
                <h3 className="font-display text-base text-ink">{f.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
          <h2 className="font-display text-3xl text-ink">Make your card in the next five minutes.</h2>
          <Link
            href="/create"
            className="focus-ring rounded-full bg-seal px-8 py-3.5 text-sm font-semibold text-white hover:bg-seal-dim"
          >
            Create your card
          </Link>
        </div>
      </section>

      <footer className="border-t border-black/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-ink-soft sm:flex-row">
          <span>© {new Date().getFullYear()} LinkCard</span>
          <div className="flex gap-5">
            <Link href="/dashboard" className="hover:text-ink">
              My cards
            </Link>
            <Link href="/create" className="hover:text-ink">
              Create a card
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
