"use client";

import { useState } from "react";
import { Download, Share2, Check } from "lucide-react";
import { Profile, CardColors } from "@/lib/types";
import { downloadVCard } from "@/lib/vcard";
import { trackEvent } from "@/lib/analytics";

export default function ContactButtons({
  profile,
  cardUrl,
  colors,
}: {
  profile: Profile;
  cardUrl: string;
  colors: CardColors;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: profile.displayName,
          text: `${profile.displayName} — ${profile.jobTitle}`,
          url: cardUrl,
        });
        return;
      } catch {
        // user cancelled — fall through to clipboard copy
      }
    }
    await navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex w-full gap-2.5">
      <button
        onClick={() => {
          trackEvent(profile.username, "contact_download");
          downloadVCard(profile, cardUrl);
        }}
        className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
        style={{ backgroundColor: colors.accent, color: "#fff" }}
      >
        <Download className="h-4 w-4" />
        Save contact
      </button>
      <button
        onClick={handleShare}
        aria-label="Share this card"
        className="focus-ring flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
        style={{ borderColor: colors.text, color: colors.text }}
      >
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
