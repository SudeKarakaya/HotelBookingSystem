import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { createBooking, getUserBookings, cancelBooking } from "../services/bookingService";

const router = Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { hotelId, roomId, from, to, peopleCount } = req.body;
    const userId = req.user.sub;

    if (!hotelId || !roomId || !from || !to || !peopleCount) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const booking = await createBooking({
      userId,
      hotelId,
      roomId,
      from,
      to,
      peopleCount
    });

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(409).json({ message: error.message });
  }
});


router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.sub;

    const bookings = await getUserBookings(userId);

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});


router.delete("/:bookingId", verifyToken, async (req, res) => {
  try {
    const bookingId = req.params.bookingId as string;
    const userId = req.user.sub;

    await cancelBooking(bookingId, userId);

    res.json({ message: "Booking cancelled" });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});


export default router;
