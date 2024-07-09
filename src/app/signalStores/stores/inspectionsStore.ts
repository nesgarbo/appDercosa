import {
  Inspection,
  InspectionData,
  InspectionPatch,
  InspectionQuery,
} from 'feathers-dercosa';
import {
  signalStore,
  type,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';
import { withCallState } from '@angular-architects/ngrx-toolkit';
import { withEntities, setAllEntities } from '@ngrx/signals/entities';

export const InspectionsStore = signalStore(
  { providedIn: 'root' },
  withCallState(),
  withEntities({
    entity: type<Inspection>(),
  }),
  withFeathersDataService<
    'inspections',
    Inspection,
    InspectionData,
    InspectionQuery,
    InspectionPatch
  >({ servicePath: 'inspections' }),
  withHooks(({ startEmitting, find }) => {
    return {
      onInit() {
        startEmitting();
        find();
      },
    };
  })
);
