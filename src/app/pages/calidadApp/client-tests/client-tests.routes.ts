import { Route } from '@angular/router';
import { ClientTestsComponent } from './client-tests-list/client-tests-list.component';

export default [
  {
    path: '',
    component: ClientTestsComponent,
    children: [
      {
        path: 'new', // WARNING, put before :id path
        loadComponent: () =>
          import('./client-tests-detail-dialog.component').then(
            m => m.ClientTestDetailDialogComponent
          ),
        data: { operation: 'add' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./client-tests-detail-dialog.component').then(
            m => m.ClientTestDetailDialogComponent
          ),
        data: { operation: 'edit' },
      },
    ],
  },
] satisfies Route[];