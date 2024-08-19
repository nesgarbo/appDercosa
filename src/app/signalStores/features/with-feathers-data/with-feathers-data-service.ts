import {
  Entity,
  getCallStateKeys,
  setError,
  setLoaded,
  setLoading,
  withDevtools,
} from '@angular-architects/ngrx-toolkit';
import { Signal, computed, inject } from '@angular/core';
import {
  Paginated,
  PaginationParams,
  Params,
  Query as Q,
} from '@feathersjs/feathers';
import {
  SignalStoreFeature,
  StateSignal,
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import {
  EntityState,
  EntityId,
  addEntity,
  removeEntities,
  removeEntity,
  setAllEntities,
  setEntities,
  setEntity,
} from '@ngrx/signals/entities';

import { ServiceTypes } from 'feathers-dercosa';

import { getFeathersDataServiceKeys, isPaginated } from './helpers';
import {
  FeathersDataServiceMethods,
  FeathersDataServiceSignals,
  FeathersDataServiceState,
  NamedFeathersDataServiceMethods,
  NamedFeathersDataServiceSignals,
  NamedFeathersDataServiceState,
} from './models';
import { setCurrent } from './updaters/set-current';
import { setFilter } from './updaters/set-filter';
import { setPagination } from './updaters/set-pagination';
import { NamedEntityComputed } from '@ngrx/signals/entities/src/models';
import { FeathersClientService } from 'src/app/services/feathers/feathers-service.service';
import { ServiceMethodsWithPaginationDisabler } from '../../../feathers/service-methods-with-pagination-disabler';
import { clearSelection } from './updaters/clear-selection';
import { deselectEntityById } from './updaters/deselect-entity-by-id';
import { setSelection } from './updaters/set-selection';
import { selectEntityById } from './updaters/select-entity-by-id';
export type IsRecord<T> = T extends object
  ? T extends unknown[]
    ? false
    : T extends Set<unknown>
    ? false
    : T extends Map<unknown, unknown>
    ? false
    : T extends Function
    ? false
    : true
  : false;
export type IsUnknownRecord<T> = string extends keyof T
  ? true
  : number extends keyof T
  ? true
  : false;
export type IsKnownRecord<T> = IsRecord<T> extends true
  ? IsUnknownRecord<T> extends true
    ? false
    : true
  : false;

export type DeepSignal<T> = Signal<T> &
  (IsKnownRecord<T> extends true
    ? Readonly<{
        [K in keyof T]: IsKnownRecord<T[K]> extends true
          ? DeepSignal<T[K]>
          : Signal<T[K]>;
      }>
    : unknown);

export type Pagination = Omit<Paginated<any>, 'data'>;

export function withFeathersDataService<
  ServicePath extends keyof ServiceTypes,
  Result extends Entity,
  Data extends Partial<Result>,
  Query extends Q,
  PatchData extends Partial<Result>,
  Collection extends string
>(options: {
  servicePath: ServicePath;
  debugKey?: string;
  collection: Collection;
}): SignalStoreFeature<
  {
    state: {};
    // These alternatives break type inference:
    // state: { callState: CallState } & NamedEntityState<Result, Collection>,
    // state: NamedEntityState<Result, Collection>,

    computed: NamedEntityComputed<Result, Collection>;
    methods: {};
  },
  {
    state: NamedFeathersDataServiceState<Result, Params<Query>, Collection>;
    computed: NamedFeathersDataServiceSignals<Result, Collection>;
    methods: NamedFeathersDataServiceMethods<
      Result,
      Data,
      Params<Query>,
      PatchData,
      Collection
    >;
  }
>;
export function withFeathersDataService<
  ServicePath extends keyof ServiceTypes,
  Result extends Entity,
  Data extends Partial<Result>,
  Query extends Q,
  PatchData extends Partial<Result>
>(options: {
  servicePath: ServicePath;
  debugKey?: string;
}): SignalStoreFeature<
  {
    // state: { callState: CallState } & EntityState<Result>;
    state: EntityState<Result>;
    computed: {};
    methods: {};
  },
  {
    state: FeathersDataServiceState<Result, Params<Query>>;
    computed: FeathersDataServiceSignals<Result>;
    methods: FeathersDataServiceMethods<Result, Data, Params<Query>, PatchData>;
  }
>;

export function withFeathersDataService<
  ServicePath extends keyof ServiceTypes,
  Result extends Entity,
  Data extends Partial<Result>,
  Query extends Q,
  PatchData extends Partial<Result>,
  Collection extends string
>(options: {
  servicePath: ServicePath;
  debugKey?: string;
  collection?: Collection;
}): SignalStoreFeature<any, any> {
  const { collection: prefix, servicePath, debugKey } = options;

  const {
    createKey,
    getKey,
    findKey,
    patchKey,
    removeKey,
    selectEntityKey,
    orderPositionsKey,

    filterKey,

    updateFilterKey,
    updatePaginationKey,
    paginationKey,

    entitiesKey,
    currentKey,
    setCurrentKey,
    entitiesCountKey,
    startEmittingKey,
    serviceKey,
    servicePathKey,

    selectedIdsKey,
    selectedEntitiesKey,
    selectByIdKey,
    deselectByIdKey,
    clearSelectionKey,
    setSelectionKey,
  } = getFeathersDataServiceKeys(options);

  const { callStateKey } = getCallStateKeys({ collection: prefix });
  return signalStoreFeature(
    withState(() => ({
      [filterKey]: undefined as Query | undefined,
      [selectedIdsKey]: [] as EntityId[],
      [currentKey]: undefined as Result['id'] | undefined,
      [orderPositionsKey]: {} as Record<Result['id'], number>,
      [paginationKey]: null as Pagination | null,
    })),
    withDevtools(debugKey || servicePath),
    withComputed((store: Record<string, unknown>) => {
      const entities = store[entitiesKey] as Signal<Result[]>;
      const pagination = store[paginationKey] as DeepSignal<Pagination | null>;
      const selectedIds = store[selectedIdsKey] as Signal<Result['id'][]>;
      return {
        [selectedEntitiesKey]: computed(() =>
          selectedIds().map(
            (id) => entities().find((e) => e.id === id) as Result
          )
        ),
        [entitiesCountKey]: computed(() =>
          pagination()?.total ? pagination()?.total : entities().length
        ),
      };
    }),
    withMethods((store: Record<string, unknown> & StateSignal<object>) => {
      const entities = store[entitiesKey] as Signal<Result[]>;
      const feathers = inject(FeathersClientService);
      const service = feathers.getServiceByPath(
        servicePath
      ) as unknown as ServiceMethodsWithPaginationDisabler<
        Result,
        Data,
        Params<Query>,
        PatchData
      >;
      return {
        [serviceKey]: () => {
          return service;
        },
        [servicePathKey]: () => {
          return servicePath;
        },
        [getKey]: async (
          id: Result['id'],
          params?: Params<Query>,
          getFirstFromStore = false
        ): Promise<Result> => {
          if (getFirstFromStore === true) {
            const entityInStore = entities().find((entity) => entity.id === id);
            if (entityInStore) {
              return entityInStore;
            }
          }
          store[callStateKey] && patchState(store, setLoading(prefix));
          try {
            const result = await service.get(id, params);
            patchState(
              store,
              prefix
                ? addEntity(result as Result, { collection: prefix })
                : addEntity(result as Result)
            );
            store[callStateKey] && patchState(store, setLoaded(prefix));

            return result;
          } catch (error) {
            store[callStateKey] && patchState(store, setError(error, prefix));
            throw error;
          }
        },
        [findKey]: async (
          params?: Params<Query> & {
            paginate?: PaginationParams;
          },
          options?: { replaceList: false }
        ): Promise<Result | Paginated<Result>> => {
          store[callStateKey] && patchState(store, setLoading(prefix));
          try {
            const result = await service.find(params);
            if (isPaginated(result)) {
              const { data, ...pagination } = result;
              patchState(
                store,
                prefix
                  ? options?.replaceList === false
                    ? setEntities(data, { collection: prefix })
                    : setAllEntities(data, { collection: prefix })
                  : options?.replaceList === false
                  ? setEntities(data)
                  : setAllEntities(data),
                prefix
                  ? setPagination(pagination, { collection: prefix })
                  : setPagination(pagination),
                prefix
                  ? setFilter(params, { collection: prefix })
                  : setFilter(params)
              );
              store[callStateKey] && patchState(store, setLoaded(prefix));
            } else {
              patchState(
                store,
                prefix
                  ? options?.replaceList === false
                    ? setEntities(result, { collection: prefix })
                    : setAllEntities(result, { collection: prefix })
                  : options?.replaceList === false
                  ? setEntities(result)
                  : setAllEntities(result),
                prefix
                  ? setPagination(undefined, { collection: prefix })
                  : setPagination(undefined),
                prefix
                  ? setFilter(params, { collection: prefix })
                  : setFilter(params)
              );
              store[callStateKey] && patchState(store, setLoaded(prefix));
            }
            return result;
          } catch (error) {
            store[callStateKey] && patchState(store, setError(error, prefix));
            throw error;
          }
        },
        [createKey]: async (
          data: Data,
          params?: Params<Query>
        ): Promise<Result> => {
          store[callStateKey] && patchState(store, setLoading(prefix));
          try {
            const result = await service.create(data, params);
            patchState(
              store,
              prefix
                ? addEntity(result as Result, { collection: prefix })
                : addEntity(result as Result)
            );
            store[callStateKey] && patchState(store, setLoaded(prefix));

            return result;
          } catch (error) {
            store[callStateKey] && patchState(store, setError(error, prefix));
            throw error;
          }
        },
        [patchKey]: async (
          id: Result['id'],
          data: PatchData,
          params?: Params<Query>
        ): Promise<Result | Result[]> => {
          store[callStateKey] && patchState(store, setLoading(prefix));
          const result = await service.patch(id, data, params);
          try {
            if (Array.isArray(result)) {
              patchState(
                store,
                prefix
                  ? setEntities(result, { collection: prefix }) // TODO: Check if this is correct
                  : setEntities(result)
              );
            } else {
              patchState(store, setEntity(result));
            }
            store[callStateKey] && patchState(store, setLoaded(prefix));
            return result;
          } catch (error) {
            store[callStateKey] && patchState(store, setError(error, prefix));
            throw error;
          }
        },
        [updateFilterKey]: (filter: Query): void => {
          patchState(store, { [filterKey]: filter });
        },
        [updatePaginationKey]: (pagination?: Pagination): void => {
          patchState(
            store,
            prefix
              ? setPagination(pagination, { collection: prefix })
              : setPagination(pagination)
          );
        },
        [selectByIdKey]: (id: Result['id']): void => {
          patchState(
            store,
            prefix
              ? selectEntityById(id, { collection: prefix })
              : selectEntityById(id)
          );
        },
        [deselectByIdKey]: (id: Result['id']): void => {
          patchState(
            store,
            prefix
              ? deselectEntityById(id, { collection: prefix })
              : deselectEntityById(id)
          );
        },
        [clearSelectionKey]: (): void => {
          patchState(
            store,
            prefix ? clearSelection({ collection: prefix }) : clearSelection()
          );
        },
        [setSelectionKey]: (ids: Result['id'][]): void => {
          patchState(
            store,
            prefix
              ? setSelection(ids, { collection: prefix })
              : setSelection(ids)
          );
        },
        [removeKey]: async (
          id: Result['id'] | null,
          params?: Params<Query>
        ): Promise<Result | Result[]> => {
          if (id) {
            patchState(store, { [currentKey]: id });
          }
          store[callStateKey] && patchState(store, setLoading(prefix));

          try {
            const result = await service.remove(id, params);
            if (Array.isArray(result)) {
              const idsToDelete = result.map((item) => item.id);
              patchState(
                store,
                prefix
                  ? removeEntities(idsToDelete, { collection: prefix })
                  : removeEntities(idsToDelete)
              );
            } else {
              patchState(
                store,
                prefix
                  ? removeEntity(result.id, { collection: prefix })
                  : removeEntity(result.id)
              );
            }
            if (id) {
              patchState(store, { [currentKey]: undefined });
            }
            store[callStateKey] && patchState(store, setLoaded(prefix));
            return result;
          } catch (e) {
            store[callStateKey] && patchState(store, setError(e, prefix));
            throw e;
          }
        },
        [setCurrentKey]: (current: Result): void => {
          patchState(
            store,
            prefix
              ? setCurrent(current, { collection: prefix })
              : setCurrent(current)
          );
        },
        [startEmittingKey]: (filter?: (item: Result) => boolean): void => {
          service.on('created', (data: Result) => {
            if (!filter || filter(data)) {
              patchState(
                store,
                prefix
                  ? addEntity(data, { collection: prefix })
                  : addEntity(data)
              );
            }
          });
          service.on('patched', (data: Result) => {
            if (!filter || filter(data)) {
              patchState(
                store,
                prefix
                  ? setEntity(data, { collection: prefix }) // TODO: Check if this is correct
                  : setEntity(data)
              );
            }
          });
          service.on('removed', (data: Result) => {
            if (!filter || filter(data)) {
              patchState(
                store,
                prefix
                  ? removeEntity(data.id, { collection: prefix })
                  : removeEntity(data.id)
              );
            }
          });
        },
      };
    })
  );
}