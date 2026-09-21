"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EMPTY_PROFILE, Profile } from "@/lib/types";
import { getProfile, saveProfile, isUsernameTaken } from "@/lib/data";
import { usernameFormatError } from "@/lib/username";
import Stepper from "@/components/editor/Stepper";
import StepDetails from "@/components/editor/StepDetails";
import StepExtras from "@/components/editor/StepExtras";
import StepTemplate from "@/components/editor/StepTemplate";
import StepCustomize from "@/components/editor/StepCustomize";
import StepUsername from "@/components/editor/StepUsername";
import StepPublish from "@/components/editor/StepPublish";
import ProfileCard from "@/components/card/ProfileCard";

const DRAFT_KEY = "linkcard.draft.v1";
const TOTAL_STEPS = 6;
const USERNAME_STEP = 5;
const PUBLISH_STEP = 6;

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [originalUsername, setOriginalUsername] = useState<string | undefined>(undefined);
  const [published, setPublished] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Load either an existing card to edit (?edit=username) or the saved draft.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const editUsername = params.get("edit");
      if (editUsername) {
        const existing = await getProfile(editUsername);
        if (existing && !cancelled) {
          setProfile(existing);
          setOriginalUsername(existing.username);
          setPublished(existing.isPublic);
          setLoaded(true);
          return;
        }
      }
      const draft = window.localStorage.getItem(DRAFT_KEY);
      if (draft && !cancelled) {
        try {
          setProfile(JSON.parse(draft));
        } catch {
          /* ignore corrupt draft */
        }
      }
      if (!cancelled) setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Autosave draft (only for new, unpublished cards).
  useEffect(() => {
    if (loaded && !originalUsername && !published) {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(profile));
    }
  }, [profile, originalUsername, published, loaded]);

  function patchProfile(patch: Partial<Profile>) {
    setProfile((prev) => ({ ...prev, ...patch }));
  }

  const canGoNext = useMemo(() => {
    if (step === 1) {
      return profile.displayName.trim().length > 0 && profile.jobTitle.trim().length > 0;
    }
    if (step === USERNAME_STEP) return usernameValid;
    return true;
  }, [step, profile, usernameValid]);

  async function handlePublish() {
    setPublishing(true);
    setPublishError(null);
    try {
      const formatError = usernameFormatError(profile.username);
      if (formatError) throw new Error(formatError);
      const taken = await isUsernameTaken(profile.username, originalUsername);
      if (taken) throw new Error("That username was just taken — pick another one.");

      const saved = await saveProfile({ ...profile, isPublic: true }, originalUsername);
      setProfile(saved);
      setOriginalUsername(saved.username);
      setPublished(true);
      window.localStorage.removeItem(DRAFT_KEY);
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setPublishing(false);
    }
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
            {step === 2 && <StepExtras profile={profile} onChange={patchProfile} />}
            {step === 3 && <StepTemplate profile={profile} onChange={patchProfile} />}
            {step === 4 && <StepCustomize profile={profile} onChange={patchProfile} />}
            {step === USERNAME_STEP && (
              <StepUsername
                profile={profile}
                originalUsername={originalUsername}
                onChange={patchProfile}
                onValidityChange={setUsernameValid}
              />
            )}
            {step === PUBLISH_STEP && (
              <>
                <StepPublish
                  profile={profile}
                  published={published}
                  canPublish={usernameValid && !publishing}
                  onPublish={handlePublish}
                />
                {publishing && (
                  <p className="mt-4 text-center text-sm text-ink-soft">Publishing…</p>
                )}
                {publishError && (
                  <p className="mt-4 text-center text-sm text-seal">{publishError}</p>
                )}
              </>
            )}

            {step < PUBLISH_STEP && (
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
            {step === PUBLISH_STEP && !published && (
              <div className="mt-8 border-t border-black/10 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(USERNAME_STEP)}
                  className="focus-ring flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            )}
          </div>

          {step !== PUBLISH_STEP && (
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
