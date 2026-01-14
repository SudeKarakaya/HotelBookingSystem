import { useState } from "react";
import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import Field from "../components/field";

export default function MlPricePage() {
  const [season, setSeason] = useState("7");
  const [capacity, setCapacity] = useState("2");
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const predict = async () => {
    setErr(null);
    try {
      const res = await api.post(ENDPOINTS.mlPredict, {
        season: Number(season),
        capacity: Number(capacity),
      });
      setResult(res.data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Predict failed");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "20px auto", padding: 16 }}>
      <h2>ML Price Demo</h2>

      <Field label="Season (1-12)" value={season} onChange={setSeason} type="number" />
      <Field label="Capacity" value={capacity} onChange={setCapacity} type="number" />

      <button onClick={predict} style={{ padding: 10, borderRadius: 12, border: "1px solid #ddd" }}>
        Predict
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
