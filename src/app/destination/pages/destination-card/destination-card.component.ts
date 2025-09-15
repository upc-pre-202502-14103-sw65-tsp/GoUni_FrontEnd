import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {ServiceDestination} from "../../services/interfaces/destinationApi";
import {DestinationApiService} from "../../services/destination-api.service";

@Component({
  selector: 'app-destination-card',
  standalone: true,
    imports: [
        NgForOf
    ],
  templateUrl: './destination-card.component.html',
  styleUrl: './destination-card.component.css'
})
export class DestinationCardComponent implements OnInit{

  destinations: ServiceDestination[] = [];

  constructor(private destinationApiService: DestinationApiService) { }

  ngOnInit(): void {
    this.destinationApiService.getDestinations().subscribe(data => {
      this.destinations = data;
    });
  }

  //Metodo para manejar la selccion de un destino
  selectDestination(destination: ServiceDestination): void {
    console.log(`Destination selected: ${destination.name}`);
  }
}
