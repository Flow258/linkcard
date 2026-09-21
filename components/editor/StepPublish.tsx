"use client";

import { CheckCircle2 } from "lucide-react";
import { Profile } from "@/lib/types";
import ProfileCard from "@/components/card/ProfileCard";
import { getCardUrl } from "@/lib/utils";

export default function StepPublish({
  profile,
  published,
  canPublish,
  onPublish,
}: {
  profile: Profile;
  published: boolean;
  canPublish: boolean;
  onPublish: () => void;
}) {
  const cardUrl = getCardUrl(profile.username || "you");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="font-display text-lg text-ink">
          {published ? "Your card is live" : "Review your card"}
        </h3>
        <p className="max-w-sm text-sm text-ink-soft">
          {published
            ? "Share your link or QR code, or keep editing anytime from your dashboard."
            : "This is exactly how visitors will see it. Publish when you're happy."}
        </p>
      </div>

      <ProfileCard profile={profile} showQr={published} showActions={published} />

      {published ? (
        <div className="flex flex-col items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm font-medium text-pine">
            <CheckCircle2 className="h-4 w-4" /> Published to {cardUrl}
          </span>
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noreferrer"
            className="focus-ring text-sm font-medium text-seal underline underline-offset-4"
          >
            Open your public card ↗
          </a>
        </div>
      ) : (
        <button
          type="button"
          disabled={!canPublish}
          onClick={onPublish}
          className="focus-ring rounded-full bg-seal px-8 py-3 text-sm font-semibold text-white transition hover:bg-seal-dim disabled:cursor-not-allowed disabled:opacity-40"
        >
          Publish card
        </button>
      )}
    </div>
  );
}
