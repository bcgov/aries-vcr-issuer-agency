import Axios from 'axios';

export interface AppConfig {
  controller: {
    url: string;
  }
}

export async function getAppConfig (): Promise<AppConfig> {
  const appConfig = await Axios.get('config/config.json');
  return Promise.resolve(appConfig.data as AppConfig);
}
