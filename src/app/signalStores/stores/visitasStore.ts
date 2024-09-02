import { withCallState } from '@angular-architects/ngrx-toolkit';
import { signalStore, withHooks } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { Visita, VisitaData, VisitaPatch, VisitaQuery } from 'feathers-dercosa';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';

export const VisitasStore = signalStore(
  { providedIn: 'root' },
  withCallState(),
  withEntities<Visita>(),
  withFeathersDataService<
    'visita',
    Visita,
    VisitaData,
    VisitaQuery,
    VisitaPatch
  >({ servicePath: 'visita' }),
  withHooks((store) => {
    return {
      onInit() {
        store.startEmitting();
        store.find();
      },
    };
  })
);
