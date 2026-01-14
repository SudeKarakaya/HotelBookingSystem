import { ObjectId } from "mongodb";
import { client } from "../config/mongo";

type CreateBookingParams = {
  userId: string;
  hotelId: string;
  roomId: string;
  from: string;
  to: string;
  peopleCount: number;
};


// Create Booking
export const createBooking = async (params: CreateBookingParams) => {
  const { userId, hotelId, roomId, from, to, peopleCount } = params;

  const db = client.db("hotelBooking");
  const hotels = db.collection("hotels");
  const bookings = db.collection("bookings");

  const updateResult = await hotels.updateOne(
    {
      _id: new ObjectId(hotelId),
      "rooms.roomId": roomId,
      "rooms.capacity": { $gte: peopleCount },
      "rooms.availableDates": {
        $elemMatch: {
          from: { $lte: from },
          to: { $gte: to }
        }
      }
    },
    {
      $inc: { "rooms.$.capacity": -peopleCount }
    }
  );

  if (updateResult.matchedCount === 0) {
    throw new Error("Room not available for selected dates");
  }

  const hotel = await hotels.findOne(
    { _id: new ObjectId(hotelId) },
    { projection: { rooms: 1 } }
  );

  const room: any = hotel?.rooms.find((r: any) => r.roomId === roomId);
  if (!room) {
    throw new Error("Room not found");
  }


  const nights =
    (new Date(to).getTime() - new Date(from).getTime()) /
    (1000 * 60 * 60 * 24);

  const totalPrice = nights * room.price;

  const booking = {
    userId,
    hotelId: new ObjectId(hotelId),
    roomId,
    from,
    to,
    peopleCount,
    totalPrice,
    status: "CONFIRMED",
    createdAt: new Date()
  };

  const result = await bookings.insertOne(booking);

  return {
    bookingId: result.insertedId,
    ...booking
  };
};

// Get user bookings
export const getUserBookings = async (userId: string) => {
  const db = client.db("hotelBooking");
  const bookings = db.collection("bookings");

  return bookings
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
};

// Cancel Booking
export const cancelBooking = async (bookingId: string, userId: string) => {
  const db = client.db("hotelBooking");
  const bookings = db.collection("bookings");
  const hotels = db.collection("hotels");

  // Find Booking
  const booking = await bookings.findOne({
    _id: new ObjectId(bookingId),
    userId,
    status: "CONFIRMED"
  });

  if (!booking) {
    throw new Error("Booking not found or already cancelled");
  }

  await hotels.updateOne(
    {
      _id: booking.hotelId,
      "rooms.roomId": booking.roomId
    },
    {
      $inc: { "rooms.$.capacity": booking.peopleCount }
    }
  );

  // Booking cancel 
  await bookings.updateOne(
    { _id: booking._id },
    {
      $set: {
        status: "CANCELLED",
        cancelledAt: new Date()
      }
    }
  );
};
