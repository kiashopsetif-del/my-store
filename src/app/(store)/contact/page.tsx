import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();

  const cards = [
    { icon: "✆", title: "الهاتف", value: settings.phone, href: settings.phone ? `tel:${settings.phone}` : null },
    { icon: "✉", title: "البريد", value: settings.email, href: settings.email ? `mailto:${settings.email}` : null },
    { icon: "⚲", title: "العنوان", value: settings.address, href: null },
    { icon: "💬", title: "واتساب", value: "تواصل مباشر", href: settings.whatsapp || null },
  ];

  return (
    <div>
      <div className="border-b border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">تواصل معنا</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">نحن هنا لمساعدتك</h1>
          <p className="mt-4 text-zinc-400">
            فريق خدمة العملاء جاهز للإجابة على استفساراتك في أي وقت
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <a
              key={c.title}
              href={c.href ?? "#"}
              className="group rounded-3xl border border-white/10 bg-white/[0.02] p-7 text-center transition hover:border-[var(--accent)]/40"
            >
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent)]/10 text-2xl text-[var(--accent)]">
                {c.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-white">{c.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{c.value}</p>
            </a>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold text-white">هل لديك سؤال؟</h2>
          <p className="mt-2 text-zinc-400">راسلنا مباشرة عبر واتساب وسنرد عليك فوراً</p>
          {settings.whatsapp && (
            <a
              href={settings.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-2xl bg-[var(--accent)] px-8 py-3.5 text-sm font-bold text-black transition hover:opacity-90"
            >
              💬 محادثة واتساب
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
