export interface AriesCredDefServiceRequest {
  support_revocation: boolean;
  schema_id: string;
  tag: string;
}

export interface CredDefServiceResponse {
  credential_definition_id: string;
}
