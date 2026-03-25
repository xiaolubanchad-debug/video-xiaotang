"use client";

import { useState } from "react";

type TagItem = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  videoCount: number;
  updatedAtLabel: string;
};

type Props = {
  tags: TagItem[];
};

type TagFormState = {
  name: string;
  color: string;
};

const initialFormState: TagFormState = {
  name: "",
  color: "",
};

export function AdminTagsManager({ tags }: Props) {
  const [items, setItems] = useState(tags);
  const [createForm, setCreateForm] = useState<TagFormState>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, TagFormState>>({});
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function startEdit(item: TagItem) {
    setEditingId(item.id);
    setDrafts((current) => ({
      ...current,
      [item.id]: {
        name: item.name,
        color: item.color ?? "",
      },
    }));
    setError(null);
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreating(true);
    setError(null);

    const response = await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "创建标签失败。");
      setIsCreating(false);
      return;
    }

    window.location.reload();
  }

  async function handleUpdate(tagId: string) {
    const draft = drafts[tagId];

    if (!draft) {
      return;
    }

    setError(null);

    const response = await fetch(`/api/admin/tags/${tagId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "更新标签失败。");
      return;
    }

    window.location.reload();
  }

  async function handleDelete(tagId: string) {
    setPendingDeleteId(tagId);
    setError(null);

    const response = await fetch(`/api/admin/tags/${tagId}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "删除标签失败。");
      setPendingDeleteId(null);
      return;
    }

    setItems((current) => current.filter((item) => item.id !== tagId));
    setPendingDeleteId(null);
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreate}
        className="rounded-[28px] border border-white/10 bg-white/5 p-6"
      >
        <div>
          <h2 className="text-2xl font-semibold text-white">新增可复用标签</h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field
            label="标签名称"
            value={createForm.name}
            onChange={(value) =>
              setCreateForm((current) => ({ ...current, name: value }))
            }
            required
          />
          <Field
            label="标签颜色"
            value={createForm.color}
            onChange={(value) =>
              setCreateForm((current) => ({ ...current, color: value }))
            }
            placeholder="#B8C4FF"
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
          {isCreating ? "创建中..." : "创建标签"}
        </button>
      </form>

      <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
        <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-400 lg:grid">
          <p>标签</p>
          <p>颜色</p>
          <p>视频数</p>
          <p>操作</p>
        </div>

        <div className="divide-y divide-white/10">
          {items.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-300">
              还没有标签，可以先创建搜索和运营会用到的内容标签。
            </div>
          ) : (
            items.map((item) => {
              const draft = drafts[item.id] ?? {
                name: item.name,
                color: item.color ?? "",
              };
              const isEditing = editingId === item.id;

              return (
                <article
                  key={item.id}
                  className="grid grid-cols-1 gap-4 px-6 py-5 lg:grid-cols-[1.4fr_1fr_0.8fr_1fr]"
                >
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 lg:hidden">
                      标签
                    </p>
                    {isEditing ? (
                      <input
                        value={draft.name}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [item.id]: { ...draft, name: event.target.value },
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                      />
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <span
                            className="h-3 w-3 rounded-full border border-white/10"
                            style={{ backgroundColor: item.color ?? "#94a3b8" }}
                          />
                          <h3 className="text-lg font-semibold text-white">
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400">Slug：{item.slug}</p>
                      </>
                    )}
                  </div>

                  <div className="text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 lg:hidden">
                      颜色
                    </p>
                    {isEditing ? (
                      <input
                        value={draft.color}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [item.id]: { ...draft, color: event.target.value },
                          }))
                        }
                        placeholder="#B8C4FF"
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                      />
                    ) : (
                      <p className="font-medium text-white">
                        {item.color || "默认灰蓝色"}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 lg:hidden">
                      视频数
                    </p>
                    <p className="font-medium text-white">{item.videoCount}</p>
                    <p className="mt-2 text-xs text-slate-400">{item.updatedAtLabel}</p>
                  </div>

                  <div className="flex flex-wrap items-start gap-2">
                    <p className="w-full text-xs uppercase tracking-[0.3em] text-slate-500 lg:hidden">
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
  placeholder?: string;
  required?: boolean;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: FieldProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500"
      />
    </label>
  );
}
