import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'estado',
    pathMatch: 'full',
  },
  {
    path: 'estado',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./estado/estado.component').then((m) => m.EstadoComponent),
      },
    ],
  },
];
