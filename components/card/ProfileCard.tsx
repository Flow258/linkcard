"use client";

import { useEffect } from "react";
import { MapPin, Mail, Phone, MessageCircle, FileText, ExternalLink, Github } from "lucide-react";
import { Profile } from "@/lib/types";
import SocialLinks from "./SocialLinks";
import ContactButtons from "./ContactButtons";
import QRCode from "./QRCode";
import { getCardUrl } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const FONT_CLASS: Record<string, string> = {
  body: "font-body",
  display: "font-display",
  stamp: "font-stamp",
};

const PHOTO_SHAPE_CLASS: Record<string, string> = {
  circle: "rounded-full",
  rounded: "rounded-2xl",
  square: "rounded-md",
};

const ALIGN_CLASS: Record<string, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// Older saved profiles (from before sections/skills/projects/services
// existed) won't have these fields — default everything on/empty so the
// card still renders instead of crashing.
function sectionsOf(profile: Profile) {
  return {
    bio: profile.sections?.bio ?? true,
    links: profile.sections?.links ?? true,
    contact: profile.sections?.contact ?? true,
    skills: profile.sections?.skills ?? false,
    projects: profile.sections?.projects ?? false,
    services: profile.sections?.services ?? false,
  };
}

export default function ProfileCard({
  profile,
  showActions = false,
  showQr = false,
  trackViews = false,
  className = "",
}: {
  profile: Profile;
  showActions?: boolean;
  showQr?: boolean;
  trackViews?: boolean;
  className?: string;
}) {
  const { colors, layout } = profile;
  const cardUrl = getCardUrl(profile.username || "you");
  const fontClass = FONT_CLASS[profile.fontId] ?? "font-body";
  const sections = sectionsOf(profile);
  const skills = profile.skills ?? [];
  const projects = profile.projects ?? [];
  const services = profile.services ?? [];

  useEffect(() => {
    if (trackViews && profile.username) trackEvent(profile.username, "page_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackViews, profile.username]);

  const contactButtons: { label: string; href: string; icon: typeof Mail }[] = [];
  if (sections.contact && profile.email?.public && profile.email.value) {
    contactButtons.push({ label: "Email me", href: `mailto:${profile.email.value}`, icon: Mail });
  }
  if (sections.contact && profile.phone?.public && profile.phone.value) {
    contactButtons.push({ label: "Call me", href: `tel:${profile.phone.value}`, icon: Phone });
  }
  const whatsappLink = profile.links.find((l) => l.type === "whatsapp" && l.visible && l.url);
  if (sections.contact && whatsappLink) {
    contactButtons.push({ label: "WhatsApp", href: whatsappLink.url, icon: MessageCircle });
  }

  return (
    <div
      className={`w-full max-w-sm overflow-hidden rounded-card shadow-card ${fontClass} ${className}`}
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <div className={`flex flex-col gap-4 px-7 py-9 ${ALIGN_CLASS[layout.align]}`}>
        <div
          className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden text-lg font-semibold ${PHOTO_SHAPE_CLASS[layout.photoShape]}`}
          style={{ backgroundColor: colors.accent, color: colors.background }}
        >
          {profile.photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photoDataUrl}
              alt={profile.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{initials(profile.displayName || "?") || "?"}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold leading-tight">
            {profile.displayName || "Your name"}
          </h2>
          <p className="text-sm opacity-80">
            {[profile.jobTitle, profile.company].filter(Boolean).join(" · ") || "Job title"}
          </p>
          {profile.location && (
            <p className="mt-1 flex items-center gap-1 text-xs opacity-70">
              <MapPin className="h-3 w-3" /> {profile.location}
            </p>
          )}
        </div>

        {sections.bio && profile.bio && (
          <p className="text-sm leading-relaxed opacity-90">{profile.bio}</p>
        )}

        {sections.links && (
          <div className="mt-1 w-full">
            <SocialLinks links={profile.links} colors={colors} buttonStyle={layout.buttonStyle} />
          </div>
        )}

        {contactButtons.length > 0 && (
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
            {contactButtons.map((btn) => (
              <a
                key={btn.label}
                href={btn.href}
                target={btn.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer noopener"
                className="focus-ring flex items-center justify-center gap-1.5 rounded-lg border-2 px-2 py-2 text-xs font-medium"
                style={{ borderColor: colors.button, color: colors.text }}
              >
                <btn.icon className="h-3.5 w-3.5" /> {btn.label}
              </a>
            ))}
          </div>
        )}

        {sections.skills && skills.length > 0 && (
          <div className="w-full">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full px-2.5 py-1 text-xs"
                  style={{ backgroundColor: `${colors.text}14`, color: colors.text }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {sections.projects && projects.length > 0 && (
          <div className="w-full">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Projects
            </p>
            <div className="flex flex-col gap-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-lg px-3 py-2.5 text-left"
                  style={{ backgroundColor: `${colors.text}0D` }}
                >
                  <p className="text-sm font-medium">{project.title || "Untitled project"}</p>
                  {project.description && (
                    <p className="text-xs opacity-70">{project.description}</p>
                  )}
                  <div className="mt-1.5 flex gap-3">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex items-center gap-1 text-xs font-medium underline underline-offset-2"
                      >
                        <ExternalLink className="h-3 w-3" /> View
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex items-center gap-1 text-xs font-medium underline underline-offset-2"
                      >
                        <Github className="h-3 w-3" /> Code
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sections.services && services.length > 0 && (
          <div className="w-full">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Services
            </p>
            <div className="flex flex-col gap-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5"
                  style={{ backgroundColor: `${colors.text}0D` }}
                >
                  <div>
                    <p className="text-sm font-medium">{service.name || "Service"}</p>
                    {service.description && (
                      <p className="text-xs opacity-70">{service.description}</p>
                    )}
                  </div>
                  {service.price && (
                    <span className="shrink-0 text-xs font-semibold opacity-80">
                      {service.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium"
            style={{ borderColor: colors.button, color: colors.text }}
          >
            <FileText className="h-4 w-4" /> Download resume
          </a>
        )}

        {showQr && (
          <div className="mt-2 flex flex-col items-center gap-2 self-center">
            <div className="rounded-xl bg-white p-3">
              <QRCode url={cardUrl} size={120} fgColor={colors.text} />
            </div>
            <p className="text-xs opacity-60">{cardUrl.replace(/^https?:\/\//, "")}</p>
          </div>
        )}

        {showActions && (
          <div className="mt-2 w-full">
            <ContactButtons profile={profile} cardUrl={cardUrl} colors={colors} />
          </div>
        )}

        <p className="mt-3 text-[11px] uppercase tracking-wide opacity-40">Powered by LinkCard</p>
      </div>
    </div>
  );
}
