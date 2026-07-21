"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/app/actions";

const links = [
  { href: "/admin", label: "نظرة عامة", icon: "▦" },
  { href: "/admin/products", label: "المنتجات", icon: "▣" },
  { href: "/admin/categories", label: "الأقسام", icon: "◈" },
  { href: "/admin/features", label: "المميزات", icon: "✦" },
  { href: "/admin/orders", label: "الطلبات", icon: "✉" },
  { href: "/admin/settings", label: "إعدادات المتجر", icon: "⚙" },
];

export default function Sidebar({ storeName }: { storeName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const nav = (
    <nav className="flex flex-col gap-1">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
            isActive(l.href)
              ? "bg-[var(--accent)]/15 font-semibold text-[var(--accent)]"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="text-base">{l.icon}</span>
          {l.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* شريط علوي للجوال */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0a0a0b]/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/admin" className="font-display text-lg font-bold text-white">
          {storeName} <span className="text-[var(--accent)]">·</span> لوحة التحكم
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
      </div>

      {/* درج الجوال */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-72 overflow-y-auto border-l border-white/10 bg-[#0a0a0b] p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg font-bold text-white">{storeName}</span>
              <button onClick={() => setOpen(false)} className="text-zinc-400">
                <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            {nav}
            <div className="mt-6 border-t border-white/10 pt-4">
              <Link href="/" className="block rounded-xl px-4 py-3 text-sm text-zinc-400 hover:text-white">← عرض المتجر</Link>
              <form action={logoutAction}>
                <button className="block w-full rounded-xl px-4 py-3 text-right text-sm text-red-300 hover:bg-red-500/10">
                  تسجيل الخروج
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}

      {/* الشريط الجانبي لسطح المكتب */}
      <aside className="fixed right-0 top-0 z-30 hidden h-full w-72 flex-col border-l border-white/10 bg-[#0a0a0b] p-5 lg:flex">
        <Link href="/admin" className="mb-8 block">
          <span className="font-display text-2xl font-bold text-white">{storeName}</span>
          <span className="block text-xs text-zinc-500">لوحة التحكم</span>
        </Link>
        {nav}
        <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
          <Link href="/" className="block rounded-xl px-4 py-3 text-sm text-zinc-400 hover:bg-white/5 hover:text-white">
            ← عرض المتجر
          </Link>
          <form action={logoutAction}>
            <button className="block w-full rounded-xl px-4 py-3 text-right text-sm text-red-300 transition hover:bg-red-500/10">
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
