export interface Claim {
  name: string;
  value: string;
}
export interface CredServiceModel {
  schema_name: string;
  schema_version: string;
  attributes: { [key: string]: string };
}

export interface AriesCredProposalAttribute {
  'name': string;
  'mime-type': string;
  'value': string;
}

export interface AriesCredProposal {
  '@type': string;
  'attributes': AriesCredProposalAttribute[];
}

export interface AriesCredServiceRequest {
  issuer_did: string;
  schema_issuer_did: string;
  schema_id: string;
  schema_name: string;
  schema_version: string;
  cred_def_id: string;
  credential_proposal: AriesCredProposal;
  connection_id: string;
  comment?: string;
}