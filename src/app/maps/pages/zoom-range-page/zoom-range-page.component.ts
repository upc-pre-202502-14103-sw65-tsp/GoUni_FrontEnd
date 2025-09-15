import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {LngLat, Map} from "mapbox-gl";
import {DecimalPipe} from "@angular/common";

@Component({
  standalone: true,
  imports: [
    DecimalPipe
  ],
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css'
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy{

  //Referencia al div con la directiva #map
  @ViewChild('map') divMap?: ElementRef;

  //Propiedad para el zoom
  public zoom: number = 16;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-76.9637, -12.1048);

  //Constructor para el pipe DecimalPipe para el zoom en el HTML del componente
  ngAfterViewInit() {

    if(!this.divMap) throw 'Elemento no encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });

    this.mapListener();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    // this.map?.off('zoom', () => {});
    // this.map?.off('zoomend', () => {});
    // this.map?.off('move', () => {});
  }


  //Función para escuchar el mapa
  mapListener() {
    if (!this.map) throw 'Mapa no encontrado';

    //Evento para el zoom
    this.map.on('zoom', (ev) => {
      this.zoom = this.map!.getZoom();
    });

    //Evento para el zoom máximo
    this.map.on('zoomend', (ev) => {
      if (this.map!.getZoom() < 18) return;
      this.map!.zoomTo(18);
    });

    //Evento para el movimiento del mapa
    this.map.on('move', () => {
      this.currentLngLat = this.map!.getCenter();
      //Para pruebas de estracción de datos independientes
      //const {lng, lat} = this.currentLngLat;
      //console.log({lng, lat});
    });
  }

  //Funciones para el zoom. Es decir, acercar el zoom
  zoomIn() {
    this.map?.zoomIn();
  }

  //Funciones para el zoom out. Es decir, alejar el zoom
  zoomOut() {
    this.map?.zoomOut();
  }

  //Recibir el valor del zoom
  zoomChanged(value: string) {
    this.zoom = Number(value);
    this.map?.zoomTo(this.zoom);
  }
}
