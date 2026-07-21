import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return Response.json({ error: "لم يتم اختيار ملف" }, { status: 400 });
    }

    // التحقق من نوع الملف
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      return Response.json(
        { error: "نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP" },
        { status: 400 }
      );
    }

    // التحقق من الحجم (5 ميجا كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "حجم الملف يتجاوز 5 ميجابايت" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.type.split("/")[1] || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    return Response.json({ url: `/uploads/${filename}` });
    // Note: files are served via /uploads/[filename] route handler
  } catch (err) {
    console.error("Upload error:", err);
    return Response.json({ error: "فشل رفع الملف" }, { status: 500 });
  }
}
