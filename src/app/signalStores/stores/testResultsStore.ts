import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withComputed, withHooks } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import {
  TestResult,
  TestResultData,
  TestResultPatch,
  TestResultQuery,
} from 'feathers-dercosa';
import { withFeathersDataService } from '../features/with-feathers-data/with-feathers-data-service';
import { computed } from '@angular/core';
import { TestResultViewModel } from 'src/app/shared/test-result';

export const TestResultsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('test-results'),
  withEntities<TestResult>(),
  withFeathersDataService<
    'test-results',
    TestResult,
    TestResultData,
    TestResultQuery,
    TestResultPatch
  >({ servicePath: 'test-results' }),
  withComputed(({ entities }) => {
    return {
      planningEvents: computed<TestResultViewModel[]>(() =>
        entities()
          .filter((testResult) => testResult.result !== undefined)
          .map((testResult) => ({
            id: testResult.id,
            partida: testResult.partida,
            pedido: testResult.pedido,
            linea: testResult.linea,
            clientTest: testResult.clientTest,
            result: testResult.result || testResult.booleanResult!,
            date: new Date( testResult.updatedAt || testResult.createdAt!),
            isAllDay: false,
            backgroundColor:
             (testResult.result ? (testResult.result ?? 0) > testResult.clientTest.clientMax ||
              (testResult.result ?? 0) < testResult.clientTest.clientMin: testResult.booleanResult !== testResult.clientTest.booleanOkValue)
                ? 'red'
                : 'green',
            textColor: '#fff',
          }))
      ),
    };
  }),
  withHooks(({ startEmitting, find }) => {
    return {
      onInit() {
        startEmitting();
        find({
          query: {
            $paginate: 'false',
          },
        });
      },
    };
  })
);
