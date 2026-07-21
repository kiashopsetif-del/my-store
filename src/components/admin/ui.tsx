import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition focus:border-[var(--accent)] placeholder:text-zinc-600";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-60";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5";

export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10";

export function TextField({
  label,
  hint,
  className,
  ...props
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-zinc-400">{label}</span>
      <input className={cn(inputClass, className)} {...props} />
      {hint && <span className="mt-1 block text-xs text-zinc-600">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  hint,
  className,
  ...props
}: { label: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-zinc-400">{label}</span>
      <textarea className={cn(inputClass, "resize-y", className)} {...props} />
      {hint && <span className="mt-1 block text-xs text-zinc-600">{hint}</span>}
    </label>
  );
}

export function SelectField({
  label,
  hint,
  className,
  children,
  ...props
}: { label: string; hint?: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-zinc-400">{label}</span>
      <select
        className={cn(inputClass, "bg-black/60 [&>option]:bg-[#111]", className)}
        {...props}
      >
        {children}
      </select>
      {hint && <span className="mt-1 block text-xs text-zinc-600">{hint}</span>}
    </label>
  );
}

export function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span className="relative inline-block">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <span className="block h-6 w-11 rounded-full bg-white/15 transition peer-checked:bg-[var(--accent)]" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
      </span>
      <span className="text-sm text-zinc-300">{label}</span>
    </label>
  );
}

export function Card({
  title,
  desc,
  children,
  action,
}: {
  title?: string;
  desc?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            {title && (
              <h2 className="font-display text-lg font-bold text-white">{title}</h2>
            )}
            {desc && <p className="mt-1 text-sm text-zinc-500">{desc}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{title}</h1>
        {desc && <p className="mt-1 text-sm text-zinc-500">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Notice({
  kind,
  children,
}: {
  kind: "success" | "error" | "info";
  children: ReactNode;
}) {
  const styles =
    kind === "error"
      ? "border-red-500/30 bg-red-500/10 text-red-300"
      : kind === "success"
      ? "border-green-500/30 bg-green-500/10 text-green-300"
      : "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)]";
  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm", styles)}>{children}</div>
  );
}

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
          {icon}
        </span>
      </div>
      <div className="mt-3 font-display text-3xl font-bold text-white">{value}</div>
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "red" | "amber" | "accent";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-white/10 text-zinc-300",
    green: "bg-green-500/15 text-green-300",
    red: "bg-red-500/15 text-red-300",
    amber: "bg-amber-500/15 text-amber-300",
    accent: "bg-[var(--accent)]/15 text-[var(--accent)]",
  };
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}
