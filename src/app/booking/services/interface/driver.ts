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
