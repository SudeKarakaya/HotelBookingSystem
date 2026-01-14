import amqp, { ConsumeMessage } from "amqplib";
import { client } from "../config/mongo";

const RABBIT_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE = "booking_events";

export const startBookingConsumer = async () => {
  const connection = await amqp.connect(RABBIT_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  console.log("Notification Service listening to booking_events");

  channel.consume(QUEUE, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());

      if (data.type === "BOOKING_CREATED") {
        const db = client.db("hotelBooking");

        await db.collection("notifications").insertOne({
          userId: data.userId,
          type: "BOOKING_CONFIRMED",
          message: `Your booking is confirmed for ${data.from} - ${data.to}`,
          createdAt: new Date(),
          read: false
        });
      }

      channel.ack(msg);
    } catch (error) {
      console.error("Consumer error:", error);
      channel.nack(msg, false, false);
    }
  });
};
