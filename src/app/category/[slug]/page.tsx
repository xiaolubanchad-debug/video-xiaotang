import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/site/site-shell";
import { VideoCard } from "@/components/site/video-card";
import { getViewerSession } from "@/lib/auth";
import {
  getCategoryPageData,
  getSiteNavigationCategories,
} from "@/lib/site-videos";

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    region?: string;
    year?: string;
  }>;
};

function buildFilterHref(
  slug: string,
  region?: string | null,
  year?: number | null,
) {
  const query = new URLSearchParams();

  if (region) {
    query.set("region", region);
  }

  if (year) {
    query.set("year", String(year));
  }

  const queryString = query.toString();

  return queryString ? `/category/${slug}?${queryString}` : `/category/${slug}`;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const [session, categories, category] = await Promise.all([
    getViewerSession(),
    getSiteNavigationCategories(),
    getCategoryPageData(resolvedParams.slug),
  ]);

  if (!category) {
    notFound();
  }

  const selectedRegion = resolvedSearchParams.region?.trim() || null;
  const selectedYear = resolvedSearchParams.year
    ? Number.parseInt(resolvedSearchParams.year, 10)
    : null;

  const regionOptions = Array.from(
    new Set(category.videos.map((video) => video.region).filter(Boolean)),
  );
  const yearOptions = Array.from(
    new Set(category.videos.map((video) => video.year).filter(Boolean)),
  ).sort((left, right) => Number(right) - Number(left));

  const filteredVideos = category.videos.filter((video) => {
    const matchesRegion = selectedRegion ? video.region === selectedRegion : true;
    const matchesYear = selectedYear ? video.year === selectedYear : true;

    return matchesRegion && matchesYear;
  });

  return (
    <SiteShell categories={categories} activeNav="category" viewer={session?.user}>
      <div className="space-y-8">
        <section className="space-y-6 rounded-[30px] border border-white/6 bg-[#151515] px-6 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.24)] sm:px-8">
          <div>
            <p className="text-xs tracking-[0.35em] text-[#8f8d97]">分类频道</p>
            <h1 className="mt-4 font-serif text-5xl text-white sm:text-6xl">{category.name}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#b6b4bc]">
              {category.description ?? `浏览当前片库中已发布的 ${category.name} 内容，按地区和年份快速筛选。`}
            </p>
          </div>

          <div className="space-y-5 border-t border-white/6 pt-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
              <p className="w-14 pt-2 text-xs font-semibold tracking-[0.35em] text-[#6f6d77]">
                分类
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => {
                  const isActive = item.slug === category.slug;

                  return (
                    <Link
                      key={item.id}
                      href={buildFilterHref(item.slug, null, null)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        isActive
                          ? "bg-[#b8c4ff] font-semibold text-[#132977]"
                          : "bg-[#1f1f1f] text-[#d3d1d8] hover:bg-[#282828]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
              <p className="w-14 pt-2 text-xs font-semibold tracking-[0.35em] text-[#6f6d77]">
                地区
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={buildFilterHref(category.slug, null, selectedYear)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    !selectedRegion
                      ? "bg-[#b8c4ff] font-semibold text-[#132977]"
                      : "bg-[#1f1f1f] text-[#d3d1d8] hover:bg-[#282828]"
                  }`}
                >
                  全部
                </Link>
                {regionOptions.map((region) => (
                  <Link
                    key={region}
                    href={buildFilterHref(category.slug, region, selectedYear)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      selectedRegion === region
                        ? "bg-[#b8c4ff] font-semibold text-[#132977]"
                        : "bg-[#1f1f1f] text-[#d3d1d8] hover:bg-[#282828]"
                    }`}
                  >
                    {region}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
              <p className="w-14 pt-2 text-xs font-semibold tracking-[0.35em] text-[#6f6d77]">
                年份
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={buildFilterHref(category.slug, selectedRegion, null)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    !selectedYear
                      ? "bg-[#b8c4ff] font-semibold text-[#132977]"
                      : "bg-[#1f1f1f] text-[#d3d1d8] hover:bg-[#282828]"
                  }`}
                >
                  全部
                </Link>
                {yearOptions.map((year) => (
                  <Link
                    key={year}
                    href={buildFilterHref(category.slug, selectedRegion, year)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      selectedYear === year
                        ? "bg-[#b8c4ff] font-semibold text-[#132977]"
                        : "bg-[#1f1f1f] text-[#d3d1d8] hover:bg-[#282828]"
                    }`}
                  >
                    {year}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/6 pt-6 text-sm text-[#8f8d97]">
            <div className="flex items-center gap-4">
              <span>
                排序: <span className="font-semibold text-[#b8c4ff]">最新发布</span>
              </span>
              <span>
                视图: <span className="font-semibold text-white">16:9 内容卡片</span>
              </span>
            </div>
            <p>
              共找到 <span className="font-semibold text-[#b8c4ff]">{filteredVideos.length}</span> 部影片
            </p>
          </div>
        </section>

        {filteredVideos.length === 0 ? (
          <section className="rounded-[30px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center">
            <p className="text-xs tracking-[0.35em] text-[#b8c4ff]/70">暂无匹配结果</p>
            <h2 className="mt-4 font-serif text-4xl text-white">当前筛选条件下没有内容</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#b7b5be]">
              这个分类已经建立，但当前地区或年份筛选下还没有已发布的视频。
            </p>
          </section>
        ) : (
          <section className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </section>
        )}
      </div>
    </SiteShell>
  );
}
