export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function getSiteOrigin(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return "https://linkcard.site";
}

export function getCardUrl(username: string): string {
  return `${getSiteOrigin()}/${username}`;
}
