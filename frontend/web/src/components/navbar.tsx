import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function Navbar() {
  const { isAuthed, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: 12,
        borderBottom: "1px solid #eee",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <b>HotelBookingSystem</b>
        <Link to="/">Search</Link>
        <Link to="/bookings">Bookings</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/ml">ML Demo</Link>
      </div>

      <div>
        {!isAuthed ? (
          <Link to="/login">Login</Link>
        ) : (
          <button
            onClick={() => {
              logout();
              nav("/login");
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
