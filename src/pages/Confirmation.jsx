import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "../api.js";

export default function Confirmation() {
  const { id } = useParams();
  const [o, setO] = useState(null);
  useEffect(() => { getOrder(id).then(setO); }, [id]);
  if (!o) return <p>Loading…</p>;
  return (
    <>
      <h1>Order confirmed ✅</h1>
      <p>Order <strong>#{o.id}</strong> has been placed. Status: <span className="tag">{o.status}</span></p>
      <div className="list">
        {o.items.map((i) => <div key={i.id} className="row"><span>{i.qty} × {i.name}</span><span>Rs {i.qty * i.price}</span></div>)}
      </div>
      <h2>Total: Rs {o.total}</h2>
      <p className="muted">Delivering to {o.address}</p>
      <Link to="/my-orders">Track my orders</Link>
    </>
  );
}
