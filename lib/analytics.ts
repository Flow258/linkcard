const API_URL = process.env.NEXT_PUBLIC_LINKCARD_API_URL;

export const analyticsEnabled = Boolean(API_URL);

export type AnalyticsEventType =
  | "page_view"
  | "link_click"
  | "qr_scan"
  | "contact_download"
  | "resume_click";

export interface AnalyticsSummary {
  pageViews: number;
  linkClicks: number;
  contactDownloads: number;
}

/**
 * Records one event and never throws — a failed analytics call should
 * never break the page for a visitor. No-ops entirely on the localStorage
 * backend, since there's nowhere durable to send it.
 *
 * Deliberately uses fetch(..., { keepalive: true }) instead of
 * navigator.sendBeacon(). Beacon requests are flagged internally by most
 * ad/tracker blockers (Brave Shields, uBlock Origin, NoScript, etc.) as
 * resource type "ping" and silently dropped regardless of destination
 * domain — sendBeacon() still returns true (looks queued) but the
 * request never leaves the browser. keepalive fetch gives the same
 * "survives page navigation" behavior without that blind spot.
 */
export function trackEvent(username: string, type: AnalyticsEventType) {
  if (!API_URL || typeof window === "undefined" || !username) return;
  const url = `${API_URL.replace(/\/$/, "")}/api/events`;
  const body = JSON.stringify({ username, type });
  try {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* analytics failures are never surfaced to the visitor */
    });
  } catch {
    /* analytics failures are never surfaced to the visitor */
  }
}

export async function getAnalyticsSummary(
  username: string,
  ownerToken: string
): Promise<AnalyticsSummary | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(
      `${API_URL.replace(/\/$/, "")}/api/stats/${encodeURIComponent(username)}`,
      { headers: { "X-Owner-Token": ownerToken } }
    );
    if (!res.ok) return null;
    return (await res.json()) as AnalyticsSummary;
  } catch {
    return null;
  }
}