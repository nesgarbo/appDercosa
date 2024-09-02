import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withHooks } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import {
  Cliente,
  ClienteData,
  ClientePatch,
  ClienteQuery,
} from 'feathers-dercosa';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';

export const ClientsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('cliente'),
  withEntities<Cliente>(),
  withFeathersDataService<
    'cliente',
    Cliente,
    ClienteData,
    ClienteQuery,
    ClientePatch
  >({ servicePath: 'cliente' }),
  withHooks(({ startEmitting }) => {
    return {
      onInit() {
        startEmitting();
      },
    };
  })
);
