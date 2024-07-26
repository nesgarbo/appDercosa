import { SelectedNamedSlice, SelectedSlice } from '../models';
import { getFeathersDataServiceKeys } from '../helpers';
import { PartialStateUpdater } from '@ngrx/signals';
import { Entity } from '@angular-architects/ngrx-toolkit';

/**
 * Clears the selection
 */
export function clearSelection<
  E extends Entity
>(): PartialStateUpdater<SelectedSlice>;
export function clearSelection<
  E extends Entity,
  Collection extends string
>(config: {
  collection: Collection;
}): PartialStateUpdater<SelectedNamedSlice<Collection>>;
export function clearSelection<
  E extends Entity,
  Collection extends string
>(config?: {
  collection: Collection;
}): PartialStateUpdater<SelectedSlice | SelectedNamedSlice<Collection>> {
  const { selectedIdsKey } = getFeathersDataServiceKeys({
    collection: config?.collection,
  });
  return (state) => {
    return {
      [selectedIdsKey]: [],
    };
  };
}