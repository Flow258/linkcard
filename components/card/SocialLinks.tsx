import type { CSSProperties } from "react";
import { CardColors, ButtonStyle, ProfileLink } from "@/lib/types";
import { LINK_META } from "@/lib/linkMeta";

function buttonClasses(style: ButtonStyle) {
  switch (style) {
    case "filled":
      return "";
    case "outline":
      return "bg-transparent border-2";
    case "glass":
      return "backdrop-blur-sm bg-white/15 border border-white/30";
    case "text":
    default:
      return "bg-transparent px-0 justify-start";
  }
}

export default function SocialLinks({
  links,
  colors,
  buttonStyle,
}: {
  links: ProfileLink[];
  colors: CardColors;
  buttonStyle: ButtonStyle;
}) {
  const visible = links.filter((l) => l.visible && l.url);
  if (visible.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-2.5">
      {visible.map((link) => {
        const meta = LINK_META[link.type];
        const Icon = meta.icon;
        const style: CSSProperties =
          buttonStyle === "filled"
            ? { backgroundColor: colors.button, color: colors.background }
            : buttonStyle === "outline"
            ? { borderColor: colors.button, color: colors.text }
            : { color: colors.text };

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
            className={`focus-ring flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-transform hover:scale-[1.02] ${buttonClasses(
              buttonStyle
            )}`}
            style={style}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{link.label || meta.label}</span>
          </a>
        );
      })}
    </div>
  );
}
