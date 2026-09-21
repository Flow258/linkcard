import type { ComponentType } from "react";
import {
  Github,
  Linkedin,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Send,
  Link2,
} from "lucide-react";
import { LinkType } from "./types";

export interface LinkMeta {
  label: string;
  icon: ComponentType<{ className?: string }>;
}

// A simple inline "X" glyph icon, since lucide's Twitter icon is deprecated.
export function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21.5l-7.51 8.59L22.9 22h-6.98l-5.46-7.14L4.2 22H.94l8.03-9.19L1.1 2h7.16l4.94 6.53L18.24 2Zm-1.22 18h1.94L7.06 4h-2l12 16Z" />
    </svg>
  );
}

export const LINK_META: Record<LinkType, LinkMeta> = {
  github: { label: "GitHub", icon: Github },
  linkedin: { label: "LinkedIn", icon: Linkedin },
  portfolio: { label: "Portfolio", icon: Globe },
  website: { label: "Website", icon: Globe },
  instagram: { label: "Instagram", icon: Instagram },
  facebook: { label: "Facebook", icon: Facebook },
  x: { label: "X", icon: XIcon },
  youtube: { label: "YouTube", icon: Youtube },
  tiktok: { label: "TikTok", icon: Globe },
  whatsapp: { label: "WhatsApp", icon: MessageCircle },
  telegram: { label: "Telegram", icon: Send },
  discord: { label: "Discord", icon: MessageCircle },
  custom: { label: "Link", icon: Link2 },
};
