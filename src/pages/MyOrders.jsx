import { useEffect, useState } from "react";
import { getMyOrders } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  useEffect(() => {
    const load = () => getMyOrders(user.id).then(setOrders);
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [user.id]);

  if (!orders) return <p>Loading…</p>;
  return (
    <>
      <h1>My orders</h1>
      {orders.length === 0 && <p>No orders yet.</p>}
      <div className="list">
        {orders.map((o) => (
          <div key={o.id} className="row">
            <div><strong>#{o.id}</strong><p className="muted">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</p></div>
            <div className="right"><strong>Rs {o.total}</strong><span className="tag">{o.status}</span></div>
          </div>
        ))}
      </div>
    </>
  );
}
