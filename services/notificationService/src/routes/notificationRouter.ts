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

export default router;
