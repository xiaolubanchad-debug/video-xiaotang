"use client";

import { useMemo, useState } from "react";

import {
  HOME_SECTION_MAX_ITEMS,
  ManualHomeSectionKey,
} from "@/lib/home-sections";

type SectionItem = {
  id: string;
  title: string;
  slug: string;
  updatedAtLabel: string;
};

type SectionData = {
  key: ManualHomeSectionKey;
  title: string;
  description: string;
  items: SectionItem[];
};

type VideoOption = {
  id: string;
  title: string;
  slug: string;
  status: string;
};

type Props = {
  sections: SectionData[];
  videos: VideoOption[];
};

function formatVideoStatus(status: string) {
  switch (status) {
    case "PUBLISHED":
      return "已发布";
    case "ARCHIVED":
      return "已归档";
    case "DRAFT":
    default:
      return "草稿";
  }
}

export function AdminHomeSectionsManager({ sections, videos }: Props) {
  const [draft, setDraft] = useState({
    hotVideoIds:
      sections
        .find((section) => section.key === "hot")
        ?.items.map((item) => item.id) ?? [],
    editorVideoIds:
      sections
        .find((section) => section.key === "editor")
        ?.items.map((item) => item.id) ?? [],
  });
  const [picker, setPicker] = useState<Record<ManualHomeSectionKey, string>>({
    hot: "",
    editor: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const videoMap = useMemo(
    () => new Map(videos.map((video) => [video.id, video])),
    [videos],
  );

  const allSelectedIds = useMemo(
    () => new Set([...draft.hotVideoIds, ...draft.editorVideoIds]),
    [draft.editorVideoIds, draft.hotVideoIds],
  );

  function getSectionItems(sectionKey: ManualHomeSectionKey) {
    const ids = sectionKey === "hot" ? draft.hotVideoIds : draft.editorVideoIds;

    return ids
      .map((id) => {
        const video = videoMap.get(id);

        if (!video) {
          return null;
        }

        return video;
      })
      .filter(Boolean) as VideoOption[];
  }

  function setSectionIds(sectionKey: ManualHomeSectionKey, nextIds: string[]) {
    setDraft((current) => ({
      ...current,
      ...(sectionKey === "hot"
        ? { hotVideoIds: nextIds }
        : { editorVideoIds: nextIds }),
    }));
  }

  function handleAdd(sectionKey: ManualHomeSectionKey) {
    const selectedVideoId = picker[sectionKey];

    if (!selectedVideoId) {
      return;
    }

    const ids = sectionKey === "hot" ? draft.hotVideoIds : draft.editorVideoIds;

    if (ids.length >= HOME_SECTION_MAX_ITEMS) {
      setError(`每个区块最多只能放 ${HOME_SECTION_MAX_ITEMS} 个视频。`);
      return;
    }

    setSectionIds(sectionKey, [...ids, selectedVideoId]);
    setPicker((current) => ({ ...current, [sectionKey]: "" }));
    setError(null);
  }

  function handleRemove(sectionKey: ManualHomeSectionKey, videoId: string) {
    const ids = sectionKey === "hot" ? draft.hotVideoIds : draft.editorVideoIds;
    setSectionIds(
      sectionKey,
      ids.filter((id) => id !== videoId),
    );
  }

  function handleMove(
    sectionKey: ManualHomeSectionKey,
    videoId: string,
    direction: "up" | "down",
  ) {
    const ids = [...(sectionKey === "hot" ? draft.hotVideoIds : draft.editorVideoIds)];
    const index = ids.indexOf(videoId);

    if (index === -1) {
      return;
    }

    const nextIndex = direction === "up" ? index - 1 : index + 1;

    if (nextIndex < 0 || nextIndex >= ids.length) {
      return;
    }

    [ids[index], ids[nextIndex]] = [ids[nextIndex], ids[index]];
    setSectionIds(sectionKey, ids);
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);

    const response = await fetch("/api/admin/home-sections", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(draft),
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "保存首页区块失败。");
      setIsSaving(false);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">管理首页手工区块</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              首页固定 4 个内容区块，其中“热门推荐”和“站长精选”由后台手工编排。
              “最新更新”按发布时间倒序展示，“猜你喜欢”每次刷新随机返回 8 个不重复视频。
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "保存中..." : "保存首页区块"}
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {sections.map((section) => {
          const sectionItems = getSectionItems(section.key);
          const availableVideos = videos.filter((video) => {
            const isSelectedInCurrent = sectionItems.some((item) => item.id === video.id);
            const isSelectedElsewhere = allSelectedIds.has(video.id) && !isSelectedInCurrent;
            return !isSelectedElsewhere;
          });

          return (
            <article
              key={section.key}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-white">{section.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {section.description}
                  </p>
                </div>
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold text-cyan-100">
                  {sectionItems.length} / {HOME_SECTION_MAX_ITEMS}
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <select
                  value={picker[section.key]}
                  onChange={(event) =>
                    setPicker((current) => ({
                      ...current,
                      [section.key]: event.target.value,
                    }))
                  }
                  className="h-12 flex-1 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none"
                >
                  <option value="">选择一个已发布视频加入区块</option>
                  {availableVideos.map((video) => (
                    <option key={video.id} value={video.id}>
                      {video.title} · {formatVideoStatus(video.status)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleAdd(section.key)}
                  className="h-12 rounded-full border border-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/8"
                >
                  添加视频
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {sectionItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-300">
                    这个区块还没有配置视频。
                  </div>
                ) : (
                  sectionItems.map((video, index) => (
                    <div
                      key={video.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {index + 1}. {video.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">{video.slug}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleMove(section.key, video.id, "up")}
                          disabled={index === 0}
                          className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          上移
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(section.key, video.id, "down")}
                          disabled={index === sectionItems.length - 1}
                          className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          下移
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(section.key, video.id)}
                          className="rounded-full border border-rose-400/25 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/10"
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">自动区块规则</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          “最新更新”会自动按发布时间倒序展示 8 个视频，“猜你喜欢”会在每次刷新时随机展示 8 个视频。
          自动区块会尽量避开手工区块里已经出现的内容，但当片库内容较少时会自动补位，避免首页出现空区块。
        </p>
      </section>
    </div>
  );
}
