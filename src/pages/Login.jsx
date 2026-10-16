import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr("Enter a valid email");
    if (f.password.length < 6) return setErr("Password must be at least 6 characters");
    try { await login(f); nav("/"); } catch (x) { setErr(x.message); }
  };

  return (
    <form onSubmit={submit} className="form narrow" noValidate>
      <h1>Log in</h1>
      <input className="input" type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input className="input" type="password" placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      {err && <span className="error">{err}</span>}
      <button className="btn big">Log in</button>
      <p className="muted">New here? <Link to="/register">Create account</Link></p>
      <p className="muted">Admin demo: admin@food.com / admin123</p>
    </form>
  );
}
