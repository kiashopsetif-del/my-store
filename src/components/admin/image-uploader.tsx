"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export default function ImageUploader({
  name,
  label,
  defaultValue = "",
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Keep the text input value in sync with url state for form submission
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.value = url;
    }
  }, [url]);

  const handleFile = useCallback(
    async (file: File) => {
      setError("");
      setLoading(true);

      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "فشل الرفع");
        } else {
          setUrl(data.url);
        }
      } catch {
        setError("تعذّر الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="block">
      <span className="mb-1.5 block text-sm text-zinc-400">{label}</span>

      {/* منطقة الرفع */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-4 text-center transition ${
          url
            ? "border-[var(--accent)]/40 bg-[var(--accent)]/5"
            : "border-white/15 bg-white/[0.02] hover:border-white/30"
        }`}
      >
        {url ? (
          <div className="relative">
            <img
              src={url}
              alt="معاينة"
              className="mx-auto h-28 w-auto rounded-xl object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 transition hover:opacity-100">
              <span className="text-sm font-medium text-white">اضغط لتغيير الصورة</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-xl text-zinc-500">
              📤
            </div>
            <p className="text-xs text-zinc-400">
              اسحب صورة أو <span className="text-[var(--accent)]">اضغط للاختيار</span>
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={onChange}
          className="hidden"
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[var(--accent)]" />
          </div>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

      {/* حقل الرابط — uncontrolled so form submission picks up the value */}
      <div className="mt-2">
        <input
          ref={textInputRef}
          name={name}
          type="text"
          defaultValue={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="رابط الصورة..."
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-[var(--accent)]"
        />
      </div>

      {hint && <span className="mt-1 block text-xs text-zinc-600">{hint}</span>}
    </div>
  );
}
