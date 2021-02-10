import { Params } from '@feathersjs/feathers';
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from 'feathers-swagger/types';
import { v4 as uuidv4 } from 'uuid';
import { Application } from '../../declarations';

interface Data {
  'api-key': string;
}

interface ServiceOptions {}

export class IssuerAuthentication implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceSwaggerOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<Data | Error> {
    try {
      const newApiKey = uuidv4();
      await this.app.service('issuer-model').patch(params?.profile._id, {
        'api-key': newApiKey,
      });

      return { 'api-key': newApiKey };
    } catch (e) {
      return e as Error;
    }
  }

  docs: ServiceSwaggerOptions = {
    description: 'Issuer api key management.',
    idType: 'string',
    refs: {
      createRequest: 'empty_body',
    },
    definitions: {
      empty_body: {
        title: 'empty',
        type: 'object',
        required: [],
        properties: {},
      },
    },
    operations: {},
    securities: ['all'],
  };

  model = {
    title: 'authentication',
    description: 'Issuer Authentication - API Key',
    type: 'object',
    required: ['api-key'],
    properties: {
      'api-key': {
        type: 'string',
        description: "The issuer's api-key",
      },
    },
  };
}
