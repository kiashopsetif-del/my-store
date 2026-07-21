import { getSettings, getFeatures } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [settings, features] = await Promise.all([getSettings(), getFeatures(true)]);

  const stats = [
    { value: "+50K", label: "عميل سعيد" },
    { value: "+1200", label: "منتج فاخر" },
    { value: "15", label: "سنة خبرة" },
    { value: "4.9★", label: "تقييم العملاء" },
  ];

  return (
    <div>
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          {settings.aboutImage && (
            <img src={settings.aboutImage} alt="" className="h-full w-full object-cover opacity-30" />
          )}
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">من نحن</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            {settings.aboutTitle}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-300">{settings.aboutContent}</p>
        </div>
      </div>

      {/* إحصائيات */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center">
              <div className="font-display text-4xl font-bold text-[var(--accent)]">{s.value}</div>
              <div className="mt-2 text-sm text-zinc-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* قيم */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10">
            {settings.aboutImage ? (
              <img src={settings.aboutImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center bg-white/5 text-6xl">✦</div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-display text-3xl font-bold text-white">فلسفتنا</h2>
            <p className="mt-4 leading-relaxed text-zinc-300">
              نؤمن بأن الفخامة الحقيقية تولد من التفاصيل الدقيقة. كل قطعة في متجرنا تمرّ بعملية
              اختيار صارمة لضمان أعلى معايير الجودة والأناقة، لنقدّم لك تجربة تسوّق استثنائية تليق
              بذوقك الرفيع.
            </p>
            <div className="mt-6 space-y-4">
              {features.map((f) => (
                <div key={f.id} className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                    {f.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{f.title}</h3>
                    {f.description && <p className="text-sm text-zinc-400">{f.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
