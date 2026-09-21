"use client";

import { Check, Lock } from "lucide-react";
import { Profile } from "@/lib/types";
import { TEMPLATES, Template } from "@/lib/templates";

const CATEGORIES: Template["category"][] = ["Professional", "Developer", "Creative", "Business"];

export default function StepTemplate({
  profile,
  onChange,
}: {
  profile: Profile;
  onChange: (patch: Partial<Profile>) => void;
}) {
  function applyTemplate(t: Template) {
    onChange({
      templateId: t.id,
      colors: t.colors,
      fontId: t.fontId,
      layout: t.layout,
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {CATEGORIES.map((category) => (
        <section key={category} className="flex flex-col gap-3">
          <h3 className="font-display text-lg text-ink">{category}</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TEMPLATES.filter((t) => t.category === category).map((t) => {
              const active = profile.templateId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className={`focus-ring group relative flex flex-col gap-2 overflow-hidden rounded-xl border-2 p-3 text-left transition ${
                    active ? "border-seal" : "border-black/10 hover:border-black/25"
                  }`}
                  style={{ backgroundColor: t.colors.background }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="h-8 w-8 rounded-full"
                      style={{ backgroundColor: t.colors.accent }}
                    />
                    {t.isPremium && (
                      <Lock className="h-3.5 w-3.5" style={{ color: t.colors.text }} />
                    )}
                    {active && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-seal text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <div
                    className="h-2 w-3/4 rounded-full opacity-70"
                    style={{ backgroundColor: t.colors.text }}
                  />
                  <div
                    className="h-2 w-1/2 rounded-full opacity-40"
                    style={{ backgroundColor: t.colors.text }}
                  />
                  <p className="mt-1 text-xs font-medium" style={{ color: t.colors.text }}>
                    {t.name}
                    {t.isPremium ? " · Pro" : ""}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
