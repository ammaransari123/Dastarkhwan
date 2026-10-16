import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const nav = useNavigate();
  return (
    <header className="nav">
      <Link to="/" className="brand">Dastarkhwan</Link>
      <nav>
        {user?.role === "admin" && <Link to="/admin">Dashboard</Link>}
        {user && <Link to="/my-orders">My orders</Link>}
        <Link to="/cart">Cart <span className="badge">{count}</span></Link>
        {user ? (
          <button className="link" onClick={() => { logout(); nav("/"); }}>Log out ({user.name})</button>
        ) : (
          <Link to="/login">Log in</Link>
        )}
      </nav>
    </header>
  );
}
