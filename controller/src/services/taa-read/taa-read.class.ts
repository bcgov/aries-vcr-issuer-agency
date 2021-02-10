import { Params } from '@feathersjs/feathers';
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from 'feathers-swagger/types';
import { Application } from '../../declarations';
import { LedgerServiceAction, ServiceType } from '../../models/enums';
import { TAAServiceResponse } from '../../models/ledger';
import { AriesAgentData } from '../aries-agent/aries-agent.class';

interface Data {}

interface ServiceOptions {}

export class TaaRead implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceSwaggerOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params: Params): Promise<TAAServiceResponse | Error> {
    try {
      const taa = await this.app.service('aries-agent').create({
        service: ServiceType.Ledger,
        action: LedgerServiceAction.TAA_Fetch,
        token: params.profile.wallet.token,
      } as AriesAgentData);
      return {
        aml: taa.aml_record || {},
        taa_accepted: taa.taa_accepted || {},
        taa_record: taa.taa_record || {},
        taa_required: taa.taa_required,
      } as TAAServiceResponse;
    } catch (e) {
      return e as Error;
    }
  }

  model = {
    type: 'object',
    properties: {
      aml: {
        type: 'object',
        description: 'List of all the possible TAA acceptance methods.',
        properties: {
          method_1: { type: 'string' },
          method_2: { type: 'string' },
          method_3: { type: 'string' },
        },
        readOnly: true,
      },
      taa_accepted: {
        type: 'object',
        description: 'Details on the current TAA acceptance status.',
        properties: { mechanism: { type: 'string' }, time: { type: 'number' } },
      },
      taa_record: {
        type: 'object',
        description: 'The TAA record, as appears on the Ledger.',
        properties: {
          digest: { type: 'string' },
          text: { type: 'string' },
          version: { type: 'string' },
        },
      },
      taa_required: {
        type: 'boolean',
        description: 'Indicates wether the TAA is required.',
        readOnly: true,
      },
    },
  };

  docs: ServiceSwaggerOptions = {
    refs: {
      findResponse: 'get_taa',
    },
    definitions: {
      get_taa: {
        title: 'get taa',
        type: 'object',
        required: [],
        properties: this.model.properties,
      },
    },
    operations: {
      find: {
        'parameters[0]': undefined,
        'parameters[1]': undefined,
      },
    },
    securities: ['all'],
  };
}
