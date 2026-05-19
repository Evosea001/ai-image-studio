import type { Metadata } from "next";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 风格迁移 | 一键将照片变成艺术品",
  description: "上传照片，选择风格，AI 自动生成漫画、油画、素描、赛博朋克等多种风格",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white text-zinc-900 antialiased flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
