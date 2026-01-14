import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectMongo } from "./config/mongo";
import { startBookingConsumer } from "./queue/consumer";

const PORT = process.env.PORT || 3001;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "notification-service",
  });
});

const startServer = async () => {
  await connectMongo();
  await startBookingConsumer();

  app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
  });
};

startServer();