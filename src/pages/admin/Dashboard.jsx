import { useEffect, useState } from "react";
import { getItems, getRestaurants, saveItem, deleteItem, getAllOrders, updateOrderStatus } from "../../api.js";

const STATUSES = ["Placed", "Preparing", "Out for delivery", "Delivered", "Cancelled"];
const empty = { name: "", price: "", category: "Main", desc: "", restaurantId: "" };

export default function Dashboard() {
  const [tab, setTab] = useState("menu");
  const [items, setItems] = useState([]);
  const [rests, setRests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");

  const loadItems = () => getItems().then(setItems);
  const loadOrders = () => getAllOrders().then(setOrders);

  useEffect(() => {
    getRestaurants().then((r) => { setRests(r); setForm((f) => ({ ...f, restaurantId: r[0]?.id || "" })); });
    loadItems(); loadOrders();
    const t = setInterval(loadOrders, 5000);
    return () => clearInterval(t);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setErr("Item name is required");
    if (!(Number(form.price) > 0)) return setErr("Price must be greater than 0");
    setErr("");
    await saveItem({ ...form, price: Number(form.price) });
    setForm({ ...empty, restaurantId: form.restaurantId });
    loadItems();
  };

  return (
    <>
      <h1>Admin dashboard</h1>
      <div className="tabs">
        <button className={tab === "menu" ? "active" : ""} onClick={() => setTab("menu")}>Menu items</button>
        <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Orders ({orders.length})</button>
      </div>

      {tab === "menu" && (
        <>
          <form onSubmit={submit} className="form" noValidate>
            <h3>{form.id ? "Edit item" : "Add item"}</h3>
            <select className="input" value={form.restaurantId} onChange={(e) => setForm({ ...form, restaurantId: e.target.value })}>
              {rests.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["Starter", "Main", "Side", "Drink", "Dessert"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <input className="input" placeholder="Description" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
            {err && <span className="error">{err}</span>}
            <button className="btn big">{form.id ? "Save changes" : "Add item"}</button>
            {form.id && <button type="button" className="link" onClick={() => setForm({ ...empty, restaurantId: rests[0]?.id })}>Cancel edit</button>}
          </form>
          <div className="list">
            {items.map((i) => (
              <div key={i.id} className="row">
                <div><strong>{i.name}</strong> <span className="tag">{i.category}</span><p className="muted">Rs {i.price}</p></div>
                <div className="right">
                  <button className="btn ghost" onClick={() => setForm(i)}>Edit</button>
                  <button className="btn danger" onClick={() => deleteItem(i.id).then(loadItems)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "orders" && (
        <div className="list">
          {orders.length === 0 && <p>No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} className="row">
              <div>
                <strong>#{o.id}</strong> · {o.userName}
                <p className="muted">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</p>
                <p className="muted">{o.address} · {o.phone}</p>
              </div>
              <div className="right">
                <strong>Rs {o.total}</strong>
                <select className="input" value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value).then(loadOrders)}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
