import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search').then(m => m.Search)
  },
  {
    path: 'bookings',
    loadComponent: () => import('./pages/bookings/bookings').then(m => m.Bookings)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.Profile)
  },
  // TODO: Routes d'authentification (à créer)
  // {
  //   path: 'login',
  //   loadComponent: () => import('./pages/auth/login/login').then(m => m.Login)
  // },
  // {
  //   path: 'register',
  //   loadComponent: () => import('./pages/auth/register/register').then(m => m.Register)
  // },
  // TODO: Routes conducteur (à créer)  
  // {
  //   path: 'driver',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       loadComponent: () => import('./pages/driver/dashboard/dashboard').then(m => m.Dashboard)
  //     },
  //     {
  //       path: 'vehicle',
  //       loadComponent: () => import('./pages/driver/vehicle/vehicle').then(m => m.Vehicle)
  //     },
  //     {
  //       path: '',
  //       redirectTo: 'dashboard',
  //       pathMatch: 'full'
  //     }
  //   ]
  // },
  // Route de redirection par défaut
  {
    path: '**',
    redirectTo: '/home'
  }
];
