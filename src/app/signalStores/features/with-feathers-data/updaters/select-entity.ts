import { SelectedNamedSlice, SelectedSlice } from '../models';
import { getFeathersDataServiceKeys } from '../helpers';
import { PartialStateUpdater } from '@ngrx/signals';
import { Entity } from '@angular-architects/ngrx-toolkit';

/**
 * Changes the selected state of the items with the given ids to the given selected param
 * @param ids Ids of the items to change the selected state
 * @param selected Selected state to be set
 */
export function selectEntity<E extends Entity>(
  entity: E,
  selected: boolean
): PartialStateUpdater<SelectedSlice>;
export function selectEntity<E extends Entity, Collection extends string>(
  entity: E,
  selected: boolean,
  config: { collection: Collection }
): PartialStateUpdater<SelectedNamedSlice<Collection>>;
export function selectEntity<E extends Entity, Collection extends string>(
  entity: E,
  selected: boolean,
  config?: { collection: Collection }
): PartialStateUpdater<SelectedSlice | SelectedNamedSlice<Collection>> {
  const { selectEntityKey } = getFeathersDataServiceKeys({
    collection: config?.collection,
  });

  return (state: Record<string, Record<E['id'], boolean>>) => {
    return {
      [selectEntityKey]: {
        [entity.id]: selected,
      },
    };
  };
}