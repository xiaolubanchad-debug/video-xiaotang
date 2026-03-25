"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#131313] px-6 text-white">
      <div className="max-w-2xl rounded-[34px] border border-[#ffb4aa]/16 bg-[#171717] p-10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
        <p className="text-xs tracking-[0.4em] text-[#ffb4aa]">页面异常</p>
        <h1 className="mt-4 font-serif text-5xl text-white">当前页面加载失败</h1>
        <p className="mt-4 text-base leading-8 text-[#c5c3cc]">
          {error.message || "页面在加载过程中出现异常，请稍后重试。"}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-xl bg-[#b8c4ff] px-6 py-3 text-sm font-semibold text-[#132977] transition hover:brightness-110"
        >
          重新加载
        </button>
      </div>
    </main>
  );
}
