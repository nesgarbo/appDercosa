import { withCallState } from '@angular-architects/ngrx-toolkit';
import { signalStore, withHooks } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { Operario, OperarioData, OperarioPatch, OperarioQuery } from 'feathers-dercosa';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';

export const OperariosStore = signalStore(
  { providedIn: 'root' },
  withCallState(),
  withEntities<Operario>(),
  withFeathersDataService<
    'operario',
    Operario,
    OperarioData,
    OperarioQuery,
    OperarioPatch
  >({ servicePath: 'operario' }),
  withHooks((store) => {
    return {
      onInit() {
        store.startEmitting();
        store.find();
      },
    };
  })
);
