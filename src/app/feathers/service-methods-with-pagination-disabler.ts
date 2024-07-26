import { Params, ServiceMethods, Paginated, ServiceAddons } from '@feathersjs/feathers';

export type FindReturn<Result, Pars> = Pars extends Params & { paginate: false }
  ? Result[]
  : Paginated<Result>;

export interface DeactivablePaginationParams<Query> extends Params<Query> {
  paginate: false;
}

export type PaginationDisabled = { paginate: false };

export interface ServiceMethodsWithPaginationDisabler<
  Result = any,
  Data = Partial<Result>,
  ServiceParams = Params,
  PatchData = Partial<Data>,
> extends Omit< ServiceAddons & ServiceMethods<Result, Data, ServiceParams, PatchData>, 'find'> {
  find(params: ServiceParams & { paginate: false }): Promise<Result[]>;
  find(params?: ServiceParams): Promise<Paginated<Result>>;
}