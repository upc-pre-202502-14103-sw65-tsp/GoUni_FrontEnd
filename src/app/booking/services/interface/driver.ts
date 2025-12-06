export interface Driver {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePhotoUrl: string;
  dniNumber: string;
  licenseNumber: string;
  driverDescription: string;
  roles: string[];
  // Campos adicionales para compatibilidad con la vista actual
  name?: string;
  photo?: string;
  vehiclePlate?: string;
  discount?: string;
  discountCode?: string;
}

export interface CreateRatingRequest {
  rideId: string;
  score: number;
  comment: string;
}

export interface Rating {
  id: string;
  rideId: string;
  driverId: string;
  driverName: string;
  passengerId: string;
  passengerName: string;
  score: number;
  comment: string;
  createdAt: string;
}

export interface DriverRatingStats {
  driverId: string;
  driverName: string;
  averageRating: number;
  totalRatings: number;
  recentRatings: Rating[];
}
