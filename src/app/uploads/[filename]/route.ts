import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Security: prevent directory traversal
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  if (!safeFilename || safeFilename !== filename) {
    return new Response("Invalid filename", { status: 400 });
  }

  const filePath = join(process.cwd(), "public", "uploads", safeFilename);

  if (!existsSync(filePath)) {
    return new Response("File not found", { status: 404 });
  }

  try {
    const file = await readFile(filePath);

    const ext = safeFilename.split(".").pop()?.toLowerCase();
    const contentType =
      ext === "png"
        ? "image/png"
        : ext === "webp"
        ? "image/webp"
        : "image/jpeg";

    return new Response(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Error reading file", { status: 500 });
  }
}
