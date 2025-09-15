import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

import {Map} from 'mapbox-gl';

@Component({
  standalone: true,
  imports: [],
  templateUrl: './full-screen-page.component.html',
  styleUrl: './full-screen-page.component.css'
})
export class FullScreenPageComponent implements AfterViewInit{

  //Referencia al div con la directiva #map
  @ViewChild('map') divMap?: ElementRef;

  ngAfterViewInit() {

    if(!this.divMap) throw 'Elemento no encontrado';

    const map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-76.9637, -12.1048], // starting position [lng, lat]
      zoom: 16, // starting zoom
    });
  }
}
