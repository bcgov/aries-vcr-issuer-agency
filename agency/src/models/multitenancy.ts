export interface MultitenancyServiceRequest {
  label: string;
  wallet_name: string;
  wallet_key: string;
  wallet_type: string;
  key_management_mode: string;
  wallet_dispatch_type: string;
  wallet_webhook_urls: string[];
}

export interface MultitenancyServiceResponse {
  key_management_mode: string;
  updated_at: string;
  settings: {
    'wallet.type': string;
    'wallet.name': string;
    'wallet.webhook_urls': string[];
    'wallet.dispatch_type': string;
    default_label: string;
    image_url: string;
    'wallet.id': string;
  };
  wallet_id: string;
  created_at: string;
  token: string;
}
