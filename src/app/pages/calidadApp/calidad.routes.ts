import { Route } from '@angular/router';

export default [
  {
    path: 'crear-inspeccion',
    loadComponent: () =>
      import('./crear-inspeccion/crear-inspeccion.component').then((m) => m.CrearInspeccionComponent),
  },
  {
    path: 'inspecciones',
    loadComponent: () =>
      import('./inspecciones/inspecciones.component').then((m) => m.InspeccionesComponent),
  },
  {
    path: '',
    redirectTo: 'inspecciones',
    pathMatch: 'full',
  },
] satisfies Route[];
