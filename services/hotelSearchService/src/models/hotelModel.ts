export interface Room {
  roomId: string;
  type: string;
  capacity: number;
  price: number;
  availableDates: {
    from: string;
    to: string;
  }[];
}

export interface Hotel {
  _id: string;
  name: string;
  location: string;
  rooms: Room[];
}
