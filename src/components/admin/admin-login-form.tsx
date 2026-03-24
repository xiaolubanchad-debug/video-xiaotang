"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/admin",
      redirect: false,
    });

    if (result?.error) {
      setError("Sign-in failed. Check the super-admin email and password.");
      setIsSubmitting(false);
      return;
    }

    window.location.href = result?.url ?? "/admin";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] border border-white/10 bg-white/[0.06] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur"
    >
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">
        Super Admin Sign In
      </p>
      <div className="mt-8 space-y-5">
        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
            placeholder="super-admin@example.com"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
            placeholder="Enter the admin password"
            required
          />
        </label>
      </div>

      {error ? (
        <p className="mt-5 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Signing in..." : "Enter admin"}
      </button>
    </form>
  );
}
