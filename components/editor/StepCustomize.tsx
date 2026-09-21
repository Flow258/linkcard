"use client";

import { Profile } from "@/lib/types";
import Field from "./Field";

const COLOR_FIELDS: { key: keyof Profile["colors"]; label: string }[] = [
  { key: "background", label: "Background" },
  { key: "text", label: "Text" },
  { key: "accent", label: "Accent" },
  { key: "button", label: "Button" },
];

const FONTS: { id: string; label: string; sample: string }[] = [
  { id: "body", label: "Sans (IBM Plex Sans)", sample: "font-body" },
  { id: "display", label: "Serif (Fraunces)", sample: "font-display" },
  { id: "stamp", label: "Mono (IBM Plex Mono)", sample: "font-stamp" },
];

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-black/15">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`focus-ring flex-1 px-3 py-2 text-sm font-medium transition ${
            value === opt.value ? "bg-ink text-paper" : "bg-white text-ink hover:bg-black/5"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function StepCustomize({
  profile,
  onChange,
}: {
  profile: Profile;
  onChange: (patch: Partial<Profile>) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h3 className="font-display text-lg text-ink">Colors</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {COLOR_FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={profile.colors[f.key]}
                  onChange={(e) =>
                    onChange({ colors: { ...profile.colors, [f.key]: e.target.value } })
                  }
                  className="h-9 w-9 shrink-0 cursor-pointer rounded border border-black/15 bg-transparent p-0"
                />
                <span className="font-stamp text-xs text-ink-soft">{profile.colors[f.key]}</span>
              </div>
            </Field>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="font-display text-lg text-ink">Font</h3>
        <Segmented
          options={FONTS.map((f) => ({ value: f.id, label: f.label }))}
          value={profile.fontId}
          onChange={(fontId) => onChange({ fontId })}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-lg text-ink">Photo shape</h3>
          <Segmented
            options={[
              { value: "circle", label: "Circle" },
              { value: "rounded", label: "Rounded" },
              { value: "square", label: "Square" },
            ]}
            value={profile.layout.photoShape}
            onChange={(photoShape) => onChange({ layout: { ...profile.layout, photoShape } })}
          />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-lg text-ink">Alignment</h3>
          <Segmented
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ]}
            value={profile.layout.align}
            onChange={(align) => onChange({ layout: { ...profile.layout, align } })}
          />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-lg text-ink">Button style</h3>
          <Segmented
            options={[
              { value: "filled", label: "Filled" },
              { value: "outline", label: "Outline" },
              { value: "text", label: "Text" },
              { value: "glass", label: "Glass" },
            ]}
            value={profile.layout.buttonStyle}
            onChange={(buttonStyle) => onChange({ layout: { ...profile.layout, buttonStyle } })}
          />
        </div>
      </section>
    </div>
  );
}
