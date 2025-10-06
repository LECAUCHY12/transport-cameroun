import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

interface Booking {
  id: string;
  origin: string;
  destination: string;
  travelDate: Date;
  departureTime: string;
  transportType: string;
  passengers: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  driverName: string;
  driverPhone: string;
  seatNumbers?: string[];
  bookingDate: Date;
  paymentMethod: string;
  vehicleInfo?: string;
}

@Component({
  selector: 'app-bookings',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule
  ],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss'
})
export class Bookings {

  // Filtres
  selectedStatus = 'all';
  selectedPeriod = 'all';

  // Données des réservations
  allBookings = signal<Booking[]>([
    {
      id: 'BK001',
      origin: 'Douala',
      destination: 'Yaoundé',
      travelDate: new Date(2025, 9, 8), // 8 octobre 2025
      departureTime: '08:00',
      transportType: 'bus',
      passengers: 2,
      totalPrice: 7000,
      status: 'confirmed',
      driverName: 'Jean Mbarga',
      driverPhone: '+237678901234',
      seatNumbers: ['A12', 'A13'],
      bookingDate: new Date(2025, 9, 1),
      paymentMethod: 'Orange Money',
      vehicleInfo: 'Bus Mercedes - YAO 1234 CA'
    },
    {
      id: 'BK002',
      origin: 'Yaoundé',
      destination: 'Bafoussam',
      travelDate: new Date(2025, 9, 15),
      departureTime: '14:30',
      transportType: 'taxi',
      passengers: 1,
      totalPrice: 2800,
      status: 'pending',
      driverName: 'Paul Kouam',
      driverPhone: '+237699887766',
      bookingDate: new Date(2025, 9, 5),
      paymentMethod: 'MTN Mobile Money'
    },
    {
      id: 'BK003',
      origin: 'Douala',
      destination: 'Limbé',
      travelDate: new Date(2025, 8, 25), // 25 septembre (passé)
      departureTime: '10:00',
      transportType: 'car',
      passengers: 3,
      totalPrice: 4500,
      status: 'completed',
      driverName: 'Marie Talla',
      driverPhone: '+237655443322',
      seatNumbers: ['1', '2', '3'],
      bookingDate: new Date(2025, 8, 20),
      paymentMethod: 'Espèces'
    },
    {
      id: 'BK004',
      origin: 'Yaoundé',
      destination: 'Garoua',
      travelDate: new Date(2025, 8, 30), // 30 septembre (passé)
      departureTime: '06:00',
      transportType: 'bus',
      passengers: 1,
      totalPrice: 8500,
      status: 'cancelled',
      driverName: 'Ibrahim Souley',
      driverPhone: '+237612345678',
      bookingDate: new Date(2025, 8, 28),
      paymentMethod: 'Orange Money'
    }
  ]);

  // Réservations filtrées
  filteredBookings = signal<Booking[]>([]);

  constructor(private router: Router) {
    this.filterBookings();
  }

  // Statistiques
  getTotalBookings(): number {
    return this.allBookings().length;
  }

  getUpcomingBookings(): number {
    const now = new Date();
    return this.allBookings().filter(booking => 
      booking.travelDate > now && booking.status === 'confirmed'
    ).length;
  }

  getTotalSpent(): string {
    const total = this.allBookings()
      .filter(booking => booking.status !== 'cancelled')
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
    return total.toLocaleString();
  }

