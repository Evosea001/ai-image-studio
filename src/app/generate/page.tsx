"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import StyleSelector from "@/components/StyleSelector";
import CompareSlider from "@/components/CompareSlider";
import toast from "react-hot-toast";

export default function GeneratePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [image, setImage] = useState("");
  const [style, setStyle] = useState("comic");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    resultUrl: string;
    style: string;
  } | null>(null);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">请先登录才能使用风格迁移功能</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-zinc-900 text-white px-6 py-2 rounded-xl hover:bg-zinc-700 transition-colors"
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!image) {
      toast.error("请先上传一张图片");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, style }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ resultUrl: data.resultUrl, style: data.style });
        toast.success("生成成功");
      } else {
        toast.error(data.error || "生成失败");
      }
    } catch {
      toast.error("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">风格迁移创作</h1>

      {/* 第一步：上传图片 */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-zinc-500 mb-3">1. 上传图片</h2>
        <ImageUploader onImageReady={setImage} />
      </section>

      {/* 第二步：选择风格 */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-zinc-500 mb-3">2. 选择风格</h2>
        <StyleSelector selected={style} onSelect={setStyle} />
      </section>

      {/* 生成按钮 */}
      <button
        onClick={handleGenerate}
        disabled={!image || loading}
        className="w-full py-3 rounded-xl bg-zinc-900 text-white font-medium text-lg hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all mb-8"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            AI 正在创作中...
          </span>
        ) : (
          "开始生成"
        )}
      </button>

      {/* 结果展示：前后对比 */}
      {result && image && (
        <section>
          <h2 className="text-sm font-medium text-zinc-500 mb-3">3. 前后对比</h2>
          <CompareSlider originalUrl={image} resultUrl={result.resultUrl} />

          <div className="flex gap-3 mt-4">
            <a
              href={result.resultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 rounded-xl border border-zinc-300 font-medium hover:bg-zinc-50 transition-colors"
            >
              查看原图
            </a>
            <button
              onClick={async () => {
                const res = await fetch(result.resultUrl);
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `ai-style-${style}.png`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex-1 text-center py-2.5 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-700 transition-colors"
            >
              下载图片
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
