"use client";

import { BannerStatus } from "@prisma/client";
import { useState } from "react";

type BannerItem = {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string | null;
  videoId: string | null;
  videoTitle: string | null;
  sortOrder: number;
  status: BannerStatus;
  startAt: string;
  endAt: string;
  updatedAtLabel: string;
};

type VideoOption = {
  id: string;
  title: string;
  slug: string;
  status: string;
};

type Props = {
  banners: BannerItem[];
  videoOptions: VideoOption[];
};

type BannerFormState = {
  title: string;
  imageUrl: string;
  targetUrl: string;
  videoId: string;
  sortOrder: string;
  status: BannerStatus;
  startAt: string;
  endAt: string;
};

const initialFormState: BannerFormState = {
  title: "",
  imageUrl: "",
  targetUrl: "",
  videoId: "",
  sortOrder: "0",
  status: BannerStatus.DRAFT,
  startAt: "",
  endAt: "",
};

export function AdminBannersManager({ banners, videoOptions }: Props) {
  const [items, setItems] = useState(banners);
  const [createForm, setCreateForm] = useState<BannerFormState>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, BannerFormState>>({});
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function toFormState(item: BannerItem): BannerFormState {
    return {
      title: item.title,
      imageUrl: item.imageUrl,
      targetUrl: item.targetUrl ?? "",
      videoId: item.videoId ?? "",
      sortOrder: String(item.sortOrder),
      status: item.status,
      startAt: item.startAt,
      endAt: item.endAt,
    };
  }

  function updateCreateField<Key extends keyof BannerFormState>(
    key: Key,
    value: BannerFormState[Key],
  ) {
    setCreateForm((current) => ({ ...current, [key]: value }));
  }

  function updateDraftField<Key extends keyof BannerFormState>(
    bannerId: string,
    key: Key,
    value: BannerFormState[Key],
  ) {
    setDrafts((current) => ({
      ...current,
      [bannerId]: {
        ...(current[bannerId] ?? initialFormState),
        [key]: value,
      },
    }));
  }

  function startEdit(item: BannerItem) {
    setEditingId(item.id);
    setDrafts((current) => ({
      ...current,
      [item.id]: toFormState(item),
    }));
    setError(null);
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreating(true);
    setError(null);

    const response = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...createForm,
        sortOrder: Number(createForm.sortOrder) || 0,
      }),
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "创建 Banner 失败。");
      setIsCreating(false);
      return;
    }

    window.location.reload();
  }

  async function handleUpdate(bannerId: string) {
    const draft = drafts[bannerId];

    if (!draft) {
      return;
    }

    setError(null);

    const response = await fetch(`/api/admin/banners/${bannerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...draft,
        sortOrder: Number(draft.sortOrder) || 0,
      }),
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "更新 Banner 失败。");
      return;
    }

    window.location.reload();
  }

  async function handleDelete(bannerId: string) {
    setPendingDeleteId(bannerId);
    setError(null);

    const response = await fetch(`/api/admin/banners/${bannerId}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "删除 Banner 失败。");
      setPendingDeleteId(null);
      return;
    }

    setItems((current) => current.filter((item) => item.id !== bannerId));
    setPendingDeleteId(null);
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreate}
        className="rounded-[28px] border border-white/10 bg-white/5 p-6"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
            New Banner
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            创建首页主视觉 Banner
          </h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field
            label="标题"
            value={createForm.title}
            onChange={(value) => updateCreateField("title", value)}
            required
          />
          <Field
            label="图片地址"
            value={createForm.imageUrl}
            onChange={(value) => updateCreateField("imageUrl", value)}
            required
          />
          <Field
            label="跳转地址"
            value={createForm.targetUrl}
            onChange={(value) => updateCreateField("targetUrl", value)}
            placeholder="/search 或 https://..."
          />
          <Field
            label="排序值"
            type="number"
            value={createForm.sortOrder}
            onChange={(value) => updateCreateField("sortOrder", value)}
          />
          <SelectField
            label="关联视频"
            value={createForm.videoId}
            options={[
              { value: "", label: "不关联视频" },
              ...videoOptions.map((video) => ({
                value: video.id,
                label: `${video.title} · ${video.status}`,
              })),
            ]}
            onChange={(value) => updateCreateField("videoId", value)}
          />
          <SelectField
            label="状态"
            value={createForm.status}
            options={Object.values(BannerStatus).map((status) => ({
              value: status,
              label: status,
            }))}
            onChange={(value) =>
              updateCreateField("status", value as BannerStatus)
            }
          />
          <Field
            label="开始时间"
            type="datetime-local"
            value={createForm.startAt}
            onChange={(value) => updateCreateField("startAt", value)}
          />
          <Field
            label="结束时间"
            type="datetime-local"
            value={createForm.endAt}
            onChange={(value) => updateCreateField("endAt", value)}
          />
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isCreating}
          className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isCreating ? "创建中..." : "创建 Banner"}
        </button>
      </form>

      <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
        <div className="hidden grid-cols-[1.3fr_1.2fr_0.9fr_0.9fr_1fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-400 xl:grid">
          <p>Banner</p>
          <p>关联与跳转</p>
          <p>状态</p>
          <p>时间窗口</p>
          <p>更新时间</p>
          <p>操作</p>
        </div>

        <div className="divide-y divide-white/10">
          {items.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-300">
              还没有首页 Banner。创建后首页将优先展示已生效的 Banner。
            </div>
          ) : (
            items.map((item) => {
              const draft = drafts[item.id] ?? toFormState(item);
              const isEditing = editingId === item.id;

              return (
                <article
                  key={item.id}
                  className="grid grid-cols-1 gap-4 px-6 py-5 xl:grid-cols-[1.3fr_1.2fr_0.9fr_0.9fr_1fr_1fr]"
                >
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
                      Banner
                    </p>
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          value={draft.title}
                          onChange={(event) =>
                            updateDraftField(item.id, "title", event.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                        />
                        <input
                          value={draft.imageUrl}
                          onChange={(event) =>
                            updateDraftField(item.id, "imageUrl", event.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <p className="text-xs break-all text-slate-400">
                          {item.imageUrl}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="space-y-3 text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
                      关联与跳转
                    </p>
                    {isEditing ? (
                      <>
                        <select
                          value={draft.videoId}
                          onChange={(event) =>
                            updateDraftField(item.id, "videoId", event.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                        >
                          <option value="">不关联视频</option>
                          {videoOptions.map((video) => (
                            <option key={video.id} value={video.id}>
                              {video.title} · {video.status}
                            </option>
                          ))}
                        </select>
                        <input
                          value={draft.targetUrl}
                          onChange={(event) =>
                            updateDraftField(item.id, "targetUrl", event.target.value)
                          }
                          placeholder="/search 或 https://..."
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                        />
                      </>
                    ) : (
                      <>
                        <p>{item.videoTitle ? `关联视频：${item.videoTitle}` : "未关联视频"}</p>
                        <p className="break-all text-slate-400">
                          {item.targetUrl || "无额外跳转地址"}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="space-y-3 text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
                      状态
                    </p>
                    {isEditing ? (
                      <>
                        <select
                          value={draft.status}
                          onChange={(event) =>
                            updateDraftField(
                              item.id,
                              "status",
                              event.target.value as BannerStatus,
                            )
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                        >
                          {Object.values(BannerStatus).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={draft.sortOrder}
                          onChange={(event) =>
                            updateDraftField(item.id, "sortOrder", event.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                        />
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-white">{item.status}</p>
                        <p className="text-slate-400">排序：{item.sortOrder}</p>
                      </>
                    )}
                  </div>

                  <div className="space-y-3 text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
                      时间窗口
                    </p>
                    {isEditing ? (
                      <>
                        <input
                          type="datetime-local"
                          value={draft.startAt}
                          onChange={(event) =>
                            updateDraftField(item.id, "startAt", event.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                        />
                        <input
                          type="datetime-local"
                          value={draft.endAt}
                          onChange={(event) =>
                            updateDraftField(item.id, "endAt", event.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                        />
                      </>
                    ) : (
                      <>
                        <p>{item.startAt || "立即生效"}</p>
                        <p className="text-slate-400">{item.endAt || "长期展示"}</p>
                      </>
                    )}
                  </div>

                  <div className="text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
                      更新时间
                    </p>
                    <p>{item.updatedAtLabel}</p>
                  </div>

                  <div className="flex flex-wrap items-start gap-2">
                    <p className="w-full text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
                      操作
                    </p>
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void handleUpdate(item.id)}
                          className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
                        >
                          保存
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/8"
                        >
                          取消
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
                      >
                        编辑
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void handleDelete(item.id)}
                      disabled={pendingDeleteId === item.id}
                      className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {pendingDeleteId === item.id ? "删除中..." : "删除"}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: FieldProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
};

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
