import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRestaurants } from "../api.js";

export default function Home() {
  const [q, setQ] = useState("");
  const [list, setList] = useState(null);
  useEffect(() => { getRestaurants(q).then(setList); }, [q]);

  return (
    <>
      <h1>Aaj kya khana hai?</h1>
      <input className="input" placeholder="Search restaurants or cuisine" value={q} onChange={(e) => setQ(e.target.value)} />
      {!list ? <p>Loading…</p> : list.length === 0 ? <p>No restaurant matches "{q}". Try another name.</p> : (
        <div className="grid">
          {list.map((r) => (
            <Link key={r.id} to={`/restaurant/${r.id}`} className="card">
              <div className="emoji">{r.emoji}</div>
              <h3>{r.name}</h3>
              <p className="muted">{r.cuisine} · ★ {r.rating}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
