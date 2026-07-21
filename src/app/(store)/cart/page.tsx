import { getSettings } from "@/lib/data";
import CartClient from "@/components/storefront/cart-client";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const settings = await getSettings();
  return <CartClient currency={settings.currency} />;
}
