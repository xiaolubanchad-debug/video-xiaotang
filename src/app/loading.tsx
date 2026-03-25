export default function Loading() {
  return (
    <main className="min-h-screen bg-[#131313] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1600px] space-y-6 pt-20">
        <div className="h-16 animate-pulse rounded-full border border-white/6 bg-white/[0.04]" />
        <div className="min-h-[420px] animate-pulse rounded-[34px] border border-white/6 bg-white/[0.04]" />
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="min-h-[360px] animate-pulse rounded-[30px] border border-white/6 bg-white/[0.04]" />
          <div className="grid gap-4">
            <div className="h-40 animate-pulse rounded-[24px] border border-white/6 bg-white/[0.04]" />
            <div className="h-40 animate-pulse rounded-[24px] border border-white/6 bg-white/[0.04]" />
            <div className="h-40 animate-pulse rounded-[24px] border border-white/6 bg-white/[0.04]" />
          </div>
        </div>
      </div>
    </main>
  );
}
