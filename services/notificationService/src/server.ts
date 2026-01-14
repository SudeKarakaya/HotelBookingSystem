import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectMongo } from "./config/mongo";

const PORT = process.env.PORT || 3001;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "notification-service",
  });
});

const startServer = async () => {
  connectMongo();

  app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
  });
};

startServer();