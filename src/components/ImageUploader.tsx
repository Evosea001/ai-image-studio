"use client";

import { useState, useRef, useCallback } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";

interface Props {
  onImageReady: (base64: string) => void;
}

export default function ImageUploader({ onImageReady }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageReady(base64);
      };
      reader.readAsDataURL(file);
    },
    [onImageReady]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const clear = () => {
    setPreview(null);
    onImageReady("");
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors
            ${dragging ? "border-blue-400 bg-blue-50" : "border-zinc-300 hover:border-zinc-400"}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <FiUploadCloud className="mx-auto text-3xl text-zinc-400 mb-3" />
          <p className="text-zinc-600 font-medium">点击上传或拖拽图片到这里</p>
          <p className="text-zinc-400 text-sm mt-1">支持 JPG、PNG、WebP，最大 30MB</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden bg-zinc-100">
          <img
            src={preview}
            alt="上传预览"
            className="w-full max-h-96 object-contain"
          />
          <button
            onClick={(e) => { e.stopPropagation(); clear(); }}
            className="absolute top-3 right-3 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
          >
            <FiX />
          </button>
        </div>
      )}
    </div>
  );
}
