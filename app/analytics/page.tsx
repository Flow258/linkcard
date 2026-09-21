import Link from "next/link";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
      <BarChart3 className="h-8 w-8 text-ink-soft" />
      <h1 className="font-display text-2xl text-ink">Analytics is coming in Phase 5</h1>
      <p className="max-w-md text-sm text-ink-soft">
        Card views, link clicks, QR scans, and contact downloads will show up here once LinkCard
        has a backend to track them — see the roadmap in the project README.
      </p>
      <Link
        href="/dashboard"
        className="focus-ring rounded-full border border-black/15 px-5 py-2 text-sm font-medium text-ink hover:bg-black/5"
      >
        Back to your cards
      </Link>
    </div>
  );
}
