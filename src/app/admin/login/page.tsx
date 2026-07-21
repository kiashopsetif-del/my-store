import Link from "next/link";
import { loginAction } from "@/app/actions";
import { getSettings } from "@/lib/data";
import { inputClass, btnPrimary, Notice } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const settings = await getSettings();

  return (
    <div className="grid min-h-screen place-items-center bg-[#070708] px-4">
      {/* وهج خلفي */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(600px circle at 50% 20%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 60%)",
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 font-display text-xl font-bold text-[var(--accent)]">
              {settings.logoText}
            </span>
            <span className="font-display text-2xl font-bold text-white">
              {settings.storeName}
            </span>
          </Link>
          <p className="mt-4 text-sm text-zinc-500">لوحة تحكم المتجر — تسجيل الدخول</p>
        </div>

        <form
          action={loginAction}
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 backdrop-blur"
        >
          {sp.error && (
            <div className="mb-4">
              <Notice kind="error">كلمة المرور غير صحيحة. حاول مرة أخرى.</Notice>
            </div>
          )}
          <label className="mb-1.5 block text-sm text-zinc-400">كلمة المرور</label>
          <input
            name="password"
            type="password"
            autoFocus
            placeholder="••••••••"
            className={inputClass}
          />
          <button type="submit" className={`${btnPrimary} mt-5 w-full py-3`}>
            دخول إلى لوحة التحكم
          </button>
          <p className="mt-4 text-center text-xs text-zinc-600">
            كلمة المرور الافتراضية: <span className="text-zinc-400">admin123</span> — يمكنك تغييرها من الإعدادات.
          </p>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-zinc-500 hover:text-[var(--accent)]"
        >
          ← العودة إلى المتجر
        </Link>
      </div>
    </div>
  );
}
