export interface Env {
  DB: D1Database;
}

const RESERVED_USERNAMES = new Set([
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
]);

const USERNAME_PATTERN = /^[a-z0-9_-]{3,30}$/;

function usernameError(username: string): string | null {
  const value = username.trim().toLowerCase();
  if (!USERNAME_PATTERN.test(value)) {
    return "Username must be 3-30 characters: lowercase letters, numbers, hyphens, underscores.";
  }
  if (RESERVED_USERNAMES.has(value)) return "That username is reserved.";
  return null;
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Owner-Token",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function noContent(status = 204): Response {
  return new Response(null, { status, headers: CORS_HEADERS });
}

interface StoredRow {
  username: string;
  owner_token: string;
  is_public: number;
  data: string;
  created_at: string;
  updated_at: string;
}

function rowToProfile(row: StoredRow): Record<string, unknown> {
  const data = JSON.parse(row.data) as Record<string, unknown>;
  return {
    ...data,
    username: row.username,
    isPublic: Boolean(row.is_public),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function randomToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

async function getRow(db: D1Database, username: string): Promise<StoredRow | null> {
  const row = await db
    .prepare("SELECT * FROM profiles WHERE username = ?")
    .bind(username.toLowerCase())
    .first<StoredRow>();
  return row ?? null;
}

async function handleUsernameAvailable(env: Env, username: string): Promise<Response> {
  const row = await getRow(env.DB, username);
  return json({ available: !row });
}

async function handleGetProfile(request: Request, env: Env, username: string): Promise<Response> {
  const row = await getRow(env.DB, username);
  if (!row) return json({ error: "Not found" }, 404);

  const token = request.headers.get("X-Owner-Token");
  const isOwner = Boolean(token) && token === row.owner_token;

  if (!row.is_public && !isOwner) return json({ error: "Not found" }, 404);

  return json({ profile: rowToProfile(row) });
}

async function handleCreateProfile(request: Request, env: Env): Promise<Response> {
  const body = (await request.json()) as Record<string, unknown>;
  const username = String(body.username ?? "").trim().toLowerCase();

  const formatError = usernameError(username);
  if (formatError) return json({ error: formatError }, 400);

  const existing = await getRow(env.DB, username);
  if (existing) return json({ error: "Username already taken" }, 409);

  const now = new Date().toISOString();
  const token = randomToken();
  const { username: _u, isPublic, createdAt, updatedAt, ...rest } = body;
  void _u;
  void createdAt;
  void updatedAt;

  await env.DB.prepare(
    "INSERT INTO profiles (username, owner_token, is_public, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(username, token, isPublic ? 1 : 0, JSON.stringify(rest), now, now)
    .run();

  const row = await getRow(env.DB, username);
  if (!row) return json({ error: "Failed to create card" }, 500);

  return json({ profile: rowToProfile(row), ownerToken: token }, 201);
}

async function handleUpdateProfile(
  request: Request,
  env: Env,
  currentUsername: string
): Promise<Response> {
  const token = request.headers.get("X-Owner-Token");
  const existing = await getRow(env.DB, currentUsername);
  if (!existing) return json({ error: "Not found" }, 404);
  if (!token || token !== existing.owner_token) return json({ error: "Unauthorized" }, 401);

  const body = (await request.json()) as Record<string, unknown>;
  const nextUsername = String(body.username ?? currentUsername).trim().toLowerCase();

  if (nextUsername !== currentUsername.toLowerCase()) {
    const formatError = usernameError(nextUsername);
    if (formatError) return json({ error: formatError }, 400);
    const collision = await getRow(env.DB, nextUsername);
    if (collision) return json({ error: "Username already taken" }, 409);
  }

  const now = new Date().toISOString();
  const { username: _u, isPublic, createdAt, updatedAt, ...rest } = body;
  void _u;
  void createdAt;
  void updatedAt;

  await env.DB.prepare(
    "UPDATE profiles SET username = ?, is_public = ?, data = ?, updated_at = ? WHERE username = ?"
  )
    .bind(nextUsername, isPublic ? 1 : 0, JSON.stringify(rest), now, currentUsername.toLowerCase())
    .run();

  const row = await getRow(env.DB, nextUsername);
  if (!row) return json({ error: "Failed to save card" }, 500);

  return json({ profile: rowToProfile(row) });
}

async function handleDeleteProfile(
  request: Request,
  env: Env,
  username: string
): Promise<Response> {
  const token = request.headers.get("X-Owner-Token");
  const existing = await getRow(env.DB, username);
  if (!existing) return noContent();
  if (!token || token !== existing.owner_token) return json({ error: "Unauthorized" }, 401);

  await env.DB.prepare("DELETE FROM profiles WHERE username = ?").bind(username.toLowerCase()).run();
  await env.DB.prepare("DELETE FROM analytics_events WHERE username = ?")
    .bind(username.toLowerCase())
    .run();

  return noContent();
}

const TRACKED_EVENTS = new Set(["page_view", "link_click", "qr_scan", "contact_download", "resume_click"]);

async function handleAnalyticsEvent(request: Request, env: Env): Promise<Response> {
  try {
    const body = (await request.json()) as { username?: string; type?: string };
    const username = String(body.username ?? "").trim().toLowerCase();
    const type = String(body.type ?? "");
    if (!username || !TRACKED_EVENTS.has(type)) return noContent();

    await env.DB.prepare(
      "INSERT INTO analytics_events (username, event_type, created_at) VALUES (?, ?, ?)"
    )
      .bind(username, type, new Date().toISOString())
      .run();
  } catch {
    // Analytics are best-effort — never surface an error to the beacon caller.
  }
  return noContent();
}

async function handleAnalyticsSummary(
  request: Request,
  env: Env,
  username: string
): Promise<Response> {
  const token = request.headers.get("X-Owner-Token");
  const profile = await getRow(env.DB, username);
  if (!profile) return json({ error: "Not found" }, 404);
  if (!token || token !== profile.owner_token) return json({ error: "Unauthorized" }, 401);

  const counts = await env.DB.prepare(
    "SELECT event_type, COUNT(*) as count FROM analytics_events WHERE username = ? GROUP BY event_type"
  )
    .bind(username.toLowerCase())
    .all<{ event_type: string; count: number }>();

  const byType: Record<string, number> = {};
  for (const row of counts.results ?? []) byType[row.event_type] = row.count;

  return json({
    pageViews: byType.page_view ?? 0,
    linkClicks: byType.link_click ?? 0,
    contactDownloads: byType.contact_download ?? 0,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return noContent(204);

    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean); // e.g. ["api","profile","jong"]

    try {
      if (parts[0] === "api" && parts[1] === "username-available" && parts[2]) {
        return handleUsernameAvailable(env, decodeURIComponent(parts[2]));
      }

      if (parts[0] === "api" && parts[1] === "profile" && !parts[2] && request.method === "POST") {
        return handleCreateProfile(request, env);
      }

      if (parts[0] === "api" && parts[1] === "profile" && parts[2]) {
        const username = decodeURIComponent(parts[2]);
        if (request.method === "GET") return handleGetProfile(request, env, username);
        if (request.method === "PUT") return handleUpdateProfile(request, env, username);
        if (request.method === "DELETE") return handleDeleteProfile(request, env, username);
      }

      if (parts[0] === "api" && parts[1] === "events" && request.method === "POST") {
        return handleAnalyticsEvent(request, env);
      }

      if (parts[0] === "api" && parts[1] === "stats" && parts[2] && request.method === "GET") {
        return handleAnalyticsSummary(request, env, decodeURIComponent(parts[2]));
      }

      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: err instanceof Error ? err.message : "Server error" }, 500);
    }
  },
};
