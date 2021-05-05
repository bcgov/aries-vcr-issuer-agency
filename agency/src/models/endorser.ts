export interface EndorserServiceModel {
    tran_id: string;
}

export interface EndorserMetadataServiceRequest {
  connection_id: string;
  did: string;
  alias: string;
}
