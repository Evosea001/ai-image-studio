"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-zinc-900">
          AI 风格迁移
        </Link>

        {/* 桌面端菜单 */}
        <div className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/generate" className="text-zinc-600 hover:text-zinc-900 transition-colors">
            开始创作
          </Link>
          <Link href="/gallery" className="text-zinc-600 hover:text-zinc-900 transition-colors">
            作品画廊
          </Link>
          {session?.user ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-zinc-500 hover:text-red-500 transition-colors"
            >
              退出
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-zinc-900 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
            >
              登录
            </Link>
          )}
        </div>

        {/* 移动端汉堡菜单 */}
        <button
          className="sm:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="菜单"
        >
          <div className="w-5 h-0.5 bg-zinc-600 mb-1" />
          <div className="w-5 h-0.5 bg-zinc-600 mb-1" />
          <div className="w-5 h-0.5 bg-zinc-600" />
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-zinc-200 bg-white px-4 py-3 flex flex-col gap-3 text-sm">
          <Link href="/generate" className="text-zinc-600" onClick={() => setMenuOpen(false)}>
            开始创作
          </Link>
          <Link href="/gallery" className="text-zinc-600" onClick={() => setMenuOpen(false)}>
            作品画廊
          </Link>
          {session?.user ? (
            <button
              onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
              className="text-left text-red-500"
            >
              退出
            </button>
          ) : (
            <Link href="/login" className="text-zinc-900 font-medium" onClick={() => setMenuOpen(false)}>
              登录
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
