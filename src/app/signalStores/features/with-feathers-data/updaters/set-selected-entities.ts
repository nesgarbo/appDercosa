import { Entity } from '@angular-architects/ngrx-toolkit';
import { SelectedNamedSlice, SelectedSlice } from '../models';
import { getFeathersDataServiceKeys } from '../helpers';
import { PartialStateUpdater } from '@ngrx/signals';
import { EntityId } from '@ngrx/signals/entities';

/**
 * Replace the selected state of all the items with the given selected param
 * @param ids Ids of the items to be set as the selected state
 * @param selected Selected state to be set
 */
export function setSelectedEntities(
  ids: EntityId[],
  selected: boolean
): PartialStateUpdater<SelectedSlice>;
export function setSelectedEntities<Collection extends string>(
  ids: EntityId[],
  selected: boolean,
  config: { collection: Collection }
): PartialStateUpdater<SelectedNamedSlice<Collection>>;
export function setSelectedEntities<Collection extends string>(
  ids: EntityId[],
  selected: boolean,
  config?: { collection: Collection }
): PartialStateUpdater<SelectedSlice | SelectedNamedSlice<Collection>> {
  const { selectedIdsKey } = getFeathersDataServiceKeys({
    collection: config?.collection,
  });

  return (state: Record<string, Record<EntityId, boolean>>) => {
    return {
      [selectedIdsKey]: {
        ...ids.reduce(
          (acc, id) => {
            acc[id] = selected;
            return acc;
          },
          {} as Record<EntityId, boolean>
        ),
      },
    };
  };
}