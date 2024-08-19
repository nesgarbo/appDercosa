import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withHooks } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import {
  ClientTest,
  ClientTestData,
  ClientTestPatch,
  ClientTestQuery,
} from 'feathers-dercosa';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';

export const ClientTestsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('clientTests'),
  withEntities<ClientTest>(),
  withFeathersDataService<
    'client-tests',
    ClientTest,
    ClientTestData,
    ClientTestQuery,
    ClientTestPatch
  >({ servicePath: 'client-tests' }),
  withHooks(({ startEmitting, find }) => {
    return {
      onInit() {
        startEmitting();
        find();
      },
    };
  })
);
