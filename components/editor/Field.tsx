import type { ReactNode } from "react";

export default function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "focus-ring w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60";
