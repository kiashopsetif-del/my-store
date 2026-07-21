import Link from "next/link";
import type { Settings, Category } from "@/db/schema";

function Social({ href, children }: { href: string | null; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-zinc-300 transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
    >
      {children}
    </a>
  );
}

export default function Footer({
  settings,
  categories,
}: {
  settings: Settings;
  categories: Category[];
}) {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#080809]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        {/* العلامة */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            {settings.logoImage ? (
              <img
                src={settings.logoImage}
                alt={settings.storeName}
                className="h-11 w-auto rounded-lg object-contain"
              />
            ) : (
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 font-display text-lg font-bold text-[var(--accent)]">
                {settings.logoText}
              </span>
            )}
            <span className="font-display text-2xl font-bold text-white">
              {settings.storeName}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
            {settings.footerText}
          </p>
          <div className="mt-5 flex gap-2">
            <Social href={settings.instagram}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.43.43.69.83.9 1.4.18.46.37 1.05.43 2.26.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.43 2.2-.21.6-.47 1-.9 1.4-.42.43-.82.69-1.4.9-.45.18-1.04.37-2.25.43-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.43-.6-.21-1-.47-1.4-.9-.43-.42-.69-.82-.9-1.4-.18-.45-.37-1.04-.43-2.25C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.43-2.2.21-.6.47-1 .9-1.4.42-.43.82-.69 1.4-.9.45-.18 1.04-.37 2.25-.43C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.07-.9.04-1.4.2-1.7.32-.43.17-.74.37-1.06.7-.32.31-.52.62-.7 1.05-.12.3-.27.8-.31 1.7C3.3 9 3.3 9.4 3.3 12s0 3 .08 4.16c.04.9.2 1.4.32 1.7.17.43.37.74.7 1.06.31.32.62.52 1.05.7.3.12.8.27 1.7.31 1.16.07 1.56.08 4.66.08s3.5 0 4.66-.08c.9-.04 1.4-.2 1.7-.32.43-.17.74-.37 1.06-.7.32-.31.52-.62.7-1.05.12-.3.27-.8.31-1.7.07-1.16.08-1.56.08-4.16s0-3-.08-4.16c-.04-.9-.2-1.4-.32-1.7a2.9 2.9 0 0 0-.7-1.06 2.9 2.9 0 0 0-1.05-.7c-.3-.12-.8-.27-1.7-.31C15.5 4 15.1 4 12 4zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 1.8a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2zm5.1-.3a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z" /></svg>
            </Social>
            <Social href={settings.twitter}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M18.9 2H22l-7.3 8.3L23 22h-6.8l-5-6.6L5.3 22H2l7.8-8.9L1.5 2h7l4.5 6 5-6zm-2.4 18h1.9L7.6 4H5.6l10.9 16z" /></svg>
            </Social>
            <Social href={settings.facebook}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" /></svg>
            </Social>
            <Social href={settings.whatsapp}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 0 1 6.9 12.6l-.2.3.8 2.8-2.9-.8-.3.2A8.2 8.2 0 1 1 12 3.8zm-3 4c-.2 0-.5 0-.7.3-.3.3-1 .9-1 2.3s1 2.7 1.2 2.9c.2.2 2 3.1 4.9 4.2 2.4 1 2.9.8 3.4.7.5 0 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.4l-2-1c-.3-.1-.5-.1-.7.2l-.7.9c-.1.2-.3.2-.5.1-.7-.3-1.5-.7-2.3-1.6-.6-.6-1-1.3-1.2-1.6-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.4-.5-.6-.5z" /></svg>
            </Social>
          </div>
        </div>

        {/* روابط سريعة */}
        <div>
          <h4 className="mb-4 text-sm font-bold text-white">روابط سريعة</h4>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            <li><Link href="/" className="hover:text-[var(--accent)]">الرئيسية</Link></li>
            <li><Link href="/products" className="hover:text-[var(--accent)]">كل المنتجات</Link></li>
            <li><Link href="/about" className="hover:text-[var(--accent)]">من نحن</Link></li>
            <li><Link href="/contact" className="hover:text-[var(--accent)]">تواصل معنا</Link></li>
          </ul>
        </div>

        {/* الأقسام */}
        <div>
          <h4 className="mb-4 text-sm font-bold text-white">الأقسام</h4>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="hover:text-[var(--accent)]">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* تواصل */}
        <div>
          <h4 className="mb-4 text-sm font-bold text-white">تواصل معنا</h4>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)]">✆</span> {settings.phone}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)]">✉</span> {settings.email}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)]">⚲</span> {settings.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-zinc-500 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {settings.storeName}. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <span>صُمّم بعناية ✦</span>
            <Link href="/admin" className="rounded-md border border-white/10 px-2.5 py-1 text-zinc-400 transition hover:text-[var(--accent)]">
              لوحة التحكم
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
