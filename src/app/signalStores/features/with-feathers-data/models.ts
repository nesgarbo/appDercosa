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
import { ServiceMethodsWithPaginationDisabler } from 'src/app/feathers/service-methods-with-pagination-disabler';

export type DataServiceMethods<
  Result extends Entity,
  Collection
> = Collection extends string
  ? NamedFeathersDataServiceMethods<Result, any, any, any, Collection>
  : FeathersDataServiceMethods<Result, any, any, any>;

export type Filter = Params<Query>;

export type FindFilter = Filter & { paginate?: PaginationParams };

export type Pagination = Omit<Paginated<any>, 'data'>;

export type SelectedSlice = { selectedIds: EntityId[] };
export type SelectedNamedSlice<Collection extends string> = {
  [K in Collection as `selected${Capitalize<K>}Ids`]: EntityId[];
};
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

export type NamedFeathersDataServiceSignals<
  Result extends Entity,
  Collection extends string
> = {
  [K in Collection as `selected${Capitalize<K>}Entities`]: Signal<Result[]>;
} & {
  [K in Collection as `${K}Count`]: Signal<number>;
};

export type FeathersDataServiceSignals<Result extends Entity> = {
  selectedEntities: Signal<Result[]>;
  count: Signal<number>;
};

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
  [K in Collection as `update${Capitalize<K>}Filter`]: (filter?: Query) => void;
} & {
  [K in Collection as `update${Capitalize<K>}Pagination`]: (
    filter?: Pagination
  ) => void;
} & {
  [K in Collection as `select${Capitalize<K>}ById`]: (id: Result['id']) => void;
} & {
  [K in Collection as `deselect${Capitalize<K>}ById`]: (
    id: Result['id']
  ) => void;
} & {
  [K in Collection as `clear${Capitalize<K>}Selection`]: () => void;
} & {
  [K in Collection as `set${Capitalize<K>}Selection`]: (ids: Result['id'][]) => void;
} & {
  [K in Collection as `remove${Capitalize<K>}`]: (
    id: Result['id'] | null,
    params?: Params<Query>
  ) => Promise<Result | Result[]>;
} & {
  [K in Collection as `setCurrent${Capitalize<K>}`]: (entity?: Result) => void;
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