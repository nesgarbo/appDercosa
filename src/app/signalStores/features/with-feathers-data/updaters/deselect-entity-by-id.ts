import { Entity } from '@angular-architects/ngrx-toolkit';
import { PartialStateUpdater } from '@ngrx/signals';
import { getFeathersDataServiceKeys } from '../helpers';
import { SelectedNamedSlice, SelectedSlice } from '../models';

/**
 * Deselects the item by its id
 * @param id Id of the item be unselected
 */
export function deselectEntityById<E extends Entity>(
  id: E['id']
): PartialStateUpdater<SelectedSlice>;
export function deselectEntityById<E extends Entity, Collection extends string>(
  id: E['id'],
  config: { collection: Collection }
): PartialStateUpdater<SelectedNamedSlice<Collection>>;
export function deselectEntityById<E extends Entity, Collection extends string>(
  id: E['id'],
  config?: { collection: Collection }
): PartialStateUpdater<SelectedSlice | SelectedNamedSlice<Collection>> {
  const { selectedIdsKey } = getFeathersDataServiceKeys({
    collection: config?.collection,
  });
  return (state) => {
    const currentSelectedIds = (state as any)[selectedIdsKey] as E['id'][];
    return {
      [selectedIdsKey]: [...currentSelectedIds.filter((e) => e !== id)],
    };
  };
}
