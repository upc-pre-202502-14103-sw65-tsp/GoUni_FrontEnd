import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';

//Importamos mapbox
import mapboxgl from 'mapbox-gl';
(mapboxgl as any).accessToken = 'pk.eyJ1IjoiYW5nZWxwcm8iLCJhIjoiY21nMGMybGIxMGMwaDJpb2ptbzlsNXl6ciJ9.Oj3Js7CjwA3An5X0az1MIQ';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MapsRoutingModule
  ]
})
export class MapsModule { }
