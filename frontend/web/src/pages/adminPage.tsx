import { useState } from "react";
import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import Field from "../components/field";

export default function AdminPage() {
  const [hotelId, setHotelId] = useState("");
  const [capacity, setCapacity] = useState("2");
  const [season, setSeason] = useState("7");

  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const addRoomWithMl = async () => {
    setErr(null);
    try {
      const res = await api.post(ENDPOINTS.adminAddRoomWithMl, {
        hotelId,
        capacity: Number(capacity),
        season: Number(season),
      });
      setResult(res.data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Admin ML room create failed");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 16 }}>
      <h2>Hotel Admin</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Field label="HotelId" value={hotelId} onChange={setHotelId} placeholder="Mongo ObjectId" />
        <Field label="Capacity" value={capacity} onChange={setCapacity} type="number" />
        <Field label="Season (1-12)" value={season} onChange={setSeason} type="number" />
      </div>

      <button
        onClick={addRoomWithMl}
        style={{ padding: 10, borderRadius: 12, border: "1px solid #ddd", cursor: "pointer" }}
      >
        Add Room with ML Price
      </button>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {result && (
        <pre style={{ background: "#fafafa", padding: 12, borderRadius: 12, overflow: "auto", marginTop: 12 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
