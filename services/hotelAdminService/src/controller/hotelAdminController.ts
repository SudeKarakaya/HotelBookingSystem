import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { client } from "../config/mongo";
import { predictPrice } from "../clients/mlClient";

export const createRoomWithMLPrice = async (
  req: Request,
  res: Response
) => {
  try {
    const { hotelId, season, capacity } = req.body;

    if (!hotelId || season === undefined || !capacity) {
      return res.status(400).json({
        message: "hotelId, season and capacity are required"
      });
    }

    const predictedPrice = await predictPrice(season, capacity);

    const db = client.db("hotelBooking");
    const hotels = db.collection("hotels");

    const room = {
      roomId: new ObjectId().toString(),
      capacity,
      price: predictedPrice,
      priceSource: "ML_PREDICTION",
      season,
      createdAt: new Date()
    };

    await hotels.updateOne(
      { _id: new ObjectId(hotelId) },
      { $push: { rooms: room } as any}
    );

    return res.status(201).json({
      message: "Room created using ML price prediction",
      room,
      ml: {
        model: "LinearRegression",
        features: ["season", "capacity"]
      }
    });
  } catch (error) {
    console.error("ML Room Creation Error:", error);
    return res.status(500).json({
      message: "Failed to create room with ML price"
    });
  }
};
