import { PartialStateUpdater } from '@ngrx/signals';
import { getFeathersDataServiceKeys } from '../helpers';
import {
  FeathersDataServiceState,
  Filter,
  NamedFeathersDataServiceState,
} from '../models';

export function setFilter<F extends Filter>(
  filter: F | undefined
): PartialStateUpdater<FeathersDataServiceState<any, any>>;
export function setFilter<F extends Filter, Collection extends string>(
  filter: F | undefined,
  config: { collection: Collection }
): PartialStateUpdater<NamedFeathersDataServiceState<any, any, Collection>>;
export function setFilter<F extends Filter, Collection extends string>(
  filter: F | undefined,
  config?: { collection: Collection }
): PartialStateUpdater<
  | FeathersDataServiceState<any, any>
  | NamedFeathersDataServiceState<any, any, Collection>
> {
  const { filterKey } = getFeathersDataServiceKeys({
    collection: config?.collection,
  });
  return (state) => {
    return {
      [filterKey]: filter,
    };
  };
}
