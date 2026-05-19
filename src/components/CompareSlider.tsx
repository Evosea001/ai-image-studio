"use client";

import { useState, useRef } from "react";

interface Props {
  originalUrl: string;
  resultUrl: string;
}

export default function CompareSlider({ originalUrl, resultUrl }: Props) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, x)));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square rounded-2xl overflow-hidden select-none cursor-ew-resize bg-zinc-200"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* 结果图（底层） */}
      <img
        src={resultUrl}
        alt="生成结果"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 原图（左侧裁剪） */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={originalUrl}
          alt="原始图片"
          className="absolute inset-0 h-full object-cover"
          style={{ width: `${100 / (position / 100)}%` }}
        />
      </div>

      {/* 分割线 */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-xs">
          ◀▶
        </div>
      </div>

      {/* 标签 */}
      <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
        原图
      </span>
      <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
        生成图
      </span>
    </div>
  );
}
