"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Profile, LinkType } from "@/lib/types";
import { newId } from "@/lib/utils";
import Field, { inputClass } from "./Field";
import LinksManager from "./LinksManager";

const QUICK_LINK_TYPES: { type: LinkType; label: string; placeholder: string }[] = [
  { type: "github", label: "GitHub", placeholder: "https://github.com/you" },
  { type: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/you" },
  { type: "portfolio", label: "Portfolio", placeholder: "https://yoursite.com" },
];

export default function StepDetails({
  profile,
  onChange,
}: {
  profile: Profile;
  onChange: (patch: Partial<Profile>) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ photoDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  }

  function quickLinkValue(type: LinkType) {
    return profile.links.find((l) => l.type === type)?.url ?? "";
  }

  function setQuickLink(type: LinkType, label: string, url: string) {
    const existing = profile.links.find((l) => l.type === type);
    let links;
    if (existing) {
      links = profile.links.map((l) => (l.type === type ? { ...l, url, visible: true } : l));
    } else {
      links = [...profile.links, { id: newId(), type, label, url, visible: true }];
    }
    onChange({ links });
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h3 className="font-display text-lg text-ink">Profile photo</h3>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-paper-dim">
            {profile.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photoDataUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-ink-soft">No photo</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="focus-ring flex items-center gap-2 rounded-lg border border-black/15 bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-black/5"
          >
            <Upload className="h-4 w-4" /> Upload photo
          </button>
          {profile.photoDataUrl && (
            <button
              type="button"
              onClick={() => onChange({ photoDataUrl: undefined })}
              className="focus-ring flex items-center gap-1 text-sm text-ink-soft hover:text-seal"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handlePhoto}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input
            className={inputClass}
            value={profile.displayName}
            onChange={(e) => onChange({ displayName: e.target.value })}
            placeholder="Dave Alquizalas"
          />
        </Field>
        <Field label="Job title">
          <input
            className={inputClass}
            value={profile.jobTitle}
            onChange={(e) => onChange({ jobTitle: e.target.value })}
            placeholder="Software Developer"
          />
        </Field>
        <Field label="Company" hint="Optional">
          <input
            className={inputClass}
            value={profile.company}
            onChange={(e) => onChange({ company: e.target.value })}
            placeholder="Freelance"
          />
        </Field>
        <Field label="Location" hint="Optional">
          <input
            className={inputClass}
            value={profile.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="Cebu City, PH"
          />
        </Field>
      </section>

      <Field label="Short bio" hint="A sentence or two about what you do.">
        <textarea
          className={`${inputClass} min-h-[88px] resize-y`}
          value={profile.bio}
          maxLength={220}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Building software and web applications."
        />
      </Field>

      <section className="flex flex-col gap-4">
        <h3 className="font-display text-lg text-ink">Contact</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email">
            <input
              className={inputClass}
              type="email"
              value={profile.email?.value ?? ""}
              onChange={(e) =>
                onChange({ email: { value: e.target.value, public: profile.email?.public ?? false } })
              }
              placeholder="you@example.com"
            />
            <label className="mt-1 flex items-center gap-2 text-xs text-ink-soft">
              <input
                type="checkbox"
                checked={profile.email?.public ?? false}
                onChange={(e) =>
                  onChange({ email: { value: profile.email?.value ?? "", public: e.target.checked } })
                }
              />
              Show on card
            </label>
          </Field>
          <Field label="Phone">
            <input
              className={inputClass}
              type="tel"
              value={profile.phone?.value ?? ""}
              onChange={(e) =>
                onChange({ phone: { value: e.target.value, public: profile.phone?.public ?? false } })
              }
              placeholder="+63 900 000 0000"
            />
            <label className="mt-1 flex items-center gap-2 text-xs text-ink-soft">
              <input
                type="checkbox"
                checked={profile.phone?.public ?? false}
                onChange={(e) =>
                  onChange({ phone: { value: profile.phone?.value ?? "", public: e.target.checked } })
                }
              />
              Show on card
            </label>
          </Field>
        </div>
        <Field label="Website" hint="Optional">
          <input
            className={inputClass}
            value={profile.website}
            onChange={(e) => onChange({ website: e.target.value })}
            placeholder="https://yoursite.com"
          />
        </Field>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="font-display text-lg text-ink">Links</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUICK_LINK_TYPES.map((q) => (
            <Field key={q.type} label={q.label}>
              <input
                className={inputClass}
                value={quickLinkValue(q.type)}
                onChange={(e) => setQuickLink(q.type, q.label, e.target.value)}
                placeholder={q.placeholder}
              />
            </Field>
          ))}
        </div>
        <p className="text-xs text-ink-soft">
          These three show up first. Add Instagram, YouTube, WhatsApp, or your own custom link
          below.
        </p>
        <LinksManager
          links={profile.links.filter((l) => !QUICK_LINK_TYPES.some((q) => q.type === l.type))}
          onChange={(extra) => {
            const quick = profile.links.filter((l) => QUICK_LINK_TYPES.some((q) => q.type === l.type));
            onChange({ links: [...quick, ...extra] });
          }}
        />
      </section>
    </div>
  );
}
