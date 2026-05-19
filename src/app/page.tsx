import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-20">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
          一张照片
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            百变风格
          </span>
        </h1>
        <p className="text-lg text-zinc-500 mb-8 max-w-md mx-auto">
          上传你的照片，选择漫画、油画、素描、赛博朋克等风格，AI 几秒钟给你一张全新作品
        </p>
        <Link
          href="/generate"
          className="inline-block bg-zinc-900 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-zinc-700 transition-colors"
        >
          开始创作
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-2xl">
        {[
          { emoji: "🎌", label: "日系漫画" },
          { emoji: "💎", label: "3D渲染" },
          { emoji: "🎨", label: "古典油画" },
          { emoji: "✏️", label: "精细素描" },
          { emoji: "🌆", label: "赛博朋克" },
          { emoji: "🖌️", label: "水彩画" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors"
          >
            <span className="text-2xl">{s.emoji}</span>
            <span className="text-xs text-zinc-500">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
