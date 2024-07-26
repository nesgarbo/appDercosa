import {
  PdfGenerator,
  PdfGeneratorData,
  PdfGeneratorPatch,
  PdfGeneratorQuery,
} from 'feathers-dercosa';
import {
  signalStore,
  type,
  withHooks,
} from '@ngrx/signals';
import { withCallState } from '@angular-architects/ngrx-toolkit';
import { withEntities } from '@ngrx/signals/entities';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';

export const PdfGeneratorStore = signalStore(
  { providedIn: 'root' },
  withCallState(),
  withEntities<PdfGenerator>(),
  withFeathersDataService<
    'pdf-generator',
    PdfGenerator,
    PdfGeneratorData,
    PdfGeneratorQuery,
    PdfGeneratorPatch
  >({ servicePath: 'pdf-generator' }),
  withHooks(({ startEmitting, find }) => {
    return {
      onInit() {
        startEmitting();
        find();
      },
    };
  })
);
