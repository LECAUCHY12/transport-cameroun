import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface PopularRoute {
  origin: string;
  destination: string;
  price: number;
  duration: string;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  
  // Itinéraires populaires au Cameroun
  popularRoutes = signal<PopularRoute[]>([
    {
      origin: 'Douala',
      destination: 'Yaoundé',
      price: 3500,
      duration: '4h 30min'
    },
    {
      origin: 'Yaoundé',
      destination: 'Bafoussam',
      price: 2800,
      duration: '3h 45min'
    },
    {
      origin: 'Douala',
      destination: 'Bafoussam',
      price: 4200,
      duration: '5h 15min'
    },
    {
      origin: 'Yaoundé',
      destination: 'Garoua',
      price: 8500,
      duration: '12h 30min'
    },
    {
      origin: 'Douala',
      destination: 'Limbé',
      price: 1500,
      duration: '1h 45min'
    },
    {
      origin: 'Yaoundé',
      destination: 'Ebolowa',
      price: 2200,
      duration: '2h 30min'
    }
  ]);
}
