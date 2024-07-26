import { Route } from '@angular/router';

export default [
  {
    path: 'visitas',
    loadComponent: () =>
      import('./visitas/visitas.component').then((m) => m.VisitasComponent),
  },
  {
    path: 'sinFirmar',
    loadComponent: () =>
      import('./sin-firmar/sin-firmar.component').then(
        (m) => m.SinFirmarComponent
      ),
  },
  {
    path: '',
    redirectTo: 'visitas',
    pathMatch: 'full',
  },
] satisfies Route[];
