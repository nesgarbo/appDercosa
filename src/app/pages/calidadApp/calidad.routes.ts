import { Route } from '@angular/router';

export default [
  {
    path: 'tests',
    loadChildren: () => import('./tests/tests.routes'),
  },
  {
    path: 'agenda-results',
    loadChildren: () => import('./agenda-results/agenda-results.routes'),
  },
  {
    path: 'test-results',
    loadChildren: () => import('./test-results/test-results.routes'),
  },
  {
    path: 'client-tests',
    loadChildren: () => import('./client-tests/client-tests.routes'),
  },
  {
    path: '',
    redirectTo: 'agenda-results',
    pathMatch: 'full',
  },
] satisfies Route[];
