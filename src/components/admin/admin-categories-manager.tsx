"use client";

import { useState } from "react";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  status: string;
  videoCount: number;
  updatedAtLabel: string;
};

type Props = {
  categories: CategoryItem[];
};

type CategoryFormState = {
  name: string;
  description: string;
  sortOrder: string;
  status: string;
};

const initialFormState: CategoryFormState = {
  name: "",
  description: "",
  sortOrder: "0",
  status: "ACTIVE",
};

function formatCategoryStatus(status: string) {
  switch (status) {
    case "HIDDEN":
      return "隐藏";
    case "ACTIVE":
    default:
      return "启用";
  }
}

export function AdminCategoriesManager({ categories }: Props) {
  const [items, setItems] = useState(categories);
  const [createForm, setCreateForm] = useState<CategoryFormState>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, CategoryFormState>>({});
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function startEdit(item: CategoryItem) {
    setEditingId(item.id);
    setDrafts((current) => ({
      ...current,
      [item.id]: {
        name: item.name,
        description: item.description ?? "",
        sortOrder: String(item.sortOrder),
        status: item.status,
      },
    }));
    setError(null);
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreating(true);
    setError(null);

    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: createForm.name,
        description: createForm.description,
        sortOrder: Number(createForm.sortOrder) || 0,
        status: createForm.status,
      }),
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "创建分类失败。");
      setIsCreating(false);
      return;
    }

    window.location.reload();
  }

  async function handleUpdate(categoryId: string) {
    const draft = drafts[categoryId];

    if (!draft) {
      return;
    }

    setError(null);

    const response = await fetch(`/api/admin/categories/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: draft.name,
        description: draft.description,
        sortOrder: Number(draft.sortOrder) || 0,
        status: draft.status,
      }),
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "更新分类失败。");
      return;
    }

    window.location.reload();
  }

  async function handleDelete(categoryId: string) {
    setPendingDeleteId(categoryId);
    setError(null);

    const response = await fetch(`/api/admin/categories/${categoryId}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "删除分类失败。");
      setPendingDeleteId(null);
      return;
    }

    setItems((current) => current.filter((item) => item.id !== categoryId));
    setPendingDeleteId(null);
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreate}
        className="rounded-[28px] border border-white/10 bg-white/5 p-6"
      >
        <div>
          <h2 className="text-2xl font-semibold text-white">新增导航分类</h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field
            label="分类名称"
            value={createForm.name}
            onChange={(value) =>
              setCreateForm((current) => ({ ...current, name: value }))
            }
            required
          />
          <Field
            label="排序值"
            type="number"
            value={createForm.sortOrder}
            onChange={(value) =>
              setCreateForm((current) => ({ ...current, sortOrder: value }))
            }
          />
          <SelectField
            label="状态"
            value={createForm.status}
            options={["ACTIVE", "HIDDEN"]}
            onChange={(value) =>
              setCreateForm((current) => ({ ...current, status: value }))
            }
          />
          <Field
            label="分类说明"
            value={createForm.description}
            onChange={(value) =>
              setCreateForm((current) => ({ ...current, description: value }))
            }
            className="xl:col-span-2"
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
          {isCreating ? "创建中..." : "创建分类"}
        </button>
      </form>

      <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
        <div className="hidden grid-cols-[1.3fr_1.5fr_0.8fr_0.8fr_0.8fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-400 xl:grid">
          <p>分类</p>
          <p>说明</p>
          <p>排序</p>
          <p>状态</p>
          <p>视频数</p>
          <p>操作</p>
        </div>

        <div className="divide-y divide-white/10">
          {items.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-300">
              还没有分类，可以先创建第一个前台频道分类。
            </div>
          ) : (
            items.map((item) => {
              const draft = drafts[item.id] ?? {
                name: item.name,
                description: item.description ?? "",
                sortOrder: String(item.sortOrder),
                status: item.status,
              };
              const isEditing = editingId === item.id;

              return (
                <article
                  key={item.id}
                  className="grid grid-cols-1 gap-4 px-6 py-5 xl:grid-cols-[1.3fr_1.5fr_0.8fr_0.8fr_0.8fr_1fr]"
                >
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
                      分类
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
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <p className="text-xs text-slate-400">Slug：{item.slug}</p>
                      </>
                    )}
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
                      说明
                    </p>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={draft.description}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [item.id]: {
                              ...draft,
                              description: event.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                      />
                    ) : (
                      <p className="text-sm leading-7 text-slate-300">
                        {item.description || "暂未填写分类说明"}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
                      排序
                    </p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={draft.sortOrder}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [item.id]: {
                              ...draft,
                              sortOrder: event.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                      />
                    ) : (
                      <p className="font-medium text-white">{item.sortOrder}</p>
                    )}
                  </div>

                  <div className="text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
                      状态
                    </p>
                    {isEditing ? (
                      <select
                        value={draft.status}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [item.id]: { ...draft, status: event.target.value },
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                      >
                        <option value="ACTIVE">启用</option>
                        <option value="HIDDEN">隐藏</option>
                      </select>
                    ) : (
                      <p className="font-medium text-white">
                        {formatCategoryStatus(item.status)}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
                      视频数
                    </p>
                    <p className="font-medium text-white">{item.videoCount}</p>
                    <p className="mt-2 text-xs text-slate-400">{item.updatedAtLabel}</p>
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
  className?: string;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  className,
}: FieldProps) {
  return (
    <label className={`space-y-2 ${className ?? ""}`}>
      <span className="text-sm text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
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
          <option key={option} value={option}>
            {formatCategoryStatus(option)}
          </option>
        ))}
      </select>
    </label>
  );
}
