import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Map, Marker} from 'mapbox-gl';

@Component({
  selector: 'app-mini-map',
  standalone: true,
  imports: [],
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css'
})
export class MiniMapComponent {
  @Input() lngLat?: [number, number];
  @ViewChild('map') divMap?: ElementRef;


  ngAfterViewInit() {
    if( !this.divMap?.nativeElement ) throw "Map Div not found";
    if( !this.lngLat ) throw "LngLat can't be null";

    //map
    const map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat,
      zoom: 15,
      interactive: false
    });

    //marker
    new Marker()
      .setLngLat( this.lngLat )
      .addTo( map )

  }
}
