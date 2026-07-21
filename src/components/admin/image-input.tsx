"use client";

import { useState } from "react";
import { inputClass } from "@/components/admin/ui";

export function ImageInput({
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
  const [v, setV] = useState(defaultValue);
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-zinc-400">{label}</span>
      <div className="flex items-center gap-3">
        <input
          name={name}
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder="https://..."
          className={inputClass}
        />
        <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
          {v ? (
            <img src={v} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-zinc-600">🖼</span>
          )}
        </div>
      </div>
      {hint && <span className="mt-1 block text-xs text-zinc-600">{hint}</span>}
    </label>
  );
}
