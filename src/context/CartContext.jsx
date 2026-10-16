import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("fo_cart") || "[]"));
  useEffect(() => localStorage.setItem("fo_cart", JSON.stringify(cart)), [cart]);

  const add = (item) =>
    setCart((c) => c.some((x) => x.id === item.id)
      ? c.map((x) => (x.id === item.id ? { ...x, qty: x.qty + 1 } : x))
      : [...c, { ...item, qty: 1 }]);
  const setQty = (id, qty) =>
    setCart((c) => (qty <= 0 ? c.filter((x) => x.id !== id) : c.map((x) => (x.id === id ? { ...x, qty } : x))));
  const clear = () => setCart([]);
  const count = cart.reduce((s, x) => s + x.qty, 0);
  const total = cart.reduce((s, x) => s + x.qty * x.price, 0);

  return <CartContext.Provider value={{ cart, add, setQty, clear, count, total }}>{children}</CartContext.Provider>;
}
