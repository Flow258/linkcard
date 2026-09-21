import { Profile } from "./types";
import { DataBackend } from "./backend";

/**
 * The zero-setup backend: everything lives in this browser's localStorage.
 * Used automatically whenever NEXT_PUBLIC_LINKCARD_API_URL isn't set, so
 * the app works immediately with no deployment. See apiBackend.ts for the
 * real, cross-device version.
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

export const localBackend: DataBackend = {
  async listProfiles() {
    return Object.values(readStore()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  async getProfile(username) {
    return readStore()[username.toLowerCase()];
  },

  async isUsernameTaken(username, excluding) {
    const store = readStore();
    const key = username.toLowerCase();
    if (excluding && excluding.toLowerCase() === key) return false;
    return Boolean(store[key]);
  },

  async saveProfile(profile, previousUsername) {
    const store = readStore();
    const now = new Date().toISOString();
    const key = profile.username.toLowerCase();
    const oldKey = previousUsername?.toLowerCase();
    const existing = (oldKey && store[oldKey]) || store[key];
    const next: Profile = {
      ...profile,
      username: key,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    if (oldKey && oldKey !== key) delete store[oldKey];
    store[key] = next;
    writeStore(store);
    return next;
  },

  async deleteProfile(username) {
    const store = readStore();
    delete store[username.toLowerCase()];
    writeStore(store);
  },
};
