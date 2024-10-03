/**
 * Represents a data service method type for a given entity and collection.
 */
import { Entity } from '@angular-architects/ngrx-toolkit';
import { Signal } from '@angular/core';
import {
  Paginated,
  PaginationParams,
  Params,
  Query,
} from '@feathersjs/feathers';
import { EntityId } from '@ngrx/signals/entities';
import { ServiceTypes } from 'feathers-dercosa';
import { ServiceMethodsWithPaginationDisabler } from '../../../feathers/service-methods-with-pagination-disabler';

/**
 * Type for data service methods with pagination disabler.
 */
export type DataServiceMethods<
    Result extends Entity,
    Collection
> = Collection extends string
    ? NamedFeathersDataServiceMethods<Result, any, any, any, Collection>
    : FeathersDataServiceMethods<Result, any, any, any>;

/**
 * Type for filter parameters.
 */
export type Filter = Params<Query>;

/**
 * Type for find filter parameters with optional pagination.
 */
export type FindFilter = Filter & { paginate?: PaginationParams };

/**
 * Type for pagination information.
 */
export type Pagination = Omit<Paginated<any>, 'data'>;

/**
 * Type for selected slice of entities.
 */
export type SelectedSlice = { selectedIds: EntityId[] };

/**
 * Type for selected named slice of entities for a given collection.
 */
export type SelectedNamedSlice<Collection extends string> = {
    [K in Collection as `selected${Capitalize<K>}Ids`]: EntityId[];
};

/**
 * Type for named Feathers data service state for a given entity, filter, and collection.
 */
export type NamedFeathersDataServiceState<
    Result extends Entity,
    F extends Filter,
    Collection extends string
> = {
    [K in Collection as `${K}Filter`]?: F & {
        paginate?: PaginationParams;
    };
} & {
    [K in Collection as `selected${Capitalize<K>}Ids`]: EntityId[];
} & {
    [K in Collection as `current${Capitalize<K>}`]: Result;
} & {
    [K in Collection as `${Capitalize<K>}Pagination`]: Pagination | null;
} & {
    [K in Collection as `${Capitalize<K>}OrderPositions`]?: Record<
        Result['id'],
        number
    >;
};

/**
 * Type for Feathers data service state for a given entity and filter.
 */
export type FeathersDataServiceState<
    Result extends Entity,
    F extends Filter
> = {
    filter?: F;
    selectedIds: Result['id'][];
    current: Result['id'];
    pagination: Pagination | null;
    orderPositions?: Record<Result['id'], number>;
};

/**
 * Type for named Feathers data service signals for a given entity and collection.
 */
export type NamedFeathersDataServiceSignals<
    Result extends Entity,
    Collection extends string
> = {
    [K in Collection as `selected${Capitalize<K>}Entities`]: Signal<Result[]>;
} & {
    [K in Collection as `${K}Count`]: Signal<number>;
};

/**
 * Type for Feathers data service signals for a given entity.
 */
export type FeathersDataServiceSignals<Result extends Entity> = {
    selectedEntities: Signal<Result[]>;
    count: Signal<number>;
};

/**
 * Type for named Feathers data service methods for a given entity, data, query, patch data, and collection.
 */
export type NamedFeathersDataServiceMethods<
    Result extends Entity,
    Data extends Partial<Result>,
    Query extends Filter,
    PatchData extends Partial<Result>,
    Collection extends string
> = {
    [K in Collection as `get${Capitalize<K>}`]: (
        id: Result['id'],
        params?: Query,
        getFirstFromStore?: boolean
    ) => Promise<Result>;
} & {
    [K in Collection as `find${Capitalize<K>}`]: (
        params?: Query & {
            paginate?: PaginationParams;
        },
        options?: { replaceList: false }
    ) => Promise<Result[] | Paginated<Result>>;
} & {
    [K in Collection as `create${Capitalize<K>}`]: (
        data: Data,
        params?: Query
    ) => Promise<Result>;
} & {
    [K in Collection as `patch${Capitalize<K>}`]: (
        id: Result['id'],
        data: PatchData,
        params?: Params<Query>
    ) => Promise<Result | Result[]>;
} & {
    [K in Collection as `update${Capitalize<K>}Filter`]: (
        filter?: Query
    ) => void;
} & {
    [K in Collection as `update${Capitalize<K>}Pagination`]: (
        filter?: Pagination
    ) => void;
} & {
    [K in Collection as `select${Capitalize<K>}ById`]: (
        id: Result['id']
    ) => void;
} & {
    [K in Collection as `deselect${Capitalize<K>}ById`]: (
        id: Result['id']
    ) => void;
} & {
    [K in Collection as `clear${Capitalize<K>}Selection`]: () => void;
} & {
    [K in Collection as `set${Capitalize<K>}Selection`]: (
        ids: Result['id'][]
    ) => void;
} & {
    [K in Collection as `remove${Capitalize<K>}`]: (
        id: Result['id'] | null,
        params?: Params<Query>
    ) => Promise<Result | Result[]>;
} & {
    [K in Collection as `setCurrent${Capitalize<K>}`]: (
        entity?: Result
    ) => void;
} & {
    [K in Collection as `startEmitting${Capitalize<K>}`]: (
        filter?: (item: Result) => boolean
    ) => void;
} & {
    [K in Collection as `${K}Service`]: () => ServiceMethodsWithPaginationDisabler<
        Result,
        Data,
        Params<Query>,
        PatchData
    >;
} & {
    [K in Collection as `${K}ServicePath`]: () => keyof ServiceTypes;
};

/**
 * Type for Feathers data service methods for a given entity, data, query, and patch data.
 */
export type FeathersDataServiceMethods<
    Result extends Entity,
    Data extends Partial<Result>,
    Query extends Filter,
    PatchData extends Partial<Result>
> = {
    get: (
        id: Result['id'],
        params?: Query,
        getFirstFromStore?: boolean
    ) => Promise<Result>;
    find: (
        params?: Query & { paginate?: PaginationParams },
        options?: { replaceList: false }
    ) => Promise<Result[] | Paginated<Result>>;
    create: (data: Data, params?: Query) => Promise<Result>;
    patch(
        id: Result['id'],
        data: PatchData,
        params?: Params<Query>
    ): Promise<Result | Result[]>;
    updateFilter: (filter?: Query) => void;
    updatePagination: (pagination?: Pagination) => void;
    selectById: (id: Result['id']) => void;
    deselectById: (id: Result['id']) => void;
    clearSelection: () => void;
    setSelection: (ids: Result['id'][]) => void;
    remove: (
        id: Result['id'] | null,
        params?: Query
    ) => Promise<Result | Result[]>;
    setCurrent: (entity?: Result) => void;
    startEmitting: (filter?: (item: Result) => boolean) => void;
    servicePath: () => keyof ServiceTypes;
    service: () => ServiceMethodsWithPaginationDisabler<
        Result,
        Data,
        Params<Query>,
        PatchData
    >;
};
