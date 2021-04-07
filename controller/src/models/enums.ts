export enum ConnectionServiceAction {
  Create = 'Create',
}

export enum CredDefServiceAction {
  Create = 'Create',
  Details = 'Details',
}

export enum CredExServiceAction {
  Create = 'Create',
}

// TODO: There seems to be overlap between this and CredentialExchange but they use different endpoints
export enum CredServiceAction {
  Create = 'Create',
}

export enum LedgerServiceAction {
  TAA_Fetch = 'TAA Fetch',
  TAA_Accept = 'TAA Accept',
}

export enum MultitenancyServiceAction {
  Create = 'Create',
  Remove = 'Remove',
  Details = 'Details',
}

export enum SchemaServiceAction {
  Create = 'Create',
  List = 'List',
  Details = 'Details',
}

export enum WalletServiceAction {
  Create = 'Create',
  Publish = 'Publish',
  Fetch = 'Fetch',
}

export enum IssuerRegistrationServiceAction {
  Submit = 'Submit',
}

export enum ServiceType {
  Connection = 'Connection',
  CredDef = 'Credential Definition',
  CredEx = 'Credential Exchange',
  Cred = 'Credential',
  Schema = 'Schema',
  Ledger = 'Ledger',
  Multitenancy = 'Multitenancy',
  Wallet = 'Wallet',
  IssuerRegistration = 'IssuerRegistration',
}

export enum WebhookTopic {
  Connections = 'connections',
  IssueCredential = 'issue_credential',
}

export enum CredExState {
  OfferSent = 'offer_sent',
  RequestReceived = 'request_received',
  Issued = 'credential_issued',
  Acked = 'credential_acked'
}
