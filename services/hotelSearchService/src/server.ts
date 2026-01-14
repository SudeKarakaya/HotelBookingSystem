import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectMongo } from "./config/mongo";

const PORT = process.env.PORT || 3002;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "hotel-search-service",
  });
});

const startServer = async () => {
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`Hotel Search Service running on port ${PORT}`);
  });
};

startServer();