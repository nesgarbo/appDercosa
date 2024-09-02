import { Route } from '@angular/router';
import { TestsComponent } from './tests-list/tests-list.component';

export default [
  {
    path: '',
    component: TestsComponent,
    children: [
      {
        path: 'new', // WARNING, put before :id path
        loadComponent: () =>
          import('./test-detail-dialog.component').then(
            m => m.TestDetailDialogComponent
          ),
        data: { operation: 'add' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./test-detail-dialog.component').then(
            m => m.TestDetailDialogComponent
          ),
        data: { operation: 'edit' },
      },
    ],
  },
] satisfies Route[];