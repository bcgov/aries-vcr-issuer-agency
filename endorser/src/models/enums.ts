export enum ServiceType {
  Endorser = 'Endorser',
}

export enum WebhookTopic {
  Connections = 'connections',
}

export enum ConnectionState {
  InvitationSent = 'invitation-sent',
  Request = 'request',
  Response = 'response',
  Active = 'active',
  Completed = 'completed',
}

export enum EndorserServiceAction {
  Set_Metadata = 'Metadata',
}
