import { Router } from "express";
import { client } from "../config/mongo";

const router = Router();


router.post("/nightly-check", async (req, res) => {
  try {
    const db = client.db("hotelBooking");
    const hotelsCol = db.collection("hotels");
    const bookingsCol = db.collection("bookings");
    const notificationsCol = db.collection("notifications");

    const ASSUMED_MAX_CAPACITY_PER_ROOM = 10;
    const threshold = Math.ceil(ASSUMED_MAX_CAPACITY_PER_ROOM * 0.2); // 20% => 2

    
    const toYMD = (d: Date) => d.toISOString().split("T")[0];

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const tomorrowYMD = toYMD(tomorrow);

    const lowCapacityHotels = await hotelsCol
      .find({
        rooms: { $elemMatch: { capacity: { $lte: threshold } } }
      })
      .toArray();

    const adminNotifications = lowCapacityHotels.map((hotel: any) => ({
      userId: "ADMIN",
      type: "LOW_CAPACITY_ADMIN",
      message: `Low capacity alert: "${hotel.name}" in ${hotel.location} has rooms at or below 20% remaining capacity.`,
      read: false,
      createdAt: new Date()
    }));

    if (adminNotifications.length > 0) {
      await notificationsCol.insertMany(adminNotifications);
    }

    // User reminders for bookings starting tomorrow
    const tomorrowsBookings = await bookingsCol
      .find({
        from: tomorrowYMD,
        status: "CONFIRMED"
      })
      .toArray();

    const userNotifications = tomorrowsBookings.map((b: any) => ({
      userId: b.userId,
      type: "BOOKING_REMINDER",
      message: `Reminder: Your booking starts tomorrow (${b.from}). HotelId=${b.hotelId}, Room=${b.roomId}`,
      read: false,
      createdAt: new Date()
    }));

    if (userNotifications.length > 0) {
      await notificationsCol.insertMany(userNotifications);
    }

    return res.status(200).json({
      message: "Nightly job completed",
      adminAlerts: adminNotifications.length,
      userReminders: userNotifications.length,
      tomorrow: tomorrowYMD,
      threshold
    });
  } catch (error) {
    console.error("Nightly job error:", error);
    return res.status(500).json({ message: "Nightly job failed" });
  }
});

export default router;
