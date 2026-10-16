import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { placeOrder } from "../api.js";

export default function Cart() {
  const { cart, setQty, clear, total } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ address: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  if (cart.length === 0) return <><h1>Your cart is empty</h1><Link to="/">Browse restaurants</Link></>;

  const validate = () => {
    const e = {};
    if (form.address.trim().length < 10) e.address = "Enter full address (min 10 characters)";
    if (!/^03\d{9}$/.test(form.phone)) e.phone = "Phone must look like 03001234567";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!user) return nav("/login");
    if (!validate()) return;
    setBusy(true);
    const order = await placeOrder({ userId: user.id, userName: user.name, items: cart, total, ...form });
    clear();
    nav(`/confirmation/${order.id}`);
  };

  return (
    <>
      <h1>Your cart</h1>
      <div className="list">
        {cart.map((i) => (
          <div key={i.id} className="row">
            <div><strong>{i.name}</strong><p className="muted">Rs {i.price} each</p></div>
            <div className="right">
              <div className="qty">
                <button onClick={() => setQty(i.id, i.qty - 1)}>−</button>
                <span>{i.qty}</span>
                <button onClick={() => setQty(i.id, i.qty + 1)}>+</button>
              </div>
              <strong>Rs {i.price * i.qty}</strong>
            </div>
          </div>
        ))}
      </div>
      <h2>Total: Rs {total}</h2>

      <form onSubmit={submit} className="form" noValidate>
        <label>Delivery address
          <textarea className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          {errors.address && <span className="error">{errors.address}</span>}
        </label>
        <label>Phone
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </label>
        <button className="btn big" disabled={busy}>{user ? (busy ? "Placing…" : "Place order") : "Log in to place order"}</button>
      </form>
    </>
  );
}
