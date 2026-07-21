"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: number;
  name: string;
  price: string;
  image: string | null;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "noir_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const addItem: CartContextValue["addItem"] = (item, qty = 1) => {
      setItems((prev) => {
        const found = prev.find((p) => p.id === item.id);
        if (found) {
          return prev.map((p) =>
            p.id === item.id ? { ...p, qty: p.qty + qty } : p
          );
        }
        return [...prev, { ...item, qty }];
      });
      setOpen(true);
    };
    const removeItem = (id: number) =>
      setItems((prev) => prev.filter((p) => p.id !== id));
    const setQty = (id: number, qty: number) =>
      setItems((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, qty: Math.max(1, qty) } : p
        )
      );
    const increment = (id: number) =>
      setItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
      );
    const decrement = (id: number) =>
      setItems((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p
        )
      );
    const clear = () => setItems([]);

    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + Number(i.price) * i.qty, 0);

    return {
      items,
      count,
      subtotal,
      addItem,
      removeItem,
      setQty,
      increment,
      decrement,
      clear,
      open,
      setOpen,
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
