import { useState } from "react";
import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import type { NotificationItem } from "../api/types";

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    try {
      const res = await api.get(ENDPOINTS.notifications);
      setItems(res.data || res.data?.data || []);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Failed");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 16 }}>
      <h2>Notifications</h2>
      <button onClick={load} style={{ padding: 10, borderRadius: 12, border: "1px solid #ddd" }}>
        Load
      </button>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {items.map((n: any, idx) => (
          <div key={n._id ?? idx} style={{ border: "1px solid #eee", borderRadius: 16, padding: 12 }}>
            <b>{n.type}</b>
            <p style={{ marginTop: 6 }}>{n.message}</p>
            <div style={{ opacity: 0.7 }}>
              {n.userId} • {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
