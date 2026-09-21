import { Profile } from "./types";

/**
 * MVP persistence layer.
 *
 * Everything here reads/writes localStorage in the visitor's own browser.
 * There is no server, so a published card is only visible on the device
 * that created it — good enough to build and demo the whole product flow.
 *
 * To move to Phase 3 of the roadmap (real public URLs, Cloudflare D1,
 * Workers API), replace the bodies of these functions with `fetch` calls
 * to your API and keep the function signatures the same — nothing in the
 * UI layer talks to localStorage directly.
 */

const STORE_KEY = "linkcard.profiles.v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function readStore(): Record<string, Profile> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Profile>) : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, Profile>) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function listProfiles(): Profile[] {
  return Object.values(readStore()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getProfile(username: string): Profile | undefined {
  return readStore()[username.toLowerCase()];
}

export function isUsernameTaken(username: string, excluding?: string): boolean {
  const store = readStore();
  const key = username.toLowerCase();
  if (excluding && excluding.toLowerCase() === key) return false;
  return Boolean(store[key]);
}

export function saveProfile(profile: Profile): Profile {
  const store = readStore();
  const now = new Date().toISOString();
  const key = profile.username.toLowerCase();
  const existing = store[key];
  const next: Profile = {
    ...profile,
    username: key,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  store[key] = next;
  writeStore(store);
  return next;
}

export function deleteProfile(username: string) {
  const store = readStore();
  delete store[username.toLowerCase()];
  writeStore(store);
}

export function renameProfile(oldUsername: string, newUsername: string) {
  const store = readStore();
  const oldKey = oldUsername.toLowerCase();
  const newKey = newUsername.toLowerCase();
  if (!store[oldKey] || oldKey === newKey) return;
  store[newKey] = { ...store[oldKey], username: newKey };
  delete store[oldKey];
  writeStore(store);
}
