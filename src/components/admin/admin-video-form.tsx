"use client";

import { useState } from "react";

type Props = {
  onSuccessRedirect?: string;
  apiEndpoint?: string;
  method?: "POST" | "PUT";
  submitLabel?: string;
  initialValues?: {
    title?: string;
    subtitle?: string;
    description?: string;
    coverUrl?: string;
    posterUrl?: string;
    trailerUrl?: string;
    sourceUrl?: string;
    type?: string;
    categoryName?: string;
    region?: string;
    language?: string;
    year?: number | null;
    durationSeconds?: number | null;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    tags?: string[];
  };
};

export function AdminVideoForm({
  onSuccessRedirect = "/admin/videos",
  apiEndpoint = "/api/admin/videos",
  method = "POST",
  submitLabel,
  initialValues,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const tags = String(formData.get("tags") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      title: String(formData.get("title") ?? ""),
      subtitle: String(formData.get("subtitle") ?? ""),
      description: String(formData.get("description") ?? ""),
      coverUrl: String(formData.get("coverUrl") ?? ""),
      posterUrl: String(formData.get("posterUrl") ?? ""),
      trailerUrl: String(formData.get("trailerUrl") ?? ""),
      type: String(formData.get("type") ?? "movie"),
      region: String(formData.get("region") ?? ""),
      language: String(formData.get("language") ?? ""),
      year: formData.get("year") ? Number(formData.get("year")) : undefined,
      durationSeconds: formData.get("durationSeconds")
        ? Number(formData.get("durationSeconds"))
        : undefined,
      status: String(formData.get("status") ?? "DRAFT"),
      categoryName: String(formData.get("categoryName") ?? ""),
      tags,
      sourceUrl: String(formData.get("sourceUrl") ?? ""),
    };

    const response = await fetch(apiEndpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as {
      ok: boolean;
      error?: string;
    };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "Failed to create the video.");
      setIsSubmitting(false);
      return;
    }

    window.location.href = onSuccessRedirect;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)]"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Title"
          name="title"
          required
          defaultValue={initialValues?.title}
        />
        <Field
          label="Subtitle"
          name="subtitle"
          defaultValue={initialValues?.subtitle}
        />
        <Field
          label="Cover URL"
          name="coverUrl"
          type="url"
          defaultValue={initialValues?.coverUrl}
        />
        <Field
          label="Poster URL"
          name="posterUrl"
          type="url"
          defaultValue={initialValues?.posterUrl}
        />
        <Field
          label="Trailer URL"
          name="trailerUrl"
          type="url"
          defaultValue={initialValues?.trailerUrl}
        />
        <Field
          label="Source URL"
          name="sourceUrl"
          type="url"
          defaultValue={initialValues?.sourceUrl}
        />
        <Field
          label="Type"
          name="type"
          defaultValue={initialValues?.type ?? "movie"}
        />
        <Field
          label="Category"
          name="categoryName"
          defaultValue={initialValues?.categoryName}
        />
        <Field
          label="Region"
          name="region"
          defaultValue={initialValues?.region}
        />
        <Field
          label="Language"
          name="language"
          defaultValue={initialValues?.language}
        />
        <Field
          label="Year"
          name="year"
          type="number"
          defaultValue={initialValues?.year ?? undefined}
        />
        <Field
          label="Duration (seconds)"
          name="durationSeconds"
          type="number"
          defaultValue={initialValues?.durationSeconds ?? undefined}
        />
        <Field
          label="Tags (comma separated)"
          name="tags"
          className="md:col-span-2"
          defaultValue={initialValues?.tags?.join(", ")}
        />
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Status</span>
          <select
            name="status"
            defaultValue={initialValues?.status ?? "DRAFT"}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-slate-300">Description</span>
          <textarea
            name="description"
            rows={6}
            defaultValue={initialValues?.description}
            className="w-full rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
            placeholder="A short editorial description for the video..."
          />
        </label>
      </div>

      {error ? (
        <p className="mt-5 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? method === "POST"
              ? "Creating..."
              : "Saving..."
            : submitLabel ?? (method === "POST" ? "Create video" : "Save changes")}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  className?: string;
};

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  className,
}: FieldProps) {
  return (
    <label className={`space-y-2 ${className ?? ""}`}>
      <span className="text-sm text-slate-300">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
      />
    </label>
  );
}
