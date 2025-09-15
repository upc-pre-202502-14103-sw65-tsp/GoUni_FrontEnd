import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {MiniMapComponent} from "../../components/mini-map/mini-map.component";

interface University{
  title: string;
  description: string;
  lngLat: [number, number];
}

@Component({
  standalone: true,
  imports: [
    NgForOf,
    MiniMapComponent
  ],
  templateUrl: './properties-page.component.html',
  styleUrl: './properties-page.component.css'
})
export class PropertiesPageComponent {

  public universities: University[] = [
    {
      title: 'UPC Monterrico',
      description: 'Universidad Peruana de Ciencias Aplicadas',
      lngLat: [-76.9629, -12.1040]
    },
    {
      title: 'UPC San Miguel',
      description: 'Universidad Peruana de Ciencias Aplicadas',
      lngLat: [-77.0937, -12.0766]
    },
    {
      title: 'UPC Villa',
      description: 'Universidad Peruana de Ciencias Aplicadas',
      lngLat: [-77.0082, -12.1973]
    },
    {
      title: 'UPC San Isidro',
      description: 'Universidad Peruana de Ciencias Aplicadas',
      lngLat: [-77.0501, -12.0877]
    },
    {
      title: 'ULima',
      description: 'Universidad de Lima',
      lngLat: [-76.9708, -12.0850]
    }
  ];

}
