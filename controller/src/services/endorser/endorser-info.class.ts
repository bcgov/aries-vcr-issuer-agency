import { ServiceSwaggerAddon, ServiceSwaggerOptions } from 'feathers-swagger/types';
import { Application } from '../../declarations';
import { EndorserInfoServiceAction, ServiceType } from '../../models/enums';
import { IssuerServiceParams } from '../../models/service-params';
import { AriesAgentData } from '../aries-agent/aries-agent.class';

interface ServiceOptions { }

export class EndorserInfo implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceSwaggerOptions;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<ServiceOptions> = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async create(data: Partial<any> | Partial<any>[], params: IssuerServiceParams): Promise<any | Error> {
    const request = {
      connection_id: params?.profile?.vcr_connection_id || '',
      endorser_did: params?.profile?.endorser_did || ''
    }
    return await this.app.service('aries-agent').create({
      service: ServiceType.Endorser,
      action: EndorserInfoServiceAction.Create,
      data: request,
    } as AriesAgentData);
  }

  model = {
    title: 'endorser info',
    description: 'Set Endorser Info',
    type: 'object',
  };

  docs: ServiceSwaggerOptions = {
    securities: ['all'],
  };
}
