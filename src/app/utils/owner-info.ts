import { ServiceTypes } from 'feathers-dercosa';
import { WithId } from 'feathers-dercosa/lib/utils/owned';

export interface OwnerInfo<T extends WithId> {
  service: keyof ServiceTypes;
  id: T['id'];
}
