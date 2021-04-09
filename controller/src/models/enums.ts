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

export enum CredServiceAction {
  Send = 'Send'
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

export enum WebhookTopic_2_0 {
  IssueCredential = 'issue_credential_v2_0',
  IssueCredentialIndy = 'issue_credential_v2_0_indy',
}

export enum CredExState {
  ProposalReceived = 'proposal_received',
  OfferSent = 'offer_sent',
  RequestReceived = 'request_received',
  CredentialIssued = 'credential_issued',
  Done = 'credential_acked'
}
