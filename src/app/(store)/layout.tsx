import { ReactNode } from "react";
import { getSettings, getCategories } from "@/lib/data";
import Navbar from "@/components/storefront/navbar";
import Footer from "@/components/storefront/footer";
import CartDrawer from "@/components/storefront/cart-drawer";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getCategories(true),
  ]);

  return (
    <>
      <Navbar settings={settings} categories={categories} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer settings={settings} categories={categories} />
      <CartDrawer settings={settings} />
    </>
  );
}
