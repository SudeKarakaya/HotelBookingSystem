import express from "express";
import cors from "cors";
import gatewayRoutes from "./routes/gatewayRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", gatewayRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "OK", service: "api-gateway" });
});

export default app;
