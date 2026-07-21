import { getSettings } from "@/lib/data";
import { saveSettings, changeAdminPassword } from "@/app/actions";
import {
  PageHeader,
  Card,
  TextField,
  TextArea,
  Toggle,
  Notice,
  btnPrimary,
} from "@/components/admin/ui";
import ImageUploader from "@/components/admin/image-uploader";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const sp = await searchParams;
  const s = await getSettings();

  return (
    <div>
      <PageHeader
        title="إعدادات المتجر"
        desc="تحكّم كامل في كل أقسام متجرك من مكان واحد"
      />

      {sp.saved && (
        <div className="mb-5">
          <Notice kind="success">تم حفظ الإعدادات بنجاح ✦</Notice>
        </div>
      )}

      <form action={saveSettings} className="space-y-6">
        {/* الهوية */}
        <Card title="① الهوية والعلامة" desc="اسم المتجر والشعار والعملة">
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField label="اسم المتجر" name="storeName" defaultValue={s.storeName} />
            <TextField label="حرف الشعار (الاحتياطي)" name="logoText" defaultValue={s.logoText} maxLength={3} />
            <TextField label="رمز العملة" name="currency" defaultValue={s.currency} />
          </div>
          <div className="mt-4">
            <ImageUploader label="شعار المتجر (Logo)" name="logoImage" defaultValue={s.logoImage ?? ""} hint="يفضل صورة شفافة PNG بخلفية داكنة" />
          </div>
          <div className="mt-4">
            <TextField label="الشعار النصي (Tagline)" name="tagline" defaultValue={s.tagline ?? ""} />
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm text-zinc-400">اللون المميز للمتجر</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="accentColor"
                defaultValue={s.accentColor}
                className="h-11 w-16 cursor-pointer rounded-xl border border-white/10 bg-black/40 p-1"
              />
              <span className="text-sm text-zinc-400">
                يُطبّق على الأزرار والعناوين المميزة في كامل المتجر
              </span>
            </div>
          </div>
        </Card>

        {/* الشريط الإعلاني */}
        <Card title="② الشريط الإعلاني العلوي">
          <div className="space-y-4">
            <Toggle name="announcementEnabled" label="إظهار الشريط" defaultChecked={s.announcementEnabled ?? true} />
            <TextField label="نص الشريط" name="announcementText" defaultValue={s.announcementText ?? ""} />
          </div>
        </Card>

        {/* الهيرو */}
        <Card title="③ القسم الرئيسي (Hero)" desc="أول ما يراه الزائر">
          <div className="grid gap-4">
            <TextField label="نص علوي صغير" name="heroEyebrow" defaultValue={s.heroEyebrow ?? ""} />
            <TextArea
              label="العنوان الرئيسي (استخدم سطر جديد لتقسيم السطر الذهبي)"
              name="heroTitle"
              rows={2}
              defaultValue={s.heroTitle ?? ""}
            />
            <TextArea label="النص الفرعي" name="heroSubtitle" rows={2} defaultValue={s.heroSubtitle ?? ""} />
            <div className="grid gap-4 sm:grid-cols-3">
              <TextField label="نص الزر الأساسي" name="heroCtaText" defaultValue={s.heroCtaText ?? ""} />
              <TextField label="رابط الزر الأساسي" name="heroCtaLink" defaultValue={s.heroCtaLink ?? ""} />
              <TextField label="نص الزر الثانوي" name="heroSecondaryCta" defaultValue={s.heroSecondaryCta ?? ""} />
            </div>
            <ImageUploader label="صورة الخلفية (اتركها فارغة لاستخدام الافتراضية)" name="heroImage" defaultValue={s.heroImage ?? ""} />
          </div>
        </Card>

        {/* البرومو */}
        <Card title="④ قسم العرض الترويجي">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Toggle name="promoEnabled" label="إظهار القسم" defaultChecked={s.promoEnabled ?? true} />
              <TextField label="شارة العرض" name="promoBadge" defaultValue={s.promoBadge ?? ""} />
            </div>
            <TextField label="عنوان العرض" name="promoTitle" defaultValue={s.promoTitle ?? ""} />
            <TextArea label="نص العرض" name="promoText" rows={2} defaultValue={s.promoText ?? ""} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="نص الزر" name="promoButton" defaultValue={s.promoButton ?? ""} />
              <ImageUploader label="صورة العرض" name="promoImage" defaultValue={s.promoImage ?? ""} />
            </div>
          </div>
        </Card>

        {/* من نحن */}
        <Card title="⑤ قسم «من نحن»">
          <div className="grid gap-4">
            <TextField label="العنوان" name="aboutTitle" defaultValue={s.aboutTitle ?? ""} />
            <TextArea label="المحتوى" name="aboutContent" rows={4} defaultValue={s.aboutContent ?? ""} />
            <ImageUploader label="الصورة" name="aboutImage" defaultValue={s.aboutImage ?? ""} />
          </div>
        </Card>

        {/* عناوين المميزات */}
        <Card title="⑥ عناوين قسم المميزات">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="العنوان الرئيسي" name="featuresTitle" defaultValue={s.featuresTitle ?? ""} />
            <TextField label="العنوان الفرعي" name="featuresSubtitle" defaultValue={s.featuresSubtitle ?? ""} />
          </div>
          <p className="mt-3 text-xs text-zinc-600">
            لإدارة بطاقات المميزات نفسها، انتقل إلى صفحة «المميزات».
          </p>
        </Card>

        {/* التواصل */}
        <Card title="⑦ التواصل ووسائل التواصل">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="الهاتف" name="phone" defaultValue={s.phone ?? ""} />
            <TextField label="البريد الإلكتروني" name="email" defaultValue={s.email ?? ""} />
            <TextField label="العنوان" name="address" defaultValue={s.address ?? ""} />
            <TextField label="رابط واتساب" name="whatsapp" defaultValue={s.whatsapp ?? ""} />
            <TextField label="إنستغرام" name="instagram" defaultValue={s.instagram ?? ""} />
            <TextField label="تويتر / X" name="twitter" defaultValue={s.twitter ?? ""} />
            <TextField label="فيسبوك" name="facebook" defaultValue={s.facebook ?? ""} />
            <TextField label="تيك توك" name="tiktok" defaultValue={s.tiktok ?? ""} />
          </div>
        </Card>

        {/* بيكسلات التتبع */}
        <Card title="⑩ بيكسلات التتبع" desc="Facebook Pixel و TikTok Pixel">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Facebook Pixel ID" name="facebookPixel" defaultValue={s.facebookPixel ?? ""} hint="مثال: 123456789012345" />
            <TextField label="TikTok Pixel ID" name="tiktokPixel" defaultValue={s.tiktokPixel ?? ""} hint="مثال: ABC123DEF456" />
          </div>
        </Card>

        {/* Google Sheets */}
        <Card title="⑪ ربط Google Sheets" desc="إرسال الطلبات تلقائياً إلى جدول Google Sheets">
          <TextField
            label="رابط Web App (Google Apps Script)"
            name="googleSheetUrl"
            defaultValue={s.googleSheetUrl ?? ""}
            hint="أنشئ Google Sheet ثم اربطه بـ Google Apps Script وانسخ رابط النشر هنا"
          />
          <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs text-zinc-500 leading-relaxed">
            <strong className="text-zinc-300">كيفية الإعداد:</strong>
            <ol className="mt-2 mr-4 list-decimal space-y-1">
              <li>أنشئ Google Sheet جديد</li>
              <li>افتح <strong>Extensions → Apps Script</strong></li>
              <li>انسخ الكود من <a href="https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server" target="_blank" rel="noreferrer" className="text-[var(--accent)]">هذا المثال</a> وعدّله</li>
              <li>انشره كـ <strong>Web App</strong> وانسخ الرابط هنا</li>
            </ol>
          </div>
        </Card>

        {/* التذييل */}
        <Card title="⑧ التذييل">
          <TextArea label="نص التذييل" name="footerText" rows={2} defaultValue={s.footerText ?? ""} />
        </Card>

        <div className="sticky bottom-4 z-10">
          <button type="submit" className={`${btnPrimary} w-full py-3.5 text-base shadow-lg`}>
            💾 حفظ كل الإعدادات
          </button>
        </div>
      </form>

      {/* الأمان */}
      <Card title="⑨ الأمان" desc="تغيير كلمة مرور لوحة التحكم">
        <form action={changeAdminPassword} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <TextField label="كلمة المرور الجديدة" name="adminPassword" defaultValue={s.adminPassword} />
          </div>
          <button type="submit" className={btnPrimary}>
            تحديث كلمة المرور
          </button>
        </form>
      </Card>
    </div>
  );
}
