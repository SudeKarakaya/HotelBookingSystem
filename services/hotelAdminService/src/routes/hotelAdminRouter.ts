import { Router } from "express";
import { client } from "../config/mongo";
import { verifyToken } from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/roleMiddleware";
import { ObjectId } from "mongodb";
import { createRoomWithMLPrice } from "../controller/hotelAdminController";

const router = Router();

/**
 * Helpers
 */
const toStringParam = (p: unknown): string | null => {
  if (typeof p === "string") return p;
  if (Array.isArray(p) && typeof p[0] === "string") return p[0];
  return null;
};

const isValidObjectId = (id: string) => ObjectId.isValid(id);

/**
 * Create hotel
 */
router.post("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const db = client.db("hotelBooking");
    const hotels = db.collection("hotels");

    const result = await hotels.insertOne({
      name,
      location,
      rooms: [],
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ hotelId: result.insertedId.toString() });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Add room to hotel
 */
router.post("/:hotelId/rooms", verifyToken, requireAdmin, async (req, res) => {
  try {
    const hotelIdRaw = toStringParam(req.params.hotelId);
    if (!hotelIdRaw || !isValidObjectId(hotelIdRaw)) {
      return res.status(400).json({ message: "Invalid hotelId" });
    }
    const hotelId = hotelIdRaw;

    const { roomId, type, capacity, price } = req.body;

    if (!roomId || !type || capacity === undefined || price === undefined) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const db = client.db("hotelBooking");

    const result = await db.collection("hotels").updateOne(
      { _id: new ObjectId(hotelId) },
      {
        $push: {
          rooms: {
            roomId: String(roomId),
            type: String(type),
            capacity: Number(capacity),
            price: Number(price),
            availableDates: [],
          },
        } as any,
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    return res.json({ message: "Room added" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Add availability to a specific room
 */
router.post(
  "/:hotelId/rooms/:roomId/availability",
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const hotelIdRaw = toStringParam(req.params.hotelId);
      const roomIdRaw = toStringParam(req.params.roomId);

      if (!hotelIdRaw || !isValidObjectId(hotelIdRaw)) {
        return res.status(400).json({ message: "Invalid hotelId" });
      }
      if (!roomIdRaw) {
        return res.status(400).json({ message: "Invalid roomId" });
      }

      const { from, to } = req.body;
      if (!from || !to) {
        return res.status(400).json({ message: "Missing fields: from, to" });
      }

      const hotelId = hotelIdRaw;
      const roomId = roomIdRaw;

      const db = client.db("hotelBooking");

      const result = await db.collection("hotels").updateOne(
        { _id: new ObjectId(hotelId), "rooms.roomId": roomId },
        {
          $push: {
            "rooms.$.availableDates": {
              from: String(from),
              to: String(to),
            },
          } as any, 
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Hotel/Room not found" });
      }

      return res.json({ message: "Availability added" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post("/rooms/ml", createRoomWithMLPrice);


export default router;
