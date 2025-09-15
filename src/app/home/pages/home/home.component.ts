import { Component } from '@angular/core';
import {FooterComponent} from "../../components/footer/footer.component";
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent,
    ToolbarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{

  constructor(
    private router: Router
  ) {}

  GoToReservations(): void {
    // Redirige a la ruta /reservations cuando se hace clic en "Ver reservas"
    this.router.navigate(['/reservations']);
  }

}
