import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import Sidebar from "@/components/admin/sidebar";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-200">
      <Sidebar storeName={settings.storeName} />
      <div className="lg:pr-72">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