  // Filtrage
  filterBookings() {
    let filtered = [...this.allBookings()];

    // Filtrer par statut
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === this.selectedStatus);
    }

    // Filtrer par période
    const now = new Date();
    switch (this.selectedPeriod) {
      case 'upcoming':
        filtered = filtered.filter(booking => booking.travelDate > now);
        break;
      case 'past':
        filtered = filtered.filter(booking => booking.travelDate < now);
        break;
      case 'this-month':
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        filtered = filtered.filter(booking => 
          booking.travelDate.getMonth() === thisMonth && 
          booking.travelDate.getFullYear() === thisYear
        );
        break;
      case 'last-month':
        const lastMonth = now.getMonth() - 1;
        const lastMonthYear = lastMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
        const adjustedLastMonth = lastMonth < 0 ? 11 : lastMonth;
        filtered = filtered.filter(booking => 
          booking.travelDate.getMonth() === adjustedLastMonth && 
          booking.travelDate.getFullYear() === lastMonthYear
        );
        break;
    }

    // Trier par date de voyage (plus récent en premier)
    filtered.sort((a, b) => b.travelDate.getTime() - a.travelDate.getTime());

    this.filteredBookings.set(filtered);
  }

  // Utilitaires de formatage
  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' | undefined {
    switch (status) {
      case 'confirmed': return 'primary';
      case 'completed': return 'accent';
      case 'pending': return undefined;
      case 'cancelled': return 'warn';
      default: return undefined;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  }

  getTransportIcon(type: string): string {
    switch (type) {
      case 'bus': return 'directions_bus';
      case 'taxi': return 'local_taxi';
      case 'moto': return 'motorcycle';
      case 'car': return 'directions_car';
      default: return 'commute';
    }
  }

  getTransportLabel(type: string): string {
    switch (type) {
      case 'bus': return 'Bus';
      case 'taxi': return 'Taxi-brousse';
      case 'moto': return 'Moto-taxi';
      case 'car': return 'Voiture';
      default: return 'Transport';
    }
  }

  // Gestion du temps
  getTimeUntilTravel(booking: Booking): number {
    const now = new Date();
    const travelDateTime = new Date(booking.travelDate);
    const [hours, minutes] = booking.departureTime.split(':');
    travelDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    return travelDateTime.getTime() - now.getTime();
  }

  formatTimeUntil(booking: Booking): string {
    const timeMs = this.getTimeUntilTravel(booking);
    const days = Math.floor(timeMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}j ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes}min`;
    }
  }

  canCancel(booking: Booking): boolean {
    const timeUntil = this.getTimeUntilTravel(booking);
    // Permettre l'annulation jusqu'à 2 heures avant le départ
    return timeUntil > (2 * 60 * 60 * 1000);
  }

  // Actions
  viewDetails(booking: Booking) {
    console.log('Voir détails réservation:', booking);
    // TODO: Naviguer vers page de détails
    // this.router.navigate(['/booking', booking.id]);
  }

  contactDriver(booking: Booking) {
    console.log('Contacter conducteur:', booking.driverName, booking.driverPhone);
    // TODO: Ouvrir modal de contact ou lancer l'app téléphone
    alert(`Contacter ${booking.driverName} au ${booking.driverPhone}`);
  }

  downloadTicket(booking: Booking) {
    console.log('Télécharger billet:', booking);
    // TODO: Générer et télécharger le PDF du billet
    alert('Fonctionnalité de téléchargement à venir');
  }

  cancelBooking(booking: Booking) {
    if (!this.canCancel(booking)) {
      alert('Impossible d\'annuler cette réservation (moins de 2h avant le départ)');
      return;
    }

    const confirmed = confirm(`Êtes-vous sûr de vouloir annuler la réservation ${booking.id} ?`);
    if (confirmed) {
      // Mettre à jour le statut
      const bookings = this.allBookings();
      const index = bookings.findIndex(b => b.id === booking.id);
      if (index > -1) {
        bookings[index].status = 'cancelled';
        this.allBookings.set([...bookings]);
        this.filterBookings();
      }
      
      console.log('Réservation annulée:', booking.id);
      // TODO: Appel API pour annuler la réservation
    }
  }

  rebookTrip(booking: Booking) {
    console.log('Réserver à nouveau:', booking);
    // TODO: Pré-remplir le formulaire de recherche avec les données du voyage
    this.router.navigate(['/search'], {
      queryParams: {
        origin: booking.origin,
        destination: booking.destination,
        passengers: booking.passengers
      }
    });
  }
}
