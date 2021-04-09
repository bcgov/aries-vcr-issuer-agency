export interface Claim {
  name: string;
  value: string;
}
export interface CredServiceModel {
  schema_name: string;
  schema_version: string;
  attributes: { [key: string]: string };
}


export interface AriesCredPreviewAttribute {
  'name': string;
  'mime-type': string;
  'value': string;
}

export interface AriesCredPreview {
  '@type': string;
  'attributes': AriesCredPreviewAttribute[];
}

export interface AriesCredServiceRequest {
  credential_preview: AriesCredPreview;
  connection_id: string;
  filter: { [key: string]: { [key: string]: string } },
  comment?: string;
  auto_issue?: boolean;
  auto_offer?: boolean;
}