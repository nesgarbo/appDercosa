import { capitalize } from '@angular-architects/ngrx-toolkit';
import { Paginated } from '@feathersjs/feathers';

/**
 * Generates a set of keys for Feathers data service operations based on the provided collection name.
 * @template Collection - The type of the collection name.
 * @param {Object} options - The options object.
 * @param {Collection} [options.collection] - The name of the collection.
 * @returns {Object} An object containing the generated keys.
 */
export function getFeathersDataServiceKeys<Collection extends string>(options: {
  collection?: Collection;
}) {
  const createKey = options.collection
    ? `create${capitalize(options.collection)}`
    : 'create';
  const getKey = options.collection
    ? `get${capitalize(options.collection)}`
    : 'get';
  const findKey = options.collection
    ? `find${capitalize(options.collection)}`
    : 'find';
  const patchKey = options.collection
    ? `patch${capitalize(options.collection)}`
    : 'patch';
  const updateKey = options.collection
    ? `update${capitalize(options.collection)}`
    : 'update';
  const removeKey = options.collection
    ? `remove${capitalize(options.collection)}`
    : 'remove';

  const selectEntityKey = options.collection
    ? `select${capitalize(options.collection)}Entity`
    : 'selectEntity';

  const filterKey = options.collection
    ? `${options.collection}Filter`
    : 'filter';
  const paginationKey = options.collection
    ? `${options.collection}Pagination`
    : 'pagination';
  const orderPositionsKey = options.collection
    ? `${options.collection}OrderPositions`
    : 'orderPositions';

  const updateFilterKey = options.collection
    ? `update${capitalize(options.collection)}Filter`
    : 'updateFilter';
  const updatePaginationKey = options.collection
    ? `update${capitalize(options.collection)}Pagination`
    : 'updatePagination';

  const currentKey = options.collection
    ? `current${capitalize(options.collection)}`
    : 'current';
  const setCurrentKey = options.collection
    ? `setCurrent${capitalize(options.collection)}`
    : 'setCurrent';
  const entitiesCountKey = options.collection
    ? `${options.collection}Count`
    : 'count';

  const startEmittingKey = options.collection
    ? `startEmitting${capitalize(options.collection)}`
    : 'startEmitting';

  const servicePathKey = options.collection
    ? `${options.collection}ServicePath`
    : 'servicePath';

  const serviceKey = options.collection
    ? `${options.collection}Service`
    : 'service';

  // TODO: Take these from @ngrx/signals/entities, when they are exported
  const entitiesKey = options.collection
    ? `${options.collection}Entities`
    : 'entities';

  /** Items selection */

  // state
  const selectedIdsKey = options.collection
    ? `selected${capitalize(options.collection)}Ids`
    : 'selectedIds';

  // computed
  const selectedEntitiesKey = options.collection
    ? `selected${capitalize(options.collection)}Entities`
    : 'selectedEntities';

  // methods
  const selectByIdKey = options.collection
    ? `select${capitalize(options.collection)}ById`
    : 'selectById';
  const deselectByIdKey = options.collection
    ? `deselect${capitalize(options.collection)}ById`
    : 'deselectById';

  const clearSelectionKey = options.collection
    ? `clear${capitalize(options.collection)}Selection`
    : 'clearSelection';

  const setSelectionKey = options.collection
    ? `set${capitalize(options.collection)}Selection`
    : 'setSelection';

  return {
    createKey,
    getKey,
    findKey,
    patchKey,
    updateKey,
    removeKey,
    selectEntityKey,

    filterKey,
    paginationKey,
    orderPositionsKey,

    updateFilterKey,
    updatePaginationKey,

    entitiesKey,
    entitiesCountKey,

    currentKey,
    setCurrentKey,
    startEmittingKey,
    serviceKey,
    servicePathKey,

    selectedIdsKey,
    selectedEntitiesKey,
    selectByIdKey,
    deselectByIdKey,
    clearSelectionKey,
    setSelectionKey,
  };
}

/**
 * Type guard to check if a response is paginated.
 * @param {any} response - The response to check.
 * @returns {boolean} True if the response is paginated, false otherwise.
 */
export const isPaginated = (response: any): response is Paginated<any> => {
  console.log('response', response);
  return (
    response &&
    typeof response === 'object' &&
    'total' in response &&
    'limit' in response &&
    'skip' in response &&
    'data' in response &&
    Array.isArray(response.data)
  );
};