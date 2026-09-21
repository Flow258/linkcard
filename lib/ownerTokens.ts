const TOKENS_KEY = "linkcard.ownerTokens.v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function readTokens(): Record<string, string> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(TOKENS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeTokens(tokens: Record<string, string>) {
  if (!isBrowser()) return;
  window.localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export function getOwnerToken(username: string): string | undefined {
  return readTokens()[username.toLowerCase()];
}

export function setOwnerToken(username: string, token: string) {
  const tokens = readTokens();
  tokens[username.toLowerCase()] = token;
  writeTokens(tokens);
}

export function renameOwnerToken(oldUsername: string, newUsername: string) {
  const tokens = readTokens();
  const token = tokens[oldUsername.toLowerCase()];
  if (!token) return;
  delete tokens[oldUsername.toLowerCase()];
  tokens[newUsername.toLowerCase()] = token;
  writeTokens(tokens);
}

export function forgetOwnerToken(username: string) {
  const tokens = readTokens();
  delete tokens[username.toLowerCase()];
  writeTokens(tokens);
}

export function ownedUsernames(): string[] {
  return Object.keys(readTokens());
}
