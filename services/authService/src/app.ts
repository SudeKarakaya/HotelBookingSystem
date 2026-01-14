import express = require("express");
import cors from "cors";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "OK", service: "auth-service" });
});

export default app;
