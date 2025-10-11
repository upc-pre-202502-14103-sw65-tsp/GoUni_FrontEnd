import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {ServiceDestination, StaticDriver} from "./interfaces/destinationApi";
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DestinationApiService {

  //Aqui va ir el URL del JSON-SERVER
  private apiUrl = `${environment.backendUrl}/destinations`;

  // Datos estáticos de destinos
  private staticDestinations: ServiceDestination[] = [
    {
      id: 1,
      name: "UPC - San Miguel",
      location: "San Miguel",
      nextAvailableTime: "15:30",
      rating: 4.5,
      imageUrl: "https://www.upc.edu.pe/nosotros/campus/campus-san-miguel/img/frontis_campus.jpg",
      driver: {
        name: "Carla Muñoz",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "A1B-234",
        discount: "10%",
        discountCode: "carla-munoz"
      }
    },
    {
      id: 2,
      name: "UPC - Villa",
      location: "Villa",
      nextAvailableTime: "16:00",
      rating: 4.7,
      imageUrl: "https://www.upc.edu.pe/nosotros/campus/campus-villa/img/villa-1.jpg",
      driver: {
        name: "Luis Ramirez",
        photo: "https://plus.unsplash.com/premium_photo-1672907031609-16b4d3db8bc6?q=80&w=2630&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "B2C-567",
        discount: "15%",
        discountCode: "luis-ramirez"
      }
    },
    {
      id: 3,
      name: "UPC - Monterrico",
      location: "Monterrico",
      nextAvailableTime: "17:00",
      rating: 4.6,
      imageUrl: "https://www.upc.edu.pe/nosotros/campus/campus-monterrico/img/monterrico-1.jpg",
      driver: {
        name: "José Morales",
        photo: "https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "C3D-890",
        discount: "5%",
        discountCode: "jose-morales"
      }
    },
    {
      id: 4,
      name: "USIL - Magdalena",
      location: "Magdalena",
      nextAvailableTime: "13:30",
      rating: 4.5,
      imageUrl: "https://lh3.googleusercontent.com/p/AF1QipPQCeDubX0cif25vlhPKEG_v5mqanib8HVqqLYz=s1360-w1360-h1020",
      driver: {
        name: "Ana Gutierrez",
        photo: "https://plus.unsplash.com/premium_photo-1664541336896-b3d5f7dec9a3?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "D4E-123",
        discount: "12%",
        discountCode: "ana-gutierrez"
      }
    },
    {
      id: 5,
      name: "San Isidro - UPC",
      location: "San Isidro",
      nextAvailableTime: "12:30",
      rating: 4.5,
      imageUrl: "https://www.upc.edu.pe/nosotros/campus/campus-san-isidro/img/campus-si-vista-frontal.jpg",
      driver: {
        name: "María Vargas",
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2722&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "E5F-234",
        discount: "8%",
        discountCode: "maria-vargas"
      }
    },
    {
      id: 6,
      name: "UPN - San Miguel",
      location: "San Miguel",
      nextAvailableTime: "17:30",
      rating: 4.5,
      imageUrl: "https://lh3.googleusercontent.com/p/AF1QipMhyUwbPsqOipVl6iGaRi6JYM2GPMQzrmx6s32D=s1360-w1360-h1020",
      driver: {
        name: "Fernando Córdova",
        photo: "https://plus.unsplash.com/premium_photo-1683134080778-aaa686741d0a?q=80&w=2784&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "F6G-567",
        discount: "10%",
        discountCode: "fernando-cordova"
      }
    },
    {
      id: 7,
      name: "UPN - Los Olivos",
      location: "Los Olivos",
      nextAvailableTime: "14:00",
      rating: 4.3,
      imageUrl: "https://lh3.googleusercontent.com/p/AF1QipP7ux79wENe4D9OUbsjVJkwvLkm3GXK2CrvwqJB=s1360-w1360-h1020",
      driver: {
        name: "Luis Sanchez",
        photo: "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "G7H-890",
        discount: "7%",
        discountCode: "luis-sanchez"
      }
    },
    {
      id: 8,
      name: "UTP - Lima Centro",
      location: "Lima Centro",
      nextAvailableTime: "13:00",
      rating: 4.4,
      imageUrl: "https://lh3.googleusercontent.com/p/AF1QipMvg0cM0l4HyGVMYlegPjF_bKgRSr6MpVcY4Nyl=s1360-w1360-h1020",
      driver: {
        name: "Carlos Palacios",
        photo: "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "H8I-123",
        discount: "10%",
        discountCode: "carlos-palacios"
      }
    },
    {
      id: 9,
      name: "UTP - San Juan de Lurigancho",
      location: "San Juan de Lurigancho",
      nextAvailableTime: "12:00",
      rating: 4.2,
      imageUrl: "https://lh3.googleusercontent.com/p/AF1QipMBrv3GWR-yVxj83kXTXx5JVqfsWzJAPSf_DGAm=s1360-w1360-h1020",
      driver: {
        name: "Andrea Rodríguez",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D0",
        vehiclePlate: "I9J-234",
        discount: "5%",
        discountCode: "andrea-rodriguez"
      }
    },
    {
      id: 10,
      name: "UTP - San Isidro",
      location: "San Isidro",
      nextAvailableTime: "14:30",
      rating: 4.3,
      imageUrl: "https://lh3.googleusercontent.com/p/AF1QipMSj0i13LxVxWlzls7SvO6l3p94oOelShE1IsxF=s1360-w1360-h1020",
      driver: {
        name: "Juan Perez",
        photo: "https://plus.unsplash.com/premium_photo-1689632031083-518b012767a4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "J1K-567",
        discount: "8%",
        discountCode: "juan-perez"
      }
    },
    {
      id: 11,
      name: "ESAN",
      location: "Surco",
      nextAvailableTime: "15:00",
      rating: 4.8,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipPoGmIitZvH6_x3r0DdcENEJYXyKhXULIVvD9QT=w408-h306-k-no",
      driver: {
        name: "Diego Ramírez",
        photo: "https://plus.unsplash.com/premium_photo-1688891564708-9b2247085923?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "K2L-890",
        discount: "15%",
        discountCode: "diego-ramirez"
      }
    },
    {
      id: 12,
      name: "ULIMA",
      location: "Monterrico",
      nextAvailableTime: "12:30",
      rating: 4.7,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMlTl5dKrCx0IjEsSilTngGBmwV4xB35rgLt0OR=w408-h306-k-no",
      driver: {
        name: "Pablo Quintana",
        photo: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "L3M-123",
        discount: "5%",
        discountCode: "pablo-quintana"
      }
    },
    {
      id: 13,
      name: "PUCP",
      location: "San Miguel",
      nextAvailableTime: "13:30",
      rating: 4.9,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipNkLfSEJM7yi91Y6chewBLKBgDjx1ugz3JEDQCL=w408-h272-k-no",
      driver: {
        name: "Lucía Fernández",
        photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2459&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "M4N-234",
        discount: "12%",
        discountCode: "lucia-fernandez"
      }
    },
    {
      id: 14,
      name: "UTEC",
      location: "Barranco",
      nextAvailableTime: "11:30",
      rating: 4.6,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMxHAHAnD1XeQe_N4xiGhFmNcbxZoLPaKEcJkoW=w408-h272-k-no",
      driver: {
        name: "Jorge Silva",
        photo: "https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "N5O-567",
        discount: "10%",
        discountCode: "jorge-silva"
      }
    },
    {
      id: 15,
      name: "Universidad de Lima",
      location: "Monterrico",
      nextAvailableTime: "12:45",
      rating: 4.6,
      imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMlTl5dKrCx0IjEsSilTngGBmwV4xB35rgLt0OR=w408-h306-k-no",
      driver: {
        name: "Ana Salas",
        photo: "https://plus.unsplash.com/premium_photo-1688350808212-4e6908a03925?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "O6P-890",
        discount: "5%",
        discountCode: "ana-salas"
      }
    },
    {
      id: 16,
      name: "Universidad Ricardo Palma",
      location: "Santiago de Surco",
      nextAvailableTime: "15:45",
      rating: 4.2,
      imageUrl: "https://lh3.googleusercontent.com/p/AF1QipMRL3ltAX9cwFUhi2Q8tk-srKMxlHWyYQ0GQ-JM=s1360-w1360-h1020",
      driver: {
        name: "Daniela Soto",
        photo: "https://plus.unsplash.com/premium_photo-1690086519096-0594592709d3?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        vehiclePlate: "P7Q-123",
        discount: "7%",
        discountCode: "daniela-soto"
      }
    }
  ];

  constructor(private http: HttpClient) { }

  //Metodo para obtener todos los destinos
  getDestinations(): Observable<ServiceDestination[]> {
    return of(this.staticDestinations);
  }

  //Metodo para obtener los destinos por nombre por ID
  getDestinationById(id: number): Observable<ServiceDestination> {
    const destination = this.staticDestinations.find(d => d.id === id);
    if (destination) {
      return of(destination);
    }
    throw new Error(`Destination with id ${id} not found`);
  }

  //Metodo para agregar un nuevo destino (en caso de necesitarlo)
  addDestination(destination: ServiceDestination): Observable<ServiceDestination> {
    return this.http.post<ServiceDestination>(this.apiUrl, destination);
  }

  //Metodo para actualizar un destino (en caso de necesitarlo)
  updateDestination(destination: ServiceDestination): Observable<ServiceDestination> {
    const url = `${this.apiUrl}/${destination.id}`;
    return this.http.put<ServiceDestination>(url, destination);
  }

  //Metodo para eliminar un destino (en caso de necesitarlo)
  deleteDestination(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
