import Link from "next/link";

const items = [
  { href: "/me", label: "总览" },
  { href: "/me/favorites", label: "我的收藏" },
  { href: "/me/comments", label: "我的评论" },
];

export function MeNav({ activeHref }: { activeHref: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = item.href === activeHref;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-[#b8c4ff] text-[#132977]"
                : "border border-white/8 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
