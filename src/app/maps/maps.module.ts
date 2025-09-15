import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';

//Importamos mapbox
import mapboxgl from 'mapbox-gl';
(mapboxgl as any).accessToken = 'pk.eyJ1Ijoia2FpdG96ZXJvYiIsImEiOiJjbTFoZHIyc2swOTVsMnBxMmkzZGphcTN5In0.rFy4k0CtY9RwYtpTev7o1g';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MapsRoutingModule
  ]
})
export class MapsModule { }
