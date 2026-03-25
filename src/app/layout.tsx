import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_SC({
  variable: "--font-sans-sc",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const serif = Noto_Serif_SC({
  variable: "--font-serif-sc",
  preload: false,
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "CINEMAMIRROR",
    template: "%s | CINEMAMIRROR",
  },
  description:
    "小糖视频的前台站点，提供沉浸式电影与剧集浏览体验，内容由后台与 OpenClaw 采集接口统一驱动。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
