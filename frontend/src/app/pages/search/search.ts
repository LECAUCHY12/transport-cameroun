import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

interface SearchForm {
  origin: string;
  destination: string;
  departureDate: Date | null;
  returnDate: Date | null;
  transportType: string;
  passengers: string;
  maxPrice: number;
  airConditioned: boolean;
  wifi: boolean;
  luggageIncluded: boolean;
}

interface SearchResult {
  id: string;
  origin: string;
  destination: string;
  price: number;
  duration: string;
  departureTime: string;
  type: string;
  airConditioned: boolean;
  wifi: boolean;
  luggageIncluded: boolean;
  rating: number;
  reviewsCount: number;
  driverId: string;
  availableSeats: number;
}

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search {

  // Formulaire de recherche
  searchForm: SearchForm = {
    origin: '',
    destination: '',
    departureDate: null,
    returnDate: null,
    transportType: 'all',
    passengers: '1',
    maxPrice: 10000,
    airConditioned: false,
    wifi: false,
    luggageIncluded: false
  };

  // État de la recherche
  isSearching = false;
  hasSearched = false;
  sortBy = 'price';

  // Résultats de recherche
  searchResults = signal<SearchResult[]>([]);

  constructor(private router: Router) {}

  // Fonction de recherche
  onSearch() {
    if (!this.searchForm.origin || !this.searchForm.destination || !this.searchForm.departureDate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isSearching = true;
    this.hasSearched = true;

    // Simulation d'une recherche (remplacer par appel API)
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          origin: this.searchForm.origin,
          destination: this.searchForm.destination,
          price: 3500,
          duration: '4h 30min',
          departureTime: '08:00',
          type: 'bus',
          airConditioned: true,
          wifi: true,
          luggageIncluded: true,
          rating: 4.5,
          reviewsCount: 120,
          driverId: 'driver-1',
          availableSeats: 15
        },
        {
          id: '2',
          origin: this.searchForm.origin,
          destination: this.searchForm.destination,
          price: 2800,
          duration: '5h 15min',
          departureTime: '06:30',
          type: 'taxi',
          airConditioned: false,
          wifi: false,
          luggageIncluded: true,
          rating: 4.2,
          reviewsCount: 85,
          driverId: 'driver-2',
          availableSeats: 4
        },
        {
          id: '3',
          origin: this.searchForm.origin,
          destination: this.searchForm.destination,
          price: 4200,
          duration: '4h 00min',
          departureTime: '14:00',
          type: 'bus',
          airConditioned: true,
          wifi: true,
          luggageIncluded: true,
          rating: 4.8,
          reviewsCount: 200,
          driverId: 'driver-3',
          availableSeats: 8
        }
      ];

      // Filtrer par prix
      const filteredResults = mockResults.filter(result => 
        result.price <= this.searchForm.maxPrice
      );

      this.searchResults.set(filteredResults);
      this.isSearching = false;
    }, 1500);
  }

  // Échanger les villes
  swapCities() {
    const temp = this.searchForm.origin;
    this.searchForm.origin = this.searchForm.destination;
    this.searchForm.destination = temp;
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.searchForm = {
      origin: '',
      destination: '',
      departureDate: null,
      returnDate: null,
      transportType: 'all',
      passengers: '1',
      maxPrice: 10000,
      airConditioned: false,
      wifi: false,
      luggageIncluded: false
    };
    this.searchResults.set([]);
    this.hasSearched = false;
  }

  // Formater le prix
  formatPrice(value: number): string {
    return `${value.toLocaleString()} FCFA`;
  }

  // Trier les résultats
  sortResults() {
    const results = [...this.searchResults()];
    
    switch (this.sortBy) {
      case 'price':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'duration':
        results.sort((a, b) => this.parseDuration(a.duration) - this.parseDuration(b.duration));
        break;
      case 'departure':
        results.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    this.searchResults.set(results);
  }

  // Parser la durée pour le tri
  private parseDuration(duration: string): number {
    const matches = duration.match(/(\d+)h\s*(\d+)?/);
    if (matches) {
      const hours = parseInt(matches[1]);
      const minutes = parseInt(matches[2] || '0');
      return hours * 60 + minutes;
    }
    return 0;
  }

  // Obtenir l'icône du transport
  getTransportIcon(type: string): string {
    switch (type) {
      case 'bus': return 'directions_bus';
      case 'taxi': return 'local_taxi';
      case 'moto': return 'motorcycle';
      case 'car': return 'directions_car';
      default: return 'commute';
    }
  }

  // Obtenir le label du transport
  getTransportLabel(type: string): string {
    switch (type) {
      case 'bus': return 'Bus';
      case 'taxi': return 'Taxi-brousse';
      case 'moto': return 'Moto-taxi';
      case 'car': return 'Voiture';
      default: return 'Transport';
    }
  }

  // Voir les détails
  viewDetails(result: SearchResult) {
    console.log('Voir détails:', result);
    // TODO: Naviguer vers page de détails
    // this.router.navigate(['/transport', result.id]);
  }

  // Réserver un transport
  bookTransport(result: SearchResult) {
    console.log('Réserver transport:', result);
    // TODO: Naviguer vers page de réservation
    // this.router.navigate(['/booking', result.id]);
  }
}
