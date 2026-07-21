"use client";

import Link from "next/link";
import { useState } from "react";
import type { Settings, Category } from "@/db/schema";
import { useCart } from "@/context/cart";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M3 4h2l2.4 12.5a2 2 0 0 0 2 1.5h7.7a2 2 0 0 0 2-1.6L21 8H6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20.5" r="1.4" fill="currentColor" />
      <circle cx="18" cy="20.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

export default function Navbar({
  settings,
  categories,
}: {
  settings: Settings;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/products", label: "كل المنتجات" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <header className="sticky top-0 z-40">
      {settings.announcementEnabled && settings.announcementText ? (
        <div className="bg-[var(--accent)] text-black">
          <div className="mx-auto max-w-7xl px-4 py-2 text-center text-[11px] font-semibold tracking-wide sm:text-xs">
            {settings.announcementText}
          </div>
        </div>
      ) : null}

      <div className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* الشعار */}
          <Link href="/" className="flex items-center gap-3">
            {settings.logoImage ? (
              <img
                src={settings.logoImage}
                alt={settings.storeName}
                className="h-10 w-auto rounded-lg object-contain"
              />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 font-display text-lg font-bold text-[var(--accent)]">
                {settings.logoText}
              </span>
            )}
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold tracking-wide text-white">
                {settings.storeName}
              </span>
              <span className="text-[10px] text-zinc-500">
                {settings.tagline}
              </span>
            </span>
          </Link>

          {/* روابط سطح المكتب */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-zinc-300 transition hover:text-[var(--accent)]"
              >
                {l.label}
              </Link>
            ))}
            {categories.length > 0 && (
              <div className="group relative">
                <button className="flex items-center gap-1 text-sm text-zinc-300 transition hover:text-[var(--accent)]">
                  الأقسام
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="invisible absolute right-0 top-full w-56 translate-y-2 pt-3 opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="glass overflow-hidden rounded-2xl p-2 shadow-2xl">
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/category/${c.slug}`}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-[var(--accent)]"
                      >
                        {c.image ? (
                          <img
                            src={c.image}
                            alt={c.name}
                            className="h-9 w-9 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-[var(--accent)]">
                            ✦
                          </span>
                        )}
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* الإجراءات */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
              aria-label="السلة"
            >
              <CartIcon />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-black">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white lg:hidden"
              aria-label="القائمة"
            >
              {open ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              )}
            </button>
          </div>
        </nav>

        {/* قائمة الجوال */}
        {open && (
          <div className="border-t border-white/10 bg-black/95 px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm text-zinc-200 transition hover:bg-white/5"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 px-4 text-[11px] uppercase tracking-wider text-zinc-500">
                الأقسام
              </div>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/5"
                >
                  {c.image && (
                    <img src={c.image} alt={c.name} className="h-8 w-8 rounded-lg object-cover" />
                  )}
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
