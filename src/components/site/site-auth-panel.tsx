"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

type Mode = "login" | "register";

export function SiteAuthPanel() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (mode === "register") {
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          nickname,
        }),
      });

      const registerResult = (await registerResponse.json()) as {
        ok: boolean;
        error?: string;
      };

      if (!registerResponse.ok || !registerResult.ok) {
        setError(registerResult.error ?? "注册失败，请稍后再试。");
        setIsSubmitting(false);
        return;
      }
    }

    const result = await signIn("user-credentials", {
      email,
      password,
      callbackUrl: "/",
      redirect: false,
    });

    if (result?.error) {
      setError(
        mode === "register"
          ? "注册成功，但自动登录失败，请直接登录。"
          : "登录失败，请检查邮箱和密码。",
      );
      setIsSubmitting(false);
      return;
    }

    setSuccess(mode === "register" ? "注册成功，正在进入站点..." : "登录成功，正在返回首页...");
    window.location.href = result?.url ?? "/";
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.06] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="flex gap-2 rounded-full border border-white/8 bg-[#171717] p-1">
        {[
          { key: "login" as const, label: "用户登录" },
          { key: "register" as const, label: "注册账号" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setMode(tab.key);
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
              mode === tab.key
                ? "bg-[#b8c4ff] text-[#132977]"
                : "text-slate-300 hover:bg-white/[0.05]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <h2 className="font-[family-name:var(--font-cormorant)] text-4xl text-white">
          {mode === "login" ? "登录后可继续互动" : "先注册，再参与讨论"}
        </h2>
        <p className="text-sm leading-7 text-slate-300">
          评论提交后会进入后台审核，审核通过后才会展示在前台详情页。收藏和最近观看会直接同步到你的个人中心。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {mode === "register" ? (
          <label className="block space-y-2">
            <span className="text-sm text-slate-300">昵称</span>
            <input
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
              placeholder="给自己起一个昵称"
            />
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm text-slate-300">邮箱</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-slate-300">密码</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
            placeholder="至少 8 位密码"
            required
          />
        </label>

        {error ? (
          <p className="rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? mode === "login"
              ? "登录中..."
              : "注册中..."
            : mode === "login"
              ? "登录并继续"
              : "注册并登录"}
        </button>
      </form>

      <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.03] p-5 text-sm leading-7 text-slate-300">
        <p>使用说明：</p>
        <p>1. 评论提交后默认进入待审核状态。</p>
        <p>2. 管理员审核通过后，评论才会展示在前台详情页。</p>
        <p>
          3. 如果你是管理员，也可以直接从{" "}
          <Link href="/admin/login" className="text-cyan-200 hover:text-cyan-100">
            后台登录页
          </Link>
          进入 CMS。
        </p>
      </div>
    </div>
  );
}
