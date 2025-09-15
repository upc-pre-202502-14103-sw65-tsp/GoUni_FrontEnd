import {Driver} from "../../../booking/services/interface/driver";

export interface  ServiceDestination {
  id: number;
  name: string;
  location: string;
  nextAvailableTime: string;
  rating: number;
  imageUrl: string;
  driver: Driver;
}


