import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withHooks } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { Test, TestData, TestPatch, TestQuery } from 'feathers-dercosa';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';

export const TestsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('tests'),
  withEntities<Test>(),
  withFeathersDataService<'tests', Test, TestData, TestQuery, TestPatch>({
    servicePath: 'tests',
  }),
  withHooks(({ startEmitting, find }) => {
    return {
      onInit() {
        startEmitting();
        find();
      },
    };
  })
);
