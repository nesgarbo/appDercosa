import { Entity } from '@angular-architects/ngrx-toolkit';
import { PartialStateUpdater } from '@ngrx/signals';
import { getFeathersDataServiceKeys } from '../helpers';
import {
  FeathersDataServiceState,
  NamedFeathersDataServiceState,
} from '../models';

export function setCurrent<E extends Entity>(
  current: E
): PartialStateUpdater<FeathersDataServiceState<E, any>>;
export function setCurrent<E extends Entity, Collection extends string>(
  current: E,
  config: { collection: Collection }
): PartialStateUpdater<NamedFeathersDataServiceState<E, any, Collection>>;
export function setCurrent<E extends Entity, Collection extends string>(
  current: E,
  config?: { collection: Collection }
): PartialStateUpdater<
  | FeathersDataServiceState<E, any>
  | NamedFeathersDataServiceState<E, any, Collection>
> {
  const { currentKey } = getFeathersDataServiceKeys({
    collection: config?.collection,
  });
  return (state) => {
    return {
      [currentKey]: current.id,
    };
  };
}
