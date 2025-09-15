export interface Reservation {
  id: number;
  name: string;
  location: string;
  nextAvailableTime: string;
  rating: number;
  imageUrl: string;
  driver: {
    name: string;
    photo: string;
    vehiclePlate: string;
    discount: string;
    discountCode: string;
  };
}
