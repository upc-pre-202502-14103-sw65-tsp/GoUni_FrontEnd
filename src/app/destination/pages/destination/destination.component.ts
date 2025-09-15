import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {ServiceDestination} from "../../services/interfaces/destinationApi";
import {DestinationApiService} from "../../services/destination-api.service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {ToolbarComponent} from "../../../home/components/toolbar/toolbar.component";

//Nota
//En este caso, voy a definir cada para de mi linea para que se vea mejor
//y lo pueda modificar mas adelante. Attentamente, Kaito.

@Component({
  selector: 'app-destination',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    ToolbarComponent
  ],
  templateUrl: './destination.component.html',
  styleUrl: './destination.component.css'
})
export class DestinationComponent implements OnInit{
  destinations: ServiceDestination[] = [];

  //Servicio de Filtrado
  filteredDestinations: ServiceDestination[] = [];
  //Variable para almacenar el término de búsqueda
  searchTerm: string = '';
  //limitar la cantidad visible de destinos
  visibleDestinations: number = 6;  //En este caso solo se mostrara 6 destinos
  currentPage: number = 0;  // Página actual

  constructor(
    private destinationApiService: DestinationApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.destinationApiService.getDestinations().subscribe(data => {
      this.destinations = data;
      this.filteredDestinations = data;
      this.filteredDestinations = data.slice(0, this.visibleDestinations);  //Mostrar solo los primeros 6

    });
  }

  // Método para filtrar los destinos mientras se escribe en el campo de búsqueda
  filterDestinations(): void {
    if (this.searchTerm.trim() === '') {
      this.updateVisibleDestinations();
    } else {
      const filtered = this.destinations.filter(destination =>
        destination.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.filteredDestinations = filtered.slice(this.currentPage * this.visibleDestinations, (this.currentPage + 1) * this.visibleDestinations);
    }
  }
  // Método para actualizar los destinos visibles en función de la página actual
  updateVisibleDestinations(): void {
    const start = this.currentPage * this.visibleDestinations;
    const end = (this.currentPage + 1) * this.visibleDestinations;
    this.filteredDestinations = this.destinations.slice(start, end);
  }
  // Método para avanzar a la siguiente página
  nextPage(): void {
    if ((this.currentPage + 1) * this.visibleDestinations < this.destinations.length) {
      this.currentPage++;
      this.updateVisibleDestinations();
    }
  }

  // Método para retroceder a la página anterior
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateVisibleDestinations();
    }
  }


  //Metodo para manejar la selccion de un destino
  selectDestination(destination: ServiceDestination): void {
    console.log(`Destination selected: ${destination.name}`);
  }

  // Método para navegar al componente de reserva con el ID del destino
  goToBooking(id: number): void {
    this.router.navigate([`/booking`, id]);
  }
}
