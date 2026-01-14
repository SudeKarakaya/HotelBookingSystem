import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectMongo } from "./config/mongo";
import { connectRabbit } from "./queue/rabbit";

const PORT = process.env.PORT || 3004;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "booking-service",
  });
});

const startServer = async () => {
  await connectMongo();
  await connectRabbit();
  
  app.listen(PORT, () => {
    console.log(`Booking Service running on port ${PORT}`);
  });
};

startServer();