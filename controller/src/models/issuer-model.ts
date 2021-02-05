export interface BaseIssuerProfile {
  name: string;
  'api-key': string;
}

export interface IssuerProfile {
  _id?: string;
  did: string;
  verkey: string;
  name: string;
  abbreviation: string;
  url: string;
  email: string;
  logo: string;
}
