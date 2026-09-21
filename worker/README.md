# LinkCard API (Cloudflare Worker + D1)

The real, cross-device backend for LinkCard. Free tier on Cloudflare covers
this comfortably for personal use (D1's free plan includes 5M row reads/day,
100k row writes/day, 5GB storage).

## What it does

- Stores each card as one row in D1 (`profiles` table), keyed by username.
- Has no user accounts. Creating a card returns a random **owner token**;
  the Next.js app remembers it in the browser's `localStorage`
  (`lib/ownerTokens.ts`) and sends it back on every edit/delete via the
  `X-Owner-Token` header. Anyone with the link can view a *published*
  card; only the browser holding the token can change or unpublish it.
- Records simple analytics events (page views, contact-card downloads) if
  you want the `/analytics/[username]` page in the app to show real numbers.

## Deploy it

You'll need a free Cloudflare account and Node.js.

```bash
cd worker
npm install
npx wrangler login          # opens a browser to authorize

npm run db:create           # creates the D1 database — copy the
                             # "database_id" it prints into wrangler.toml

npm run db:migrate:remote   # creates the tables in that database

npm run deploy               # publishes the Worker and prints its URL,
                              # e.g. https://linkcard-api.you.workers.dev
```

While developing locally you can run `npm run dev` (starts the Worker on
`http://localhost:8787`) and `npm run db:migrate:local` to set up a local
D1 database for it to use.

## Point the app at it

In the Next.js project root (not this folder), create `.env.local`:

```bash
NEXT_PUBLIC_LINKCARD_API_URL=https://linkcard-api.you.workers.dev
```

Restart `npm run dev`. `lib/data.ts` picks up the API backend automatically
whenever this variable is set — nothing else in the app needs to change.

## API reference

| Method | Path                              | Auth               | Purpose                          |
| ------ | --------------------------------- | ------------------ | --------------------------------- |
| GET    | `/api/username-available/:name`   | —                   | `{ available: boolean }`          |
| POST   | `/api/profile`                    | —                   | Create a card → `{ profile, ownerToken }` |
| GET    | `/api/profile/:username`          | Owner token optional| Public cards to anyone; drafts need the token |
| PUT    | `/api/profile/:username`          | `X-Owner-Token`     | Update (can also rename by sending a new `username`) |
| DELETE | `/api/profile/:username`          | `X-Owner-Token`     | Delete the card and its analytics |
| POST   | `/api/events`                     | —                   | Fire-and-forget `{ username, type }` |
| GET    | `/api/stats/:username`            | `X-Owner-Token`     | Aggregate counts for that card    |

## Notes on this design

- **One JSON blob per card**, not the fully-normalized multi-table schema
  from the original product plan. A card is always read/written as one
  whole document by the app, so this avoids joins entirely. If you later
  want to *query across* cards (e.g. "everyone using the Developer
  template"), that's when it's worth splitting `links`/`projects`/etc. into
  their own tables — the migration is straightforward since `data` is just
  JSON.
- **No real accounts.** This intentionally follows the original plan's
  MVP guidance ("don't make social auth necessary for the first
  prototype"). The owner-token model gives you real multi-device
  publishing without building a login system. To add real accounts
  later: add a `users` table, issue a session cookie or JWT at login, and
  swap the `X-Owner-Token` check in `src/index.ts` for a check against the
  session's user ID matching the profile's owner.
- **CORS is wide open** (`Access-Control-Allow-Origin: *`) since anyone
  should be able to load a public card from your Worker. If you add
  private data later, tighten this to your app's actual origin.
