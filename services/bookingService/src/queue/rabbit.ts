import amqp from "amqplib";

const RABBIT_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE = "booking_events";

let channel: amqp.Channel;

export const connectRabbit = async () => {
  const connection = await amqp.connect(RABBIT_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });

  console.log("RabbitMQ connected (Booking Service)");
};

export const publishBookingEvent = async (payload: any) => {
  if (!channel) throw new Error("RabbitMQ channel not ready");

  channel.sendToQueue(
    QUEUE,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
};
