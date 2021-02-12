import { Params } from '@feathersjs/feathers';
import { IssuerProfileModel } from './issuer-model';

export interface IssuerServiceParams extends Params {
  profile: IssuerProfileModel;
}
