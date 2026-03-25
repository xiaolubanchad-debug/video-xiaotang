import Link from "next/link";

import { type SiteVideoCard } from "@/lib/site-videos";
import {
  formatCompactDuration,
  formatVideoFormatLabel,
  formatVideoTypeLabel,
} from "@/lib/site-format";

type Props = {
  video: SiteVideoCard;
};

export function VideoCard({ video }: Props) {
  const duration = formatCompactDuration(video.durationSeconds);
  const cover = video.coverUrl ?? video.posterUrl;
  const formatLabel = formatVideoFormatLabel(video.sources[0]?.format);
  const typeLabel = formatVideoTypeLabel(video.type);
  const tagLabel = video.tags[0]?.tag.name;

  return (
    <Link
      href={`/videos/${video.slug}`}
      className="group flex h-full flex-col gap-4 transition duration-300 hover:-translate-y-1"
    >
      <div
        className="relative aspect-video w-full overflow-hidden rounded-[22px] border border-white/8 bg-[linear-gradient(145deg,#202020,#0f0f0f)] ring-1 ring-transparent transition duration-300 group-hover:border-[#b8c4ff]/30 group-hover:ring-[#b8c4ff]/18"
        style={
          cover
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(4, 7, 11, 0.04), rgba(4, 7, 11, 0.6)), url(${cover})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent opacity-80" />
        <div className="absolute inset-0 flex items-end justify-between p-3">
          <div className="rounded-full bg-black/42 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
            {typeLabel}
          </div>
          {duration ? (
            <div className="rounded-full bg-[#25315f]/70 px-3 py-1 text-[11px] font-medium text-[#dde1ff] backdrop-blur-md">
              {duration}
            </div>
          ) : null}
        </div>

        {formatLabel ? (
          <div className="absolute right-3 top-3 rounded-full border border-[#b8c4ff]/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#b8c4ff] backdrop-blur-md">
            {formatLabel}
          </div>
        ) : null}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#b8c4ff] text-base font-bold text-[#132977] shadow-[0_16px_50px_rgba(184,196,255,0.3)]">
            播放
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="line-clamp-1 text-base font-semibold text-white transition group-hover:text-[#b8c4ff]">
          {video.title}
        </h3>
        <p className="text-sm text-[#8d8b95]">
          {[video.year, video.category?.name, tagLabel].filter(Boolean).join(" · ") || "最新入库"}
        </p>
      </div>
    </Link>
  );
}
