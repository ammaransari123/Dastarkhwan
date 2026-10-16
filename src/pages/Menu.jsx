import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRestaurant, getItems } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function Menu() {
  const { id } = useParams();
  const { add } = useCart();
  const [rest, setRest] = useState(null);
  const [items, setItems] = useState(null);
  const [q, setQ] = useState("");
  const [added, setAdded] = useState("");

  useEffect(() => { getRestaurant(id).then(setRest); }, [id]);
  useEffect(() => { getItems(id, q).then(setItems); }, [id, q]);

  const onAdd = (item) => { add(item); setAdded(item.name); setTimeout(() => setAdded(""), 1200); };

  return (
    <>
      <h1>{rest ? `${rest.emoji} ${rest.name}` : "Loading…"}</h1>
      <input className="input" placeholder="Search menu" value={q} onChange={(e) => setQ(e.target.value)} />
      {added && <p className="toast">{added} added to cart</p>}
      {!items ? <p>Loading…</p> : items.length === 0 ? <p>No dish found.</p> : (
        <div className="list">
          {items.map((i) => (
            <div key={i.id} className="row">
              <div>
                <strong>{i.name}</strong> <span className="tag">{i.category}</span>
                <p className="muted">{i.desc}</p>
              </div>
              <div className="right">
                <strong>Rs {i.price}</strong>
                <button className="btn" onClick={() => onAdd(i)}>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
