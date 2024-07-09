import { capitalize } from '@angular-architects/ngrx-toolkit';
import { Paginated } from '@feathersjs/feathers';

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
  const selectedIdsKey = options.collection
    ? `selected${capitalize(options.collection)}Ids`
    : 'selectedIds';
  const selectedEntitiesKey = options.collection
    ? `selected${capitalize(options.collection)}Entities`
    : 'selectedEntities';
  const paginationKey = options.collection
    ? `${options.collection}Pagination`
    : 'pagination';
  const orderPositionsKey = options.collection
    ? `${options.collection}OrderPositions`
    : 'orderPositions';

  const updateFilterKey = options.collection
    ? `update${capitalize(options.collection)}Filter`
    : 'updateFilter';
  const selectEntitiesKey = options.collection
    ? `select${capitalize(options.collection)}Entities`
    : 'selectEntities';
  const setSelectedEntitiesKey = options.collection
    ? `setSelected${capitalize(options.collection)}Entities`
    : 'setSelectedEntities';
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

  return {
    createKey,
    getKey,
    findKey,
    patchKey,
    updateKey,
    removeKey,
    selectEntityKey,

    filterKey,
    selectedIdsKey,
    selectedEntitiesKey,
    paginationKey,
    orderPositionsKey,

    updateFilterKey,
    setSelectedEntitiesKey,
    selectEntitiesKey,
    updatePaginationKey,

    entitiesKey,
    entitiesCountKey,

    currentKey,
    setCurrentKey,
    startEmittingKey,
    serviceKey,
    servicePathKey
  };
}

export const isPaginated = (response: any): response is Paginated<any> => {
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