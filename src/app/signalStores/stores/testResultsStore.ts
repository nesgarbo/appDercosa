import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withHooks } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import {
  TestResult,
  TestResultData,
  TestResultPatch,
  TestResultQuery,
} from 'feathers-dercosa';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';

export const TestResultsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('testResults'),
  withEntities<TestResult>(),
  withFeathersDataService<
    'test-results',
    TestResult,
    TestResultData,
    TestResultQuery,
    TestResultPatch
  >({ servicePath: 'test-results' }),
  withHooks(({ startEmitting, find }) => {
    return {
      onInit() {
        startEmitting();
        find();
      },
    };
  })
);
