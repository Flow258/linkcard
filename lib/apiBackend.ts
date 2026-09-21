import { Profile } from "./types";
import { DataBackend } from "./backend";
import { getOwnerToken, setOwnerToken, renameOwnerToken, forgetOwnerToken, ownedUsernames } from "./ownerTokens";

/**
 * Talks to the Worker API in /worker. There are no user accounts in this
 * version — instead, creating a card returns a random "owner token" that
 * this browser remembers (lib/ownerTokens.ts) and sends back with every
 * edit or delete. Anyone with the link can view a published card; only the
 * browser holding the token can change it. Good enough for a personal
 * card, and a straightforward place to add real auth later (swap the
 * token header for a session cookie / JWT in this file and the Worker).
 */

interface ApiEnvelope {
  profile: Profile;
  ownerToken?: string;
}

export function createApiBackend(apiUrl: string): DataBackend {
  const base = apiUrl.replace(/\/$/, "");

  async function request(path: string, init?: RequestInit): Promise<Response> {
    return fetch(`${base}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  }

  async function getProfile(username: string): Promise<Profile | undefined> {
    const token = getOwnerToken(username);
    const res = await request(`/api/profile/${encodeURIComponent(username)}`, {
      headers: token ? { "X-Owner-Token": token } : undefined,
    });
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error(`Failed to load @${username}`);
    const data = (await res.json()) as ApiEnvelope;
    return data.profile;
  }

  return {
    async listProfiles() {
      const usernames = ownedUsernames();
      const results = await Promise.all(
        usernames.map(async (username) => {
          try {
            return await getProfile(username);
          } catch {
            return undefined;
          }
        })
      );
      return results
        .filter((p): p is Profile => Boolean(p))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    },

    getProfile,

    async isUsernameTaken(username, excluding) {
      if (excluding && excluding.toLowerCase() === username.toLowerCase()) return false;
      const res = await request(`/api/username-available/${encodeURIComponent(username)}`);
      if (!res.ok) return false;
      const data = (await res.json()) as { available: boolean };
      return !data.available;
    },

    async saveProfile(profile, previousUsername) {
      const existingKey = previousUsername ?? profile.username;
      const token = getOwnerToken(existingKey);

      if (!token) {
        const res = await request("/api/profile", {
          method: "POST",
          body: JSON.stringify(profile),
        });
        if (!res.ok) throw new Error("Failed to create card");
        const data = (await res.json()) as ApiEnvelope;
        if (data.ownerToken) setOwnerToken(data.profile.username, data.ownerToken);
        return data.profile;
      }

      const res = await request(`/api/profile/${encodeURIComponent(existingKey)}`, {
        method: "PUT",
        headers: { "X-Owner-Token": token },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to save card");
      const data = (await res.json()) as ApiEnvelope;
      if (previousUsername && previousUsername.toLowerCase() !== profile.username.toLowerCase()) {
        renameOwnerToken(previousUsername, profile.username);
      }
      return data.profile;
    },

    async deleteProfile(username) {
      const token = getOwnerToken(username);
      await request(`/api/profile/${encodeURIComponent(username)}`, {
        method: "DELETE",
        headers: token ? { "X-Owner-Token": token } : undefined,
      });
      forgetOwnerToken(username);
    },
  };
}
