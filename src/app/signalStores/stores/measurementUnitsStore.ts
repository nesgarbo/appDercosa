import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withHooks } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import {
  MeasurementUnit,
  MeasurementUnitData,
  MeasurementUnitPatch,
  MeasurementUnitQuery,
} from 'feathers-dercosa';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';

export const MeasurementUnitsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('measurement-units'),
  withEntities<MeasurementUnit>(),
  withFeathersDataService<
    'measurement-units',
    MeasurementUnit,
    MeasurementUnitData,
    MeasurementUnitQuery,
    MeasurementUnitPatch
  >({
    servicePath: 'measurement-units',
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
