export enum ConnectionServiceAction {
  Create,
}

export enum CredDefServiceAction {
  Create,
  List,
}

export enum CredExServiceAction {
  Create,
}

export enum LedgerServiceAction {
  TAA_Fetch,
  TAA_Accept,
}

export enum MultitenancyServiceAction {
  Create,
  Remove,
  Details,
}

export enum SchemasServiceAction {
  Create,
  List,
  Details,
}

export enum WalletServiceAction {
  Create,
  Publish,
}

export enum ServiceType {
  Connection,
  CredDef,
  CredEx,
  Schemas,
  Ledger,
  Multitenancy,
  Wallet,
}

export enum WebhookTopic {
  Connections = 'connections',
  IssueCredential = 'issue_credential',
}

export enum CredExState {
  OfferSent = 'offer_sent',
  RequestReceived = 'request_received',
  Issued = 'credential_issued',
}
