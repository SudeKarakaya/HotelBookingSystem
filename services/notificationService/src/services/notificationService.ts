import { client } from "../config/mongo";

export const createNotification = async (
  userId: string,
  type: string,
  message: string
) => {
  const db = client.db("hotelBooking");

  await db.collection("notifications").insertOne({
    userId,
    type,
    message,
    read: false,
    createdAt: new Date()
  });
};

export const getUserNotifications = async (userId: string) => {
  const db = client.db("hotelBooking");

  return db
    .collection("notifications")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
};
