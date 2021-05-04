import { SchemaServiceModel } from './schema';

export interface IssuerProfileModel {
  _id: string;
  name: string;
  'api-key': string;
  normalizedName: string;
  wallet: {
    id: string;
    name: string;
    token: string;
  };
  did: string;
  verkey: string;
  abbreviation: string;
  url: string;
  email: string;
  logo: string;
  vcr_connection_id: string;
  endorser_connection_id: string;
  endorser_did: string;
  schemas?: SchemaServiceModel[];
}
