import { useState } from "react";
import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import Field from "../components/field";
import type { Hotel } from "../api/types";

export default function SearchPage() {
  const [location, setLocation] = useState("Marseille");
  const [startDate, setStartDate] = useState("2026-01-20");
  const [endDate, setEndDate] = useState("2026-01-22");
  const [peopleCount, setPeopleCount] = useState("2");

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [source, setSource] = useState<string>("");
  const [discounted, setDiscounted] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const search = async () => {
    setErr(null);
    try {
      const res = await api.get(ENDPOINTS.hotelsSearch, {
        params: { location, startDate, endDate, peopleCount },
      });

      setHotels(res.data?.data || []);
      setSource(res.data?.source || "db");
      setDiscounted(!!res.data?.discounted);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Search failed");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 16 }}>
      <h2>Hotel Search</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
        <Field label="Location" value={location} onChange={setLocation} />
        <Field label="Start Date" value={startDate} onChange={setStartDate} type="date" />
        <Field label="End Date" value={endDate} onChange={setEndDate} type="date" />
        <Field label="People" value={peopleCount} onChange={setPeopleCount} type="number" />
      </div>

      <button
        onClick={search}
        style={{ padding: 10, borderRadius: 12, border: "1px solid #ddd", cursor: "pointer" }}
      >
        Search
      </button>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {hotels.length > 0 && (
        <p style={{ opacity: 0.7 }}>
          Source: <b>{source}</b> • Discounted: <b>{String(discounted)}</b>
        </p>
      )}

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {hotels.map((h) => (
          <div key={h._id} style={{ border: "1px solid #eee", borderRadius: 16, padding: 12 }}>
            <h3 style={{ margin: 0 }}>{h.name}</h3>
            <p style={{ marginTop: 6, opacity: 0.7 }}>{h.location}</p>

            <div style={{ marginTop: 8 }}>
              <b>Rooms</b>
              {h.rooms?.map((r) => (
                <div
                  key={r.roomId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px dashed #eee",
                  }}
                >
                  <span>Room: {r.roomId} • Capacity: {r.capacity}</span>
                  <span>
                    Price:{" "}
                    {r.finalPrice ?? r.price ?? "-"}
                    {r.originalPrice ? <span style={{ opacity: 0.6 }}> (orig {r.originalPrice})</span> : null}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
