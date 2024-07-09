import { Entity } from '@angular-architects/ngrx-toolkit';
import { PartialStateUpdater } from '@ngrx/signals';
import {
  FeathersDataServiceState,
  NamedFeathersDataServiceState,
  Pagination,
} from '../models';
import { getFeathersDataServiceKeys } from '../helpers';

export function setPagination(
  pagination: Pagination | undefined
): PartialStateUpdater<FeathersDataServiceState<any, any>>;
export function setPagination<Collection extends string>(
  pagination: Pagination | undefined,
  config: { collection: Collection }
): PartialStateUpdater<NamedFeathersDataServiceState<any, any, Collection>>;
export function setPagination<E extends Entity, Collection extends string>(
  pagination: Pagination | undefined,
  config?: { collection: Collection }
): PartialStateUpdater<
  | FeathersDataServiceState<E, any>
  | NamedFeathersDataServiceState<E, any, Collection>
> {
  const { paginationKey } = getFeathersDataServiceKeys({
    collection: config?.collection,
  });
  return state => {
    return {
      [paginationKey]: pagination,
    };
  };
}