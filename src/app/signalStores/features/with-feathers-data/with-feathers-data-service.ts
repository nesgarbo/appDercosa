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
    patchState,
    signalStoreFeature,
    withComputed,
    withMethods,
    withState,
  } from '@ngrx/signals';
  import {
    EntityId,
    addEntity,
    removeEntities,
    removeEntity,
    setAllEntities,
    setEntities,
    setEntity,
  } from '@ngrx/signals/entities';
  import {
    EntityState,
    NamedEntitySignals,
  } from '@ngrx/signals/entities/src/models';
  import { DeepSignal } from '@ngrx/signals/src/deep-signal';
  import { StateSignal } from '@ngrx/signals/src/state-signal';
  import { ServiceTypes } from 'feathers-dercosa';
  import { FeathersClientService } from '../../../services/feathers/feathers-service.service';
  import { ServiceMethodsWithPaginationDisabler } from '../../../feathers/service-methods-with-pagination-disabler';
  
  import { getFeathersDataServiceKeys, isPaginated } from './helpers';
  import {
    FeathersDataServiceMethods,
    FeathersDataServiceSignals,
    FeathersDataServiceState,
    NamedFeathersDataServiceMethods,
    NamedFeathersDataServiceSignals,
    NamedFeathersDataServiceState,
  } from './models';
  import { selectEntities } from './updaters/select-entities';
  import { selectEntity } from './updaters/select-entity';
  import { setCurrent } from './updaters/set-current';
  import { setFilter } from './updaters/set-filter';
  import { setPagination } from './updaters/set-pagination';
  import { setSelectedEntities } from './updaters/set-selected-entities';
  
  export type Pagination = Omit<Paginated<any>, 'data'>;
  
  export function withFeathersDataService<
    ServicePath extends keyof ServiceTypes,
    Result extends Entity,
    Data extends Partial<Result>,
    Query extends Q,
    PatchData extends Partial<Result>,
    Collection extends string,
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
  
      signals: NamedEntitySignals<Result, Collection>;
      methods: {};
    },
    {
      state: NamedFeathersDataServiceState<Result, Params<Query>, Collection>;
      signals: NamedFeathersDataServiceSignals<Result, Collection>;
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
    PatchData extends Partial<Result>,
  >(options: {
    servicePath: ServicePath;
    debugKey?: string;
  }): SignalStoreFeature<
    {
      // state: { callState: CallState } & EntityState<Result>;
      // signals: Empty;
      state: EntityState<Result>;
      signals: {};
      methods: {};
    },
    {
      state: FeathersDataServiceState<Result, Params<Query>>;
      signals: FeathersDataServiceSignals<Result>;
      methods: FeathersDataServiceMethods<Result, Data, Params<Query>, PatchData>;
    }
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function withFeathersDataService<
    ServicePath extends keyof ServiceTypes,
    Result extends Entity,
    Data extends Partial<Result>,
    Query extends Q,
    PatchData extends Partial<Result>,
    Collection extends string,
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
      selectedIdsKey,
      selectedEntitiesKey,
  
      updateFilterKey,
      setSelectedEntitiesKey,
      selectEntitiesKey,
      updatePaginationKey,
      paginationKey,
  
      entitiesKey,
      currentKey,
      setCurrentKey,
      entitiesCountKey,
      startEmittingKey,
      serviceKey,
      servicePathKey,
    } = getFeathersDataServiceKeys(options);
  
    const { callStateKey } = getCallStateKeys({ collection: prefix });
    return signalStoreFeature(
      withState(() => ({
        [filterKey]: undefined as Query | undefined,
        [selectedIdsKey]: {} as Record<EntityId, boolean>,
        [currentKey]: undefined as Result['id'] | undefined,
        [orderPositionsKey]: {} as Record<Result['id'], number>,
        [paginationKey]: null as Pagination | null,
      })),
      withDevtools(debugKey || servicePath),
      withComputed((store: Record<string, unknown>) => {
        const entities = store[entitiesKey] as Signal<Result[]>;
        const pagination = store[paginationKey] as DeepSignal<Pagination | null>;
        const selectedIds = store[selectedIdsKey] as Signal<
          Record<EntityId, boolean>
        >;
        return {
          [selectedEntitiesKey]: computed(() =>
            entities().filter(e => selectedIds()[e.id])
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
              const entityInStore = entities().find(entity => entity.id === id);
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
          [selectEntitiesKey]: (ids: Result['id'][], selected: boolean): void => {
            patchState(
              store,
              prefix
                ? selectEntities(ids, selected, { collection: prefix })
                : selectEntities(ids, selected)
            );
          },
          [selectEntityKey]: (entity: Result, selected: boolean): void => {
            patchState(
              store,
              prefix
                ? selectEntity(entity, selected, { collection: prefix })
                : selectEntity(entity, selected)
            );
          },
          [setSelectedEntitiesKey]: (
            ids: Result['id'][],
            selected: boolean
          ): void => {
            patchState(
              store,
              prefix
                ? setSelectedEntities(ids, selected, { collection: prefix })
                : setSelectedEntities(ids, selected)
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
                const idsToDelete = result.map(item => item.id);
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
          [startEmittingKey]: (): void => {
            service.on('created', (data: Result) => {
              console.log('created', data); 
              patchState(
                store,
                prefix ? addEntity(data, { collection: prefix }) : addEntity(data)
              );
            });
            service.on('patched', (data: Result) => {
              console.log('patched', data);
              patchState(
                store,
                prefix
                  ? setEntity(data, { collection: prefix }) // TODO: Check if this is correct
                  : setEntity(data)
              );
            });
            service.on('removed', (data: Result) => {
              console.log('removed', data);
              patchState(
                store,
                prefix
                  ? removeEntity(data.id, { collection: prefix })
                  : removeEntity(data.id)
              );
            });
          },
        };
      })
    );
  }