import {Component, ElementRef, ViewChild} from '@angular/core';
import {LngLat, Map, Marker} from "mapbox-gl";
import {NgForOf, NgStyle} from "@angular/common";

interface MarkerAndColor{
  color: string;
  marker: Marker;
}
interface PlainMarket{
  color: string;
  lngLat: number[];
}

@Component({
  selector: 'markers-page',
  standalone: true,
  imports: [
    NgForOf,
    NgStyle
  ],
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent {

  //Referencia al div con la directiva #map
  @ViewChild('map') divMap?: ElementRef;

  public markers: MarkerAndColor[] = [];
  //Propiedad para el zoom
  public zoom: number = 16;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-76.9629, -12.1040);

  //Constructor para el pipe DecimalPipe para el zoom en el HTML del componente
  ngAfterViewInit() {

    if(!this.divMap) throw 'Elemento no encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });

    this.readFromLocalStorage()

    // Creamos un marcador en el mapa con las coordenadas actuales
    // const marketHtml = document.createElement('div');
    // marketHtml.innerHTML = 'UPC Monterrrico';

    //#region Marcadores
    const marker = new Marker({
        color: 'red',
        // element: marketHtml
      }
    )
      .setLngLat(this.currentLngLat)
      .addTo(this.map);

  }

  //Función para agregar un marcador al mapa al hacer clic en el botón Agregar
  createMarker() {
    if (!this.map) throw 'Mapa no encontrado';

    //Generamos un color aleatorio
    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const lngLat = this.map.getCenter();
    this.addMarker(lngLat, color);
  }

  //Función para escuchar el mapa al momento de hacer clic en Agregar
  addMarker(lngLat: LngLat, color: string) {
    if (!this.map) throw 'Mapa no encontrado';

    const marker = new Marker({
      color: color,
      draggable: true
    })
      .setLngLat(lngLat)
      .addTo(this.map);

    this.markers.push({
      color,
      marker
    });

    this.saveToLocalStorage()
    //dragend
    marker.on('dragend', () => {
      this.saveToLocalStorage();
    });

  }

  deleteMarket(index: number) {
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
    // Para pruebas de eliminación de marcadores en beta
    /*this.deleteMarket(this.markers.length - 1);*/
  }

  //Función para el zoom. Es decir, ir de un marcador a otro
  flyTo( marker: Marker ) {

    this.map?.flyTo({
      zoom: 16,
      center: marker.getLngLat()
    });
  }

  saveToLocalStorage() {
    const plainMarkers: PlainMarket[] = this.markers.map( m => {
      return {
        color: m.color,
        lngLat: m.marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers));
  }

  readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkets = JSON.parse(plainMarkersString) as PlainMarket[];

    plainMarkets.forEach( pm => {
      const {color, lngLat} = pm;
      const [lng, lat] = lngLat;
      this.addMarker(new LngLat(lng, lat), color);
    });
  }


}
