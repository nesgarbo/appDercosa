import { SelectedNamedSlice, SelectedSlice } from '../models';
import { getFeathersDataServiceKeys } from '../helpers';
import { PartialStateUpdater } from '@ngrx/signals';
import { Entity } from '@angular-architects/ngrx-toolkit';

/**
 * Selects the item by its id
 * @param id Id of the item to be selected
 */
export function selectEntityById<E extends Entity>(
  id: E['id']
): PartialStateUpdater<SelectedSlice>;
export function selectEntityById<E extends Entity, Collection extends string>(
  id: E['id'],
  config: { collection: Collection }
): PartialStateUpdater<SelectedNamedSlice<Collection>>;
export function selectEntityById<E extends Entity, Collection extends string>(
  id: E['id'],
  config?: { collection: Collection }
): PartialStateUpdater<SelectedSlice | SelectedNamedSlice<Collection>> {
  const { selectedIdsKey } = getFeathersDataServiceKeys({
    collection: config?.collection,
  });
  return state => {
    const currentSelectedIds = (state as any)[selectedIdsKey] as E['id'][]; 
    return {
      [selectedIdsKey]: [...currentSelectedIds, id]
    };
  };
}