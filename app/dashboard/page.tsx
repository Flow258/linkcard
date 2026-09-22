"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ExternalLink, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Profile } from "@/lib/types";
import { listProfiles, deleteProfile, saveProfile, usingApiBackend } from "@/lib/data";
import { getCardUrl } from "@/lib/utils";

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyUsername, setBusyUsername] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setProfiles(await listProfiles());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(username: string) {
    if (!window.confirm(`Delete the card @${username}? This can't be undone.`)) return;
    setBusyUsername(username);
    try {
      await deleteProfile(username);
      await refresh();
    } finally {
      setBusyUsername(null);
    }
  }

  async function togglePublic(profile: Profile) {
    setBusyUsername(profile.username);
    try {
      await saveProfile({ ...profile, isPublic: !profile.isPublic });
      await refresh();
    } finally {
      setBusyUsername(null);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-black/10 bg-paper/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="font-display text-lg text-ink">
            LinkCard
          </Link>
          <Link
            href="/create"
            className="focus-ring flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink/85"
          >
            <Plus className="h-4 w-4" /> New card
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-display text-2xl text-ink">Your cards</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {usingApiBackend
            ? "Synced to your LinkCard API — viewable from any device."
            : "Saved on this device only."}{" "}
          {profiles.length} of unlimited on the free plan.
        </p>

        {loading ? (
          <div className="mt-10 flex items-center justify-center py-20 text-sm text-ink-soft">
            Loading your cards…
          </div>
        ) : profiles.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-card border border-dashed border-black/15 py-20 text-center">
            <p className="text-ink-soft">You haven&apos;t created a card yet.</p>
            <Link
              href="/create"
              className="focus-ring rounded-full bg-seal px-6 py-2.5 text-sm font-semibold text-white hover:bg-seal-dim"
            >
              Create your card
            </Link>
          </div>
        ) : (
          <ul className="mt-8 flex flex-col gap-3">
            {profiles.map((p) => (
              <li
                key={p.username}
                className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold"
                    style={{ backgroundColor: p.colors.accent, color: p.colors.background }}
                  >
                    {p.photoDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.photoDataUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      p.displayName?.[0]?.toUpperCase() ?? "?"
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-ink">{p.displayName || "Untitled card"}</p>
                    <p className="font-stamp text-xs text-ink-soft">
                      {getCardUrl(p.username).replace(/^https?:\/\//, "")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => togglePublic(p)}
                    disabled={busyUsername === p.username}
                    className="focus-ring flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium text-ink hover:bg-black/5 disabled:opacity-50"
                    title={p.isPublic ? "Unpublish" : "Publish"}
                  >
                    {p.isPublic ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {p.isPublic ? "Public" : "Unpublished"}
                  </button>
                  <Link
                    href={`/create?edit=${p.username}`}
                    className="focus-ring flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium text-ink hover:bg-black/5"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                  <Link
                    href={`/${p.username}`}
                    target="_blank"
                    className="focus-ring flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium text-ink hover:bg-black/5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View
                  </Link>
                  <button
                    onClick={() => handleDelete(p.username)}
                    disabled={busyUsername === p.username}
                    className="focus-ring flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium text-seal hover:bg-seal/5 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}