"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ImageCard from "@/components/ImageCard";
import toast from "react-hot-toast";

interface ImageRecord {
  id: string;
  resultUrl: string;
  style: string;
  createdAt: string;
}

export default function GalleryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setImages(data);
      })
      .catch(() => toast.error("加载作品失败"))
      .finally(() => setLoading(false));
  }, [session]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/images/${id}`, { method: "DELETE" });
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== id));
      toast.success("已删除");
    } else {
      toast.error("删除失败");
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">请先登录才能查看作品画廊</p>
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">我的作品画廊</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-400 text-lg mb-4">还没有作品</p>
          <button
            onClick={() => router.push("/generate")}
            className="bg-zinc-900 text-white px-6 py-2 rounded-xl hover:bg-zinc-700 transition-colors"
          >
            去生成第一张
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <ImageCard
              key={img.id}
              id={img.id}
              resultUrl={img.resultUrl}
              style={img.style}
              createdAt={new Date(img.createdAt).toLocaleDateString("zh-CN")}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
