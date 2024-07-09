import { SelectedNamedSlice, SelectedSlice } from '../models';
import { getFeathersDataServiceKeys } from '../helpers';
import { PartialStateUpdater } from '@ngrx/signals';
import { EntityId } from '@ngrx/signals/entities';

/**
 * Changes the selected state of the items with the given ids to the given selected param
 * @param ids Ids of the items to change the selected state
 * @param selected Selected state to be set
 */
export function selectEntities(
  ids: EntityId[],
  selected: boolean
): PartialStateUpdater<SelectedSlice>;
export function selectEntities<Collection extends string>(
  ids: EntityId[],
  selected: boolean,
  config: { collection: Collection }
): PartialStateUpdater<SelectedNamedSlice<Collection>>;
export function selectEntities<Collection extends string>(
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
          { ...state[selectedIdsKey] }
        ),
      },
    };
  };
}