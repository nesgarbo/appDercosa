import { Route } from '@angular/router';
import { TestResultsComponent } from './test-results-list/test-results-list.component';

export default [
  {
    path: '',
    component: TestResultsComponent,
    children: [
      {
        path: 'new', // WARNING, put before :id path
        loadComponent: () =>
          import('./test-result-detail-dialog.component').then(
            m => m.TestResultDetailDialogComponent
          ),
        data: { operation: 'add' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./test-result-detail-dialog.component').then(
            m => m.TestResultDetailDialogComponent
          ),
        data: { operation: 'edit' },
      },
    ],
  },
] satisfies Route[];