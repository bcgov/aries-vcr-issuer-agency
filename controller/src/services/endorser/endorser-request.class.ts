import { Params } from '@feathersjs/feathers';
import { ServiceSwaggerAddon, ServiceSwaggerOptions } from 'feathers-swagger/types';
import { Application } from '../../declarations';
import { EndorserServiceModel } from '../../models/endorser';
import { EndorserRequestServiceAction, ServiceType } from '../../models/enums';
import { IssuerServiceParams } from '../../models/service-params';
import { AriesAgentData } from '../aries-agent/aries-agent.class';

interface ServiceOptions { }

export class EndorserRequest implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceSwaggerOptions;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<ServiceOptions> = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async create(data: EndorserServiceModel, params?: IssuerServiceParams): Promise<any | Error> {
    const request = {
      tran_id: data.tran_id || '',
      data: { expires_time: '' },
    }
    return await this.app.service('aries-agent').create({
      service: ServiceType.Endorser,
      action: EndorserRequestServiceAction.Create,
      data: request,
    } as AriesAgentData);
  }

  model = {
    title: 'endorser request',
    description: 'Request Transaction Endorsment',
    type: 'object',
  };

  docs: ServiceSwaggerOptions = {
    securities: ['all'],
  };
}
