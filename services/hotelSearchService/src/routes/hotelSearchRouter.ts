import { Router, Request, Response } from "express";
import { client } from "../config/mongo";
import { getCache, setCache } from "../utils/cache";
import { verifyTokenOptional } from "../middlewares/authMiddleware";
import { Hotel, Room } from "../models/hotelModel";

const router = Router();

router.get(
  "/search",
  verifyTokenOptional,
  async (req: Request, res: Response) => {
    try {
      const { location, startDate, endDate, peopleCount } = req.query;

      if (!location || !startDate || !endDate || !peopleCount) {
        return res.status(400).json({
          message: "Missing query parameters"
        });
      }

      const isLoggedIn = !!req.user;
      const discountRate = isLoggedIn ? 0.9 : 1;

      const cacheKey = `search:${location}:${startDate}:${endDate}:${peopleCount}:${isLoggedIn}`;

      const cached = getCache(cacheKey);
      if (cached) {
        return res.json({
          source: "cache",
          discounted: isLoggedIn,
          data: cached
        });
      }

      const db = client.db("hotelBooking");
      const hotelsCollection = db.collection("hotels");

      const hotels = (await hotelsCollection
        .find({
          location,
          rooms: {
            $elemMatch: {
              capacity: { $gte: Number(peopleCount) },
              availableDates: {
                $elemMatch: {
                  from: { $lte: startDate },
                  to: { $gte: endDate }
                }
              }
            }
          }
        })
        .toArray()) as unknown as Hotel[];

      // Discount 
      const discountedHotels: Hotel[] = hotels.map((hotel: Hotel) => ({
        ...hotel,
        rooms: hotel.rooms.map((room: Room) => ({
          ...room,
          originalPrice: room.price,
          finalPrice: Math.round(room.price * discountRate)
        }))
      }));

      setCache(cacheKey, discountedHotels, 60);

      return res.json({
        source: "db",
        discounted: isLoggedIn,
        data: discountedHotels
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
