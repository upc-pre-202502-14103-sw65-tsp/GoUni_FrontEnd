import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ServiceDestination} from "./interfaces/destinationApi";

@Injectable({
  providedIn: 'root'
})
export class DestinationApiService {

  //Aqui va ir el URL del JSON-SERVER
  private apiUrl = 'https://deploynew.onrender.com/destinations';

  constructor(private http: HttpClient) { }

  //Metodo para obtener todos los destinos
  getDestinations(): Observable<ServiceDestination[]> {
    return this.http.get<ServiceDestination[]>(this.apiUrl);
  }

  //Metodo para obtener los destinos por nombre por ID
  getDestinationById(id: number): Observable<ServiceDestination> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ServiceDestination>(url);
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
