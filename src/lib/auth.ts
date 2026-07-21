import { cookies } from "next/headers";

export const ADMIN_COOKIE = "noir_admin_session";

/** التحقق من تسجيل دخول المدير */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const c = store.get(ADMIN_COOKIE);
  return c?.value === "authenticated";
}
