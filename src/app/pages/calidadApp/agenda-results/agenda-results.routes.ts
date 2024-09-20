import { Route } from '@angular/router';
import { AgendaResultPage } from './agenda-results.page';

export default [
  {
    path: '',
    component: AgendaResultPage,
    children: [
      {
        path: 'new', // WARNING, put before :id path
        loadComponent: () =>
          import('../test-results/test-result-detail-dialog.component').then(
            m => m.TestResultDetailDialogComponent
          ),
        data: { operation: 'add' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('../test-results/test-result-detail-dialog.component').then(
            m => m.TestResultDetailDialogComponent
          ),
        data: { operation: 'edit' },
      },
    ],
  },
] satisfies Route[];