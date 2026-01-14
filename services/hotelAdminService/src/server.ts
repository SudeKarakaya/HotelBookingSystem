import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectMongo } from "./config/mongo";

const PORT = process.env.PORT || 3003;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "hotel-admin-service",
  });
});

const startServer = async () => {
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`Hotel Admin Service running on port ${PORT}`);
  });
};


startServer();