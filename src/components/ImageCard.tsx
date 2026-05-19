"use client";

import { FiTrash2, FiDownload } from "react-icons/fi";

interface Props {
  id: string;
  resultUrl: string;
  style: string;
  createdAt: string;
  onDelete: (id: string) => void;
}

const STYLE_LABELS: Record<string, string> = {
  comic: "日系漫画",
  "3d": "3D 渲染",
  oil: "古典油画",
  sketch: "精细素描",
  cyberpunk: "赛博朋克",
  watercolor: "水彩画",
};

export default function ImageCard({ id, resultUrl, style, createdAt, onDelete }: Props) {
  const handleDownload = async () => {
    const res = await fetch(resultUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-style-${style}-${id}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-zinc-100 shadow-sm hover:shadow-md transition-shadow">
      <img
        src={resultUrl}
        alt={STYLE_LABELS[style] || style}
        className="w-full aspect-square object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
        <div>
          <p className="text-white text-sm font-medium">{STYLE_LABELS[style] || style}</p>
          <p className="text-white/70 text-xs">{createdAt}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="bg-white/90 p-2 rounded-lg hover:bg-white transition-colors"
          >
            <FiDownload className="text-zinc-700" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="bg-white/90 p-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <FiTrash2 className="text-red-500" />
          </button>
        </div>
      </div>
      {/* 移动端常显标签 */}
      <div className="sm:hidden absolute bottom-0 left-0 right-0 bg-black/50 p-2">
        <p className="text-white text-xs font-medium">{STYLE_LABELS[style] || style}</p>
      </div>
    </div>
  );
}
