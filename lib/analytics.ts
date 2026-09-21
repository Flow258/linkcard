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
 */
export function trackEvent(username: string, type: AnalyticsEventType) {
  if (!API_URL || typeof window === "undefined" || !username) return;
  const url = `${API_URL.replace(/\/$/, "")}/api/events`;
  const body = JSON.stringify({ username, type });
  try {
    if (navigator.sendBeacon) {
      const sent = navigator.sendBeacon(url, new Blob([body], { type: "text/plain" }));
      if (sent) return;
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
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
