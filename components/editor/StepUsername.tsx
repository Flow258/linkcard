"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Profile } from "@/lib/types";
import { usernameFormatError, suggestUsernames } from "@/lib/username";
import { isUsernameTaken } from "@/lib/data";
import { inputClass } from "./Field";

export default function StepUsername({
  profile,
  originalUsername,
  onChange,
  onValidityChange,
}: {
  profile: Profile;
  originalUsername?: string;
  onChange: (patch: Partial<Profile>) => void;
  onValidityChange?: (valid: boolean) => void;
}) {
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">(
    "idle"
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onValidityChange?.(status === "available");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    const value = profile.username.trim();
    if (!value) {
      setStatus("idle");
      return;
    }
    const formatError = usernameFormatError(value);
    if (formatError) {
      setStatus("invalid");
      setError(formatError);
      return;
    }
    setError(null);
    setStatus("checking");
    let cancelled = false;
    const timeout = setTimeout(() => {
      isUsernameTaken(value, originalUsername).then((taken) => {
        if (cancelled) return;
        if (taken) {
          setStatus("taken");
          setSuggestions(suggestUsernames(value));
        } else {
          setStatus("available");
        }
      });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [profile.username, originalUsername]);

  return (
    <div className="flex max-w-md flex-col gap-3">
      <h3 className="font-display text-lg text-ink">Choose your username</h3>
      <p className="text-sm text-ink-soft">This becomes your public card URL.</p>

      <div className="flex items-center gap-0 overflow-hidden rounded-lg border border-black/15 bg-white focus-within:ring-2 focus-within:ring-seal">
        <span className="pl-3.5 font-stamp text-sm text-ink-soft">linkcard.site/</span>
        <input
          className={`${inputClass} border-0 pl-0 focus:outline-none`}
          value={profile.username}
          onChange={(e) =>
            onChange({ username: e.target.value.toLowerCase().replace(/\s+/g, "-") })
          }
          placeholder="jong"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="min-h-[24px] text-sm">
        {status === "checking" && <span className="text-ink-soft">Checking availability…</span>}
        {status === "available" && (
          <span className="flex items-center gap-1.5 text-pine">
            <Check className="h-4 w-4" /> Available
          </span>
        )}
        {status === "invalid" && (
          <span className="flex items-center gap-1.5 text-seal">
            <X className="h-4 w-4" /> {error}
          </span>
        )}
        {status === "taken" && (
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-seal">
              <X className="h-4 w-4" /> Already taken
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange({ username: s })}
                  className="focus-ring rounded-full border border-black/15 px-3 py-1 text-xs text-ink hover:bg-black/5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
