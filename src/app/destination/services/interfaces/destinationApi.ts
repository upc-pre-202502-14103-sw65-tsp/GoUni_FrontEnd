export interface StaticDriver {
  name: string;
  photo: string;
  vehiclePlate: string;
  discount: string;
  discountCode: string;
}

export interface  ServiceDestination {
  id: number;
  name: string;
  location: string;
  nextAvailableTime: string;
  rating: number;
  imageUrl: string;
  driver: StaticDriver;
}


