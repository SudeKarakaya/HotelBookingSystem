import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import {
  createNotification,
  getUserNotifications
} from "../services/notificationService";

const router = Router();

/**
 * Get user notifications
 */
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.sub;

  const notifications = await getUserNotifications(userId);
  res.json(notifications);
});

/**
 * Create notification
 */
router.post("/", verifyToken, async (req, res) => {
  const userId = req.user.sub;
  const { type, message } = req.body;

  await createNotification(userId, type, message);
  res.status(201).json({ message: "Notification created" });
});

router.post("/booking-created", async (req, res) => {
  const { bookingId, userId, hotelId, roomId, from, to } = req.body;

  await notificationsCol.insertOne({
    userId,
    type: "BOOKING_CREATED",
    message: `Your booking is confirmed from ${from} to ${to}`,
    read: false,
    createdAt: new Date()
  });

  res.json({ status: "consumed" });
});


export default router;
