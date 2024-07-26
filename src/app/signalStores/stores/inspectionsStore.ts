import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withHooks } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import {
  Inspection,
  InspectionData,
  InspectionPatch,
  InspectionQuery,
} from 'feathers-dercosa';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';

export const InspectionsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('inspections'),
  withEntities<Inspection>(),
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
