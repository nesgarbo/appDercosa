import { Visita, VisitaData, VisitaPatch, VisitaQuery } from 'feathers-dercosa';
import {
  signalStore,
  type,
  withHooks,
} from '@ngrx/signals';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';
import { withCallState } from '@angular-architects/ngrx-toolkit';
import { withEntities } from '@ngrx/signals/entities';

export const VisitasStore = signalStore(
  withCallState(),
  withEntities<Visita>(),
  withFeathersDataService<
    'visita',
    Visita,
    VisitaData,
    VisitaQuery,
    VisitaPatch
  >({ servicePath: 'visita' }),
  withHooks(({ startEmitting }) => {
    return {
      onInit() {
        startEmitting();
      },
    };
  })
);
