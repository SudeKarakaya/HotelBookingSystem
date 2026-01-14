export type LoginResponse = {
  token: string; // JWT
  user?: {
    sub?: string;
    username?: string;
    role?: string; // ADMIN / USER
  };
};

export type HotelRoom = {
  roomId: string;
  capacity: number;
  price?: number;
  finalPrice?: number;
  originalPrice?: number;
};

export type Hotel = {
  _id: string;
  name: string;
  location: string;
  rooms: HotelRoom[];
};

export type Booking = {
  _id?: string;
  userId: string;
  hotelId: string;
  roomId: string;
  from: string;
  to: string;
  peopleCount: number;
  totalPrice?: number;
  status?: "CONFIRMED" | "CANCELLED";
  createdAt?: string;
};

export type NotificationItem = {
  _id?: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type MlPredictRequest = {
  season: number; 
  capacity: number;
};

export type MlPredictResponse = {
  predicted_price: number;
};
