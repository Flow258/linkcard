"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Eye, MousePointerClick, Download } from "lucide-react";
import { analyticsEnabled, getAnalyticsSummary, AnalyticsSummary } from "@/lib/analytics";
import { getOwnerToken } from "@/lib/ownerTokens";

const STAT_ITEMS: { key: keyof AnalyticsSummary; label: string; icon: typeof Eye }[] = [
  { key: "pageViews", label: "Card views", icon: Eye },
  { key: "linkClicks", label: "Link clicks", icon: MousePointerClick },
  { key: "contactDownloads", label: "Contact downloads", icon: Download },
];

export default function CardAnalyticsPage({ params }: { params: { username: string } }) {
  const [summary, setSummary] = useState<AnalyticsSummary | null | undefined>(undefined);

  useEffect(() => {
    if (!analyticsEnabled) {
      setSummary(null);
      return;
    }
    const token = getOwnerToken(params.username);
    if (!token) {
      setSummary(null);
      return;
    }
    let cancelled = false;
    getAnalyticsSummary(params.username, token).then((result) => {
      if (!cancelled) setSummary(result);
    });
    return () => {
      cancelled = true;
    };
  }, [params.username]);

  return (
    <div className="min-h-screen bg-paper px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="text-sm font-medium text-ink-soft hover:text-ink">
          ← Back to your cards
        </Link>
        <h1 className="mt-4 flex items-center gap-2 font-display text-2xl text-ink">
          <BarChart3 className="h-6 w-6" /> Analytics for @{params.username}
        </h1>

        {!analyticsEnabled ? (
          <p className="mt-6 max-w-md text-sm text-ink-soft">
            Analytics need the backend API (
            <code className="font-stamp">NEXT_PUBLIC_LINKCARD_API_URL</code>) to be configured —
            there's nowhere to record events on the localStorage-only setup. See the README for
            how to deploy the Worker in <code className="font-stamp">/worker</code>.
          </p>
        ) : summary === undefined ? (
          <p className="mt-6 text-sm text-ink-soft">Loading…</p>
        ) : summary === null ? (
          <p className="mt-6 max-w-md text-sm text-ink-soft">
            No data yet for this card — either it hasn&apos;t been viewed, or this browser doesn&apos;t
            hold the owner token for it.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STAT_ITEMS.map((item) => (
              <div key={item.key} className="rounded-xl border border-black/10 bg-white/60 p-5">
                <item.icon className="h-5 w-5 text-seal" />
                <p className="mt-3 text-2xl font-semibold text-ink">{summary[item.key]}</p>
                <p className="text-xs text-ink-soft">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
