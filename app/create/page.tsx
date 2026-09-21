"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EMPTY_PROFILE, Profile } from "@/lib/types";
import { getProfile, saveProfile, isUsernameTaken } from "@/lib/storage";
import { usernameFormatError } from "@/lib/username";
import Stepper from "@/components/editor/Stepper";
import StepDetails from "@/components/editor/StepDetails";
import StepTemplate from "@/components/editor/StepTemplate";
import StepCustomize from "@/components/editor/StepCustomize";
import StepUsername from "@/components/editor/StepUsername";
import StepPublish from "@/components/editor/StepPublish";
import ProfileCard from "@/components/card/ProfileCard";

const DRAFT_KEY = "linkcard.draft.v1";
const TOTAL_STEPS = 5;

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [originalUsername, setOriginalUsername] = useState<string | undefined>(undefined);
  const [published, setPublished] = useState(false);

  // Load either an existing card to edit (?edit=username) or the saved draft.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editUsername = params.get("edit");
    if (editUsername) {
      const existing = getProfile(editUsername);
      if (existing) {
        setProfile(existing);
        setOriginalUsername(existing.username);
        setPublished(existing.isPublic);
        return;
      }
    }
    const draft = window.localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        setProfile(JSON.parse(draft));
      } catch {
        /* ignore corrupt draft */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave draft (only for new, unpublished cards).
  useEffect(() => {
    if (!originalUsername && !published) {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(profile));
    }
  }, [profile, originalUsername, published]);

  function patchProfile(patch: Partial<Profile>) {
    setProfile((prev) => ({ ...prev, ...patch }));
  }

  const usernameValid = useMemo(() => {
    if (usernameFormatError(profile.username)) return false;
    return !isUsernameTaken(profile.username, originalUsername);
  }, [profile.username, originalUsername]);

  const canGoNext = useMemo(() => {
    if (step === 1) return profile.displayName.trim().length > 0 && profile.jobTitle.trim().length > 0;
    if (step === 4) return usernameValid;
    return true;
  }, [step, profile, usernameValid]);

  function handlePublish() {
    const saved = saveProfile({ ...profile, isPublic: true });
    setProfile(saved);
    setOriginalUsername(saved.username);
    setPublished(true);
    window.localStorage.removeItem(DRAFT_KEY);
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-black/10 bg-paper/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="font-display text-lg text-ink">
            LinkCard
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-ink-soft hover:text-ink">
            Save &amp; exit
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <Stepper current={step} />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            {step === 1 && <StepDetails profile={profile} onChange={patchProfile} />}
            {step === 2 && <StepTemplate profile={profile} onChange={patchProfile} />}
            {step === 3 && <StepCustomize profile={profile} onChange={patchProfile} />}
            {step === 4 && (
              <StepUsername
                profile={profile}
                originalUsername={originalUsername}
                onChange={patchProfile}
              />
            )}
            {step === 5 && (
              <StepPublish
                profile={profile}
                published={published}
                canPublish={usernameValid}
                onPublish={handlePublish}
              />
            )}

            {step < 5 && (
              <div className="mt-10 flex items-center justify-between border-t border-black/10 pt-6">
                <button
                  type="button"
                  disabled={step === 1}
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  className="focus-ring flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink disabled:opacity-0"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  disabled={!canGoNext}
                  onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
                  className="focus-ring flex items-center gap-1.5 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-paper transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
            {step === 5 && !published && (
              <div className="mt-8 border-t border-black/10 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="focus-ring flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            )}
          </div>

          {step !== 5 && (
            <aside className="lg:sticky lg:top-10 lg:h-fit">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-soft">
                Live preview
              </p>
              <ProfileCard profile={profile} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
