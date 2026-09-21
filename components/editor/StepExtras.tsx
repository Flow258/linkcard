"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Profile, Project, Service } from "@/lib/types";
import { newId } from "@/lib/utils";
import Field, { inputClass } from "./Field";

function SectionToggle({
  label,
  hint,
  checked,
  onToggle,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-black/10 bg-white/60 p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onToggle(e.target.checked)}
        className="mt-0.5 h-4 w-4"
      />
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="block text-xs text-ink-soft">{hint}</span>
      </span>
    </label>
  );
}

export default function StepExtras({
  profile,
  onChange,
}: {
  profile: Profile;
  onChange: (patch: Partial<Profile>) => void;
}) {
  const [skillDraft, setSkillDraft] = useState("");

  function setSection(key: keyof Profile["sections"], value: boolean) {
    onChange({ sections: { ...profile.sections, [key]: value } });
  }

  function addSkill() {
    const value = skillDraft.trim();
    if (!value || profile.skills.includes(value)) return;
    onChange({ skills: [...profile.skills, value] });
    setSkillDraft("");
  }

  function removeSkill(skill: string) {
    onChange({ skills: profile.skills.filter((s) => s !== skill) });
  }

  function addProject() {
    const project: Project = { id: newId(), title: "", description: "", url: "", githubUrl: "" };
    onChange({ projects: [...profile.projects, project] });
  }

  function updateProject(id: string, patch: Partial<Project>) {
    onChange({ projects: profile.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  }

  function removeProject(id: string) {
    onChange({ projects: profile.projects.filter((p) => p.id !== id) });
  }

  function addService() {
    const service: Service = { id: newId(), name: "", description: "", price: "" };
    onChange({ services: [...profile.services, service] });
  }

  function updateService(id: string, patch: Partial<Service>) {
    onChange({ services: profile.services.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }

  function removeService(id: string) {
    onChange({ services: profile.services.filter((s) => s.id !== id) });
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h3 className="font-display text-lg text-ink">Sections</h3>
        <p className="text-sm text-ink-soft">
          Turn on the sections you want visible on your card. Everything below only shows up on
          your card once its toggle is on.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SectionToggle
            label="Contact buttons"
            hint="Email me / Call me / WhatsApp buttons on the card."
            checked={profile.sections.contact}
            onToggle={(v) => setSection("contact", v)}
          />
          <SectionToggle
            label="Skills"
            hint="A row of skill tags."
            checked={profile.sections.skills}
            onToggle={(v) => setSection("skills", v)}
          />
          <SectionToggle
            label="Projects"
            hint="A small portfolio of things you've built."
            checked={profile.sections.projects}
            onToggle={(v) => setSection("projects", v)}
          />
          <SectionToggle
            label="Services"
            hint="What you offer, with optional pricing."
            checked={profile.sections.services}
            onToggle={(v) => setSection("services", v)}
          />
        </div>
      </section>

      {profile.sections.skills && (
        <section className="flex flex-col gap-3">
          <h3 className="font-display text-lg text-ink">Skills</h3>
          <div className="flex gap-2">
            <input
              className={inputClass}
              value={skillDraft}
              onChange={(e) => setSkillDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="React"
            />
            <button
              type="button"
              onClick={addSkill}
              className="focus-ring shrink-0 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink/85"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-3 py-1 text-xs text-ink"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
                  className="text-ink-soft hover:text-seal"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      {profile.sections.projects && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-ink">Projects</h3>
            <button
              type="button"
              onClick={addProject}
              className="focus-ring flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium text-ink hover:bg-black/5"
            >
              <Plus className="h-3.5 w-3.5" /> Add project
            </button>
          </div>
          {profile.projects.length === 0 && (
            <p className="text-sm text-ink-soft">No projects added yet.</p>
          )}
          <div className="flex flex-col gap-4">
            {profile.projects.map((project) => (
              <div key={project.id} className="flex flex-col gap-3 rounded-lg border border-black/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Title">
                      <input
                        className={inputClass}
                        value={project.title}
                        onChange={(e) => updateProject(project.id, { title: e.target.value })}
                        placeholder="POS System"
                      />
                    </Field>
                    <Field label="Live URL" hint="Optional">
                      <input
                        className={inputClass}
                        value={project.url}
                        onChange={(e) => updateProject(project.id, { url: e.target.value })}
                        placeholder="https://..."
                      />
                    </Field>
                    <Field label="GitHub URL" hint="Optional">
                      <input
                        className={inputClass}
                        value={project.githubUrl}
                        onChange={(e) => updateProject(project.id, { githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </Field>
                    <Field label="Description" hint="Optional">
                      <input
                        className={inputClass}
                        value={project.description}
                        onChange={(e) => updateProject(project.id, { description: e.target.value })}
                        placeholder="Inventory + point-of-sale app"
                      />
                    </Field>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProject(project.id)}
                    aria-label="Remove project"
                    className="focus-ring shrink-0 text-ink-soft hover:text-seal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {profile.sections.services && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-ink">Services</h3>
            <button
              type="button"
              onClick={addService}
              className="focus-ring flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium text-ink hover:bg-black/5"
            >
              <Plus className="h-3.5 w-3.5" /> Add service
            </button>
          </div>
          {profile.services.length === 0 && (
            <p className="text-sm text-ink-soft">No services added yet.</p>
          )}
          <div className="flex flex-col gap-4">
            {profile.services.map((service) => (
              <div key={service.id} className="flex items-start gap-3 rounded-lg border border-black/10 p-4">
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field label="Name">
                    <input
                      className={inputClass}
                      value={service.name}
                      onChange={(e) => updateService(service.id, { name: e.target.value })}
                      placeholder="Web development"
                    />
                  </Field>
                  <Field label="Price" hint="Optional">
                    <input
                      className={inputClass}
                      value={service.price}
                      onChange={(e) => updateService(service.id, { price: e.target.value })}
                      placeholder="From $500"
                    />
                  </Field>
                  <Field label="Description" hint="Optional">
                    <input
                      className={inputClass}
                      value={service.description}
                      onChange={(e) => updateService(service.id, { description: e.target.value })}
                      placeholder="Custom sites and web apps"
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={() => removeService(service.id)}
                  aria-label="Remove service"
                  className="focus-ring shrink-0 text-ink-soft hover:text-seal"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h3 className="font-display text-lg text-ink">Resume</h3>
        <Field label="Resume link" hint="Link to a PDF hosted elsewhere (Google Drive, Dropbox, etc.)">
          <input
            className={inputClass}
            value={profile.resumeUrl}
            onChange={(e) => onChange({ resumeUrl: e.target.value })}
            placeholder="https://drive.google.com/..."
          />
        </Field>
      </section>
    </div>
  );
}
