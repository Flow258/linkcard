export const RESERVED_USERNAMES = [
  "admin",
  "login",
  "signup",
  "api",
  "settings",
  "dashboard",
  "help",
  "pricing",
  "create",
  "analytics",
  "templates",
  "www",
  "app",
];

const USERNAME_PATTERN = /^[a-z0-9_-]{3,30}$/;

export function usernameFormatError(username: string): string | null {
  const value = username.trim().toLowerCase();
  if (value.length === 0) return "Choose a username.";
  if (value.length < 3) return "Must be at least 3 characters.";
  if (value.length > 30) return "Must be 30 characters or fewer.";
  if (!USERNAME_PATTERN.test(value)) {
    return "Use only lowercase letters, numbers, hyphens, and underscores.";
  }
  if (RESERVED_USERNAMES.includes(value)) return "That username is reserved.";
  return null;
}

export function suggestUsernames(base: string): string[] {
  const clean = base.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "") || "card";
  return [
    `${clean}-dev`,
    `${clean}${Math.floor(100 + Math.random() * 899)}`,
    `${clean}-official`,
    `the-${clean}`,
  ];
}
