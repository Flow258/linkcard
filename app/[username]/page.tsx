"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Profile } from "@/lib/types";
import { getProfile } from "@/lib/data";
import ProfileCard from "@/components/card/ProfileCard";

export default function PublicCardPage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const found = await getProfile(params.username);
        if (!cancelled) setProfile(found && found.isPublic ? found : null);
      } catch {
        if (!cancelled) setProfile(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.username]);

  if (profile === undefined) {
    return <div className="flex min-h-screen items-center justify-center bg-paper" />;
  }

  if (profile === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
        <p className="font-display text-2xl text-ink">This card doesn&apos;t exist here yet</p>
        <p className="max-w-sm text-sm text-ink-soft">
          Either @{params.username} hasn&apos;t published a card, or — if this app is still
          running on the localStorage backend — it was published from a different browser.
        </p>
        <Link
          href="/create"
          className="focus-ring rounded-full bg-seal px-6 py-2.5 text-sm font-semibold text-white hover:bg-seal-dim"
        >
          Create your card
        </Link>
      </div>
    );
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-16"
      style={{ backgroundColor: profile.colors.background }}
    >
      <ProfileCard profile={profile} showQr showActions trackViews />
      <Link href="/" className="text-xs opacity-50 hover:opacity-80" style={{ color: profile.colors.text }}>
        Made with LinkCard
      </Link>
    </main>
  );
}
