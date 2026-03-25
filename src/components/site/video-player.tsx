"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  format?: string | null;
  poster?: string | null;
  title: string;
  videoId?: string;
  shouldTrackHistory?: boolean;
};

export function VideoPlayer({
  src,
  format,
  poster,
  title,
  videoId,
  shouldTrackHistory = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTrackedRef = useRef(0);
  const sourceKey = `${src}:${format ?? "unknown"}`;
  const unsupportedHls =
    format === "m3u8" &&
    typeof window !== "undefined" &&
    !document
      .createElement("video")
      .canPlayType("application/vnd.apple.mpegurl") &&
    !Hls.isSupported();
  const [errorState, setErrorState] = useState<{
    key: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    lastTrackedRef.current = 0;
  }, [sourceKey]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (format === "m3u8") {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;

        return () => {
          video.pause();
          video.removeAttribute("src");
          video.load();
        };
      }

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            setErrorState({
              key: sourceKey,
              message: "当前视频流暂时无法加载，请稍后再试。",
            });
          }
        });

        return () => {
          hls.destroy();
        };
      }

      return;
    }

    video.src = src;

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [format, sourceKey, src]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !videoId || !shouldTrackHistory) {
      return;
    }

    const trackedVideo = video;

    let destroyed = false;

    async function reportProgress(progressSeconds: number, force = false) {
      const normalized = Math.floor(progressSeconds);

      if (normalized <= 0) {
        return;
      }

      if (normalized < lastTrackedRef.current) {
        return;
      }

      if (!force && normalized - lastTrackedRef.current < 15) {
        return;
      }

      lastTrackedRef.current = normalized;

      try {
        await fetch(`/api/videos/${videoId}/history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            progressSeconds: normalized,
          }),
          keepalive: true,
        });
      } catch {
        if (!destroyed) {
          // Swallow history errors so playback UX stays uninterrupted.
        }
      }
    }

    function handleTimeUpdate() {
      void reportProgress(trackedVideo.currentTime);
    }

    function handlePause() {
      void reportProgress(trackedVideo.currentTime, true);
    }

    function handleEnded() {
      void reportProgress(trackedVideo.duration || trackedVideo.currentTime, true);
    }

    trackedVideo.addEventListener("timeupdate", handleTimeUpdate);
    trackedVideo.addEventListener("pause", handlePause);
    trackedVideo.addEventListener("ended", handleEnded);

    return () => {
      destroyed = true;
      trackedVideo.removeEventListener("timeupdate", handleTimeUpdate);
      trackedVideo.removeEventListener("pause", handlePause);
      trackedVideo.removeEventListener("ended", handleEnded);
    };
  }, [shouldTrackHistory, videoId]);

  const error = unsupportedHls
    ? "当前浏览器暂不支持此 HLS 播放流。"
    : errorState?.key === sourceKey
      ? errorState.message
      : null;

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[#111111] shadow-[0_24px_90px_rgba(0,0,0,0.32)]">
      <video
        ref={videoRef}
        controls
        playsInline
        poster={poster ?? undefined}
        className="aspect-video w-full bg-black"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 bg-[#171717] px-5 py-4 text-sm text-[#c2c0c9]">
        <span className="font-medium text-white">{title}</span>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/8 px-4 py-2 text-xs font-semibold transition hover:border-[#b8c4ff]/30 hover:bg-[#b8c4ff]/10 hover:text-[#dde1ff]"
        >
          打开源地址
        </a>
      </div>

      {error ? (
        <div className="border-t border-[#ffb4aa]/16 bg-[#ffb4aa]/10 px-5 py-4 text-sm text-[#ffd9d2]">
          {error}
        </div>
      ) : null}
    </div>
  );
}
