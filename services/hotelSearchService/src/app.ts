import express from "express";
import cors from "cors";
import { verifyToken } from "./middlewares/authMiddleware";
import { requireAdmin } from "./middlewares/roleMiddleware";
import { client } from "./config/mongo";
import hotelSearchRoutes from "./routes/hotelSearchRouter";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/hotels", hotelSearchRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "hotel-search-service" });
});

app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Protected route",
    user: req.user
  });
});

app.get("/admin/test", verifyToken, requireAdmin, (req, res) => {
  res.json({
    message: "Admin endpoint accessed successfully",
  });
});

app.get("/db-test", async (req, res) => {
  const db = client.db("hotel-booking");
  const collections = await db.listCollections().toArray();

  res.json({
    message: "MongoDB is connected",
    collections: collections.map(c => c.name)
  });
});

export default app;
