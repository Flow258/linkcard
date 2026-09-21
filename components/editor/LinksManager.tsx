"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Trash2, Plus } from "lucide-react";
import { LinkType, ProfileLink } from "@/lib/types";
import { LINK_META } from "@/lib/linkMeta";
import { newId } from "@/lib/utils";
import { inputClass } from "./Field";

const ADDABLE_TYPES: LinkType[] = [
  "instagram",
  "facebook",
  "x",
  "youtube",
  "tiktok",
  "whatsapp",
  "telegram",
  "discord",
  "website",
  "custom",
];

export default function LinksManager({
  links,
  onChange,
}: {
  links: ProfileLink[];
  onChange: (links: ProfileLink[]) => void;
}) {
  const [pendingType, setPendingType] = useState<LinkType>("instagram");

  function addLink() {
    const meta = LINK_META[pendingType];
    const link: ProfileLink = {
      id: newId(),
      type: pendingType,
      label: meta.label,
      url:
        pendingType === "whatsapp"
          ? "https://wa.me/"
          : pendingType === "telegram"
          ? "https://t.me/"
          : "",
      visible: true,
    };
    onChange([...links, link]);
  }

  function update(id: string, patch: Partial<ProfileLink>) {
    onChange(links.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function remove(id: string) {
    onChange(links.filter((l) => l.id !== id));
  }

  function move(id: string, direction: -1 | 1) {
    const index = links.findIndex((l) => l.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= links.length) return;
    const next = [...links];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      {links.length === 0 && (
        <p className="text-sm text-ink-soft">No additional links yet.</p>
      )}
      <div className="flex flex-col gap-2">
        {links.map((link, i) => {
          const meta = LINK_META[link.type];
          const Icon = meta.icon;
          return (
            <div
              key={link.id}
              className="flex flex-col gap-2 rounded-lg border border-black/10 bg-white/60 p-3 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-2 sm:w-32 sm:shrink-0">
                <Icon className="h-4 w-4 text-ink-soft" />
                <span className="text-sm font-medium text-ink">{meta.label}</span>
              </div>
              {link.type === "custom" && (
                <input
                  className={`${inputClass} sm:w-36`}
                  value={link.label}
                  onChange={(e) => update(link.id, { label: e.target.value })}
                  placeholder="My Resume"
                />
              )}
              <input
                className={`${inputClass} flex-1`}
                value={link.url}
                onChange={(e) => update(link.id, { url: e.target.value })}
                placeholder="https://..."
              />
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => move(link.id, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="focus-ring rounded p-1.5 text-ink-soft hover:bg-black/5 disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(link.id, 1)}
                  disabled={i === links.length - 1}
                  aria-label="Move down"
                  className="focus-ring rounded p-1.5 text-ink-soft hover:bg-black/5 disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => update(link.id, { visible: !link.visible })}
                  aria-label={link.visible ? "Hide link" : "Show link"}
                  className="focus-ring rounded p-1.5 text-ink-soft hover:bg-black/5"
                >
                  {link.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => remove(link.id)}
                  aria-label="Remove link"
                  className="focus-ring rounded p-1.5 text-ink-soft hover:text-seal"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={pendingType}
          onChange={(e) => setPendingType(e.target.value as LinkType)}
          className={`${inputClass} max-w-[200px]`}
        >
          {ADDABLE_TYPES.map((type) => (
            <option key={type} value={type}>
              {LINK_META[type].label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addLink}
          className="focus-ring flex items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm font-medium text-ink hover:bg-black/5"
        >
          <Plus className="h-4 w-4" /> Add link
        </button>
      </div>
    </div>
  );
}
