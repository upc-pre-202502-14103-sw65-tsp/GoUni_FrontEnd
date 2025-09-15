import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgForOf} from "@angular/common";

interface MenuItem{
  name: string;
  route: string;
}


@Component({
  selector: 'maps-side-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgForOf
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {

  public menuItems: MenuItem[] = [
    {name: 'FullScreen', route: '/maps/full-screen-map'},
    {name: 'ZoomRange', route: '/maps/zoom-range'},
    {name: 'Markers', route: '/maps/markers'},
    {name: 'University', route: '/maps/properties'},
    {name: 'Return', route: '/home'}
  ];
}
