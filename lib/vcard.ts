import { Profile } from "./types";

function escapeVCard(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function buildVCard(profile: Profile, cardUrl: string): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(profile.displayName || profile.username)}`,
    `TITLE:${escapeVCard(profile.jobTitle || "")}`,
  ];

  if (profile.company) lines.push(`ORG:${escapeVCard(profile.company)}`);
  if (profile.email?.value) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(profile.email.value)}`);
  if (profile.phone?.value) lines.push(`TEL;TYPE=CELL:${escapeVCard(profile.phone.value)}`);
  if (profile.website) lines.push(`URL:${escapeVCard(profile.website)}`);
  if (profile.location) lines.push(`ADR;TYPE=WORK:;;${escapeVCard(profile.location)};;;;`);
  lines.push(`URL;TYPE=LinkCard:${escapeVCard(cardUrl)}`);
  if (profile.bio) lines.push(`NOTE:${escapeVCard(profile.bio)}`);
  lines.push("END:VCARD");

  return lines.join("\r\n");
}

export function downloadVCard(profile: Profile, cardUrl: string) {
  const vcard = buildVCard(profile, cardUrl);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${profile.username || "contact"}.vcf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
