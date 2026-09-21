import { Profile } from "./types";

/**
 * Every persistence backend (localStorage today, the Cloudflare Worker API
 * once you deploy it) implements this same shape. Nothing in the UI layer
 * imports a specific backend directly — everything goes through
 * `lib/data.ts`, which picks one based on whether an API URL is configured.
 */
export interface DataBackend {
  listProfiles(): Promise<Profile[]>;
  getProfile(username: string): Promise<Profile | undefined>;
  isUsernameTaken(username: string, excluding?: string): Promise<boolean>;
  /**
   * `previousUsername` is only needed when the save is renaming an existing
   * card (the username field changed since the last save) — pass the
   * username it was saved under before, so a backend can move/re-key it
   * instead of creating a duplicate.
   */
  saveProfile(profile: Profile, previousUsername?: string): Promise<Profile>;
  deleteProfile(username: string): Promise<void>;
}
