"use client";

const STYLES = [
  { id: "comic", label: "日系漫画", emoji: "🎌", color: "bg-pink-50 border-pink-200" },
  { id: "3d", label: "3D 渲染", emoji: "💎", color: "bg-blue-50 border-blue-200" },
  { id: "oil", label: "古典油画", emoji: "🎨", color: "bg-amber-50 border-amber-200" },
  { id: "sketch", label: "精细素描", emoji: "✏️", color: "bg-gray-50 border-gray-200" },
  { id: "cyberpunk", label: "赛博朋克", emoji: "🌆", color: "bg-purple-50 border-purple-200" },
  { id: "watercolor", label: "水彩画", emoji: "🖌️", color: "bg-teal-50 border-teal-200" },
];

interface Props {
  selected: string;
  onSelect: (style: string) => void;
}

export default function StyleSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelect(style.id)}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
            ${style.color}
            ${selected === style.id ? "ring-2 ring-zinc-900 scale-[1.02]" : "hover:scale-[1.01]"}
          `}
        >
          <span className="text-2xl">{style.emoji}</span>
          <span className="text-sm font-medium text-zinc-700">{style.label}</span>
        </button>
      ))}
    </div>
  );
}
