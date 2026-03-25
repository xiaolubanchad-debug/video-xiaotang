import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#131313] px-6 text-white">
      <div className="max-w-2xl rounded-[34px] border border-white/8 bg-[#171717] p-10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
        <p className="text-xs tracking-[0.4em] text-[#b8c4ff]/70">内容不存在</p>
        <h1 className="mt-4 font-serif text-5xl text-white">你访问的影片暂时不存在</h1>
        <p className="mt-4 text-base leading-8 text-[#c5c3cc]">
          当前请求的影片或分类不在已发布片库中，可能尚未同步，或者已经被移除。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-[#b8c4ff] px-6 py-3 text-sm font-semibold text-[#0b1020] shadow-[inset_0_1px_0_rgba(255,255,255,0.34)] transition hover:bg-[#cad2ff]"
          >
            返回首页
          </Link>
          <Link
            href="/search"
            className="rounded-xl border border-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            打开搜索
          </Link>
        </div>
      </div>
    </main>
  );
}
