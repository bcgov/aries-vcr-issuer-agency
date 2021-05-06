export interface AriesCredDefServiceRequest {
  support_revocation: boolean;
  schema_id: string;
  tag: string;
  conn_id: string;
  create_transaction_for_endorser: boolean;
}

export interface CredDefServiceResponse {
  credential_definition_id: string;
}
