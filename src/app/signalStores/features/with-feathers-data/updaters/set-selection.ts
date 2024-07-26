import { SelectedNamedSlice, SelectedSlice } from '../models';
import { getFeathersDataServiceKeys } from '../helpers';
import { PartialStateUpdater } from '@ngrx/signals';
import { Entity } from '@angular-architects/ngrx-toolkit';

/**
 * Selects the item by its id
 * @param id Id of the item to be selected
 */
export function setSelection<E extends Entity>(
  ids: E['id'][]
): PartialStateUpdater<SelectedSlice>;
export function setSelection<E extends Entity, Collection extends string>(
  ids: E['id'][],
  config: { collection: Collection }
): PartialStateUpdater<SelectedNamedSlice<Collection>>;
export function setSelection<E extends Entity, Collection extends string>(
  ids: E['id'][],
  config?: { collection: Collection }
): PartialStateUpdater<SelectedSlice | SelectedNamedSlice<Collection>> {
  const { selectedIdsKey } = getFeathersDataServiceKeys({
    collection: config?.collection,
  });
  return state => {
    return {
      [selectedIdsKey]: [...ids]
    };
  };
}