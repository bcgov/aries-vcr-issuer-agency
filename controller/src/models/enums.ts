export enum ConnectionServiceAction {
  CreateVCR = 'CreateVCR',
  CreateEndorser = 'CreateEndorser',
}

export enum CredDefServiceAction {
  Create = 'Create',
  Details = 'Details',
}

export enum CredServiceAction {
  Create = 'Create',
  Issue = 'Issue',
  Send = 'Send'
}

export enum EndorserRequestServiceAction {
  Create = 'Create'
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
  Cred = 'Credential',
  Endorser = 'Endorser',
  IssuerRegistration = 'IssuerRegistration',
  Ledger = 'Ledger',
  Multitenancy = 'Multitenancy',
  Schema = 'Schema',
  Wallet = 'Wallet',
}

export enum WebhookTopic {
  Connections = 'connections',
  IssueCredential = 'issue_credential',
}

export enum WebhookTopic_2_0 {
  IssueCredential = 'issue_credential_v2_0',
  IssueCredentialIndy = 'issue_credential_v2_0_indy',
}

export enum CredState {
  OfferSent = 'offer_sent',
  RequestReceived = 'request_received',
  CredentialIssued = 'credential_issued',
}

export enum CredState_2_0 {
  OfferSent = 'offer-sent',
  RequestReceived = 'request-received',
  CredentialIssued = 'credential-issued',
}
