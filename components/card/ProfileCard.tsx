import { MapPin } from "lucide-react";
import { Profile } from "@/lib/types";
import SocialLinks from "./SocialLinks";
import ContactButtons from "./ContactButtons";
import QRCode from "./QRCode";
import { getCardUrl } from "@/lib/utils";

const FONT_CLASS: Record<string, string> = {
  body: "font-body",
  display: "font-display",
  stamp: "font-stamp",
};

const PHOTO_SHAPE_CLASS: Record<string, string> = {
  circle: "rounded-full",
  rounded: "rounded-2xl",
  square: "rounded-md",
};

const ALIGN_CLASS: Record<string, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProfileCard({
  profile,
  showActions = false,
  showQr = false,
  className = "",
}: {
  profile: Profile;
  showActions?: boolean;
  showQr?: boolean;
  className?: string;
}) {
  const { colors, layout } = profile;
  const cardUrl = getCardUrl(profile.username || "you");
  const fontClass = FONT_CLASS[profile.fontId] ?? "font-body";

  return (
    <div
      className={`w-full max-w-sm overflow-hidden rounded-card shadow-card ${fontClass} ${className}`}
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <div className={`flex flex-col gap-4 px-7 py-9 ${ALIGN_CLASS[layout.align]}`}>
        <div
          className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden text-lg font-semibold ${PHOTO_SHAPE_CLASS[layout.photoShape]}`}
          style={{ backgroundColor: colors.accent, color: colors.background }}
        >
          {profile.photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photoDataUrl}
              alt={profile.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{initials(profile.displayName || "?") || "?"}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold leading-tight">
            {profile.displayName || "Your name"}
          </h2>
          <p className="text-sm opacity-80">
            {[profile.jobTitle, profile.company].filter(Boolean).join(" · ") ||
              "Job title"}
          </p>
          {profile.location && (
            <p className="mt-1 flex items-center gap-1 text-xs opacity-70">
              <MapPin className="h-3 w-3" /> {profile.location}
            </p>
          )}
        </div>

        {profile.bio && <p className="text-sm leading-relaxed opacity-90">{profile.bio}</p>}

        <div className="mt-1 w-full">
          <SocialLinks links={profile.links} colors={colors} buttonStyle={layout.buttonStyle} />
        </div>

        {showQr && (
          <div className="mt-2 flex flex-col items-center gap-2 self-center">
            <div className="rounded-xl bg-white p-3">
              <QRCode url={cardUrl} size={120} fgColor={colors.text} />
            </div>
            <p className="text-xs opacity-60">{cardUrl.replace(/^https?:\/\//, "")}</p>
          </div>
        )}

        {showActions && (
          <div className="mt-2 w-full">
            <ContactButtons profile={profile} cardUrl={cardUrl} colors={colors} />
          </div>
        )}

        <p className="mt-3 text-[11px] uppercase tracking-wide opacity-40">
          Powered by LinkCard
        </p>
      </div>
    </div>
  );
}
