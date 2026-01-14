import { useState } from "react";
import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import Field from "../components/field";
import type { Booking } from "../api/types";

export default function BookingPage() {
  const [hotelId, setHotelId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [from, setFrom] = useState("2026-01-20");
  const [to, setTo] = useState("2026-01-22");
  const [peopleCount, setPeopleCount] = useState("2");

  const [result, setResult] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const createBooking = async () => {
    setErr(null);
    try {
      const res = await api.post(ENDPOINTS.bookings, {
        hotelId,
        roomId,
        from,
        to,
        peopleCount: Number(peopleCount),
      });
      setResult(res.data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Create booking failed");
    }
  };

  const fetchMyBookings = async () => {
    setErr(null);
    try {
      const res = await api.get(ENDPOINTS.bookings);
      setBookings(res.data || []);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Fetch bookings failed");
    }
  };

  const cancel = async (bookingId: string) => {
    setErr(null);
    try {
      await api.delete(`${ENDPOINTS.bookings}/${bookingId}`);
      await fetchMyBookings();
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Cancel failed");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 16 }}>
      <h2>Bookings</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="HotelId" value={hotelId} onChange={setHotelId} placeholder="Mongo ObjectId" />
        <Field label="RoomId" value={roomId} onChange={setRoomId} placeholder="roomId string" />
        <Field label="From" value={from} onChange={setFrom} type="date" />
        <Field label="To" value={to} onChange={setTo} type="date" />
        <Field label="PeopleCount" value={peopleCount} onChange={setPeopleCount} type="number" />
      </div>

      <button onClick={createBooking} style={{ padding: 10, borderRadius: 12, border: "1px solid #ddd" }}>
        Create Booking
      </button>

      <button
        onClick={fetchMyBookings}
        style={{ padding: 10, borderRadius: 12, border: "1px solid #ddd", marginLeft: 10 }}
      >
        Get My Bookings
      </button>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {result && (
        <pre style={{ background: "#fafafa", padding: 12, borderRadius: 12, overflow: "auto" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {bookings.map((b: any) => (
          <div key={b._id} style={{ border: "1px solid #eee", borderRadius: 16, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>{b.status}</b>
              <span style={{ opacity: 0.7 }}>{b.createdAt ? new Date(b.createdAt).toLocaleString() : ""}</span>
            </div>
            <div style={{ marginTop: 8, opacity: 0.85 }}>
              <div>Hotel: {String(b.hotelId)}</div>
              <div>Room: {b.roomId}</div>
              <div>
                Dates: {b.from} → {b.to}
              </div>
              <div>People: {b.peopleCount}</div>
              <div>Total: {b.totalPrice ?? "-"}</div>
            </div>

            {b.status === "CONFIRMED" && b._id && (
              <button
                onClick={() => cancel(b._id)}
                style={{ marginTop: 10, padding: 10, borderRadius: 12, border: "1px solid #ddd" }}
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
