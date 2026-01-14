import express from "express";
import cors from "cors";
import notificationRoutes from "./routes/notificationRouter";
import internalSchedulerRouter from "./routes/internalSchedulerRouter";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/notifications", notificationRoutes);

app.use("/internal", internalSchedulerRouter);

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "notification-service" });
});

export default app;
