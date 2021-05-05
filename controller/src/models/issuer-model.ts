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
  vcr: AgentConnection;
  endorser: AgentConnection;
  schemas?: SchemaServiceModel[];
}

interface AgentConnection {
  connection_id: string;
  public_did: string | undefined;
}
