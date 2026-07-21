import { getSettings } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const settings = await getSettings();
    if (!settings.googleSheetUrl) {
      return Response.json({ ok: false, error: "لم يتم إعداد رابط Google Sheets" });
    }

    const body = await request.json();

    const res = await fetch(settings.googleSheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return Response.json(
        { ok: false, error: "فشل الإرسال إلى Google Sheets" },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Sheets error:", err);
    return Response.json({ ok: false, error: "خطأ في الاتصال" }, { status: 500 });
  }
}
