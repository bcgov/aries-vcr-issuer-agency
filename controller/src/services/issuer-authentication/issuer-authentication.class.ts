import { NotImplemented } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from 'feathers-swagger/types';
import { Application } from '../../declarations';

interface Data {}

interface ServiceOptions {}

export class IssuerAuthentication implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceSwaggerOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<Data> {
    return new NotImplemented();
  }

  docs: ServiceSwaggerOptions = {
    description: 'Issuer api key management.',
    idType: 'string',
    refs: {
      createRequest: 'empty_body',
    },
    definitions: {
      empty_body: {
        title: 'Empty service body',
        type: 'object',
        required: [],
        properties: {},
      },
    },
    operations: {},
    securities: ['all'],
  };

  model = {
    title: 'Issuer Authentication',
    description: 'Issuer Authentication - API Key',
    type: 'object',
    required: ['api-key'],
    properties: {
      'api-key': {
        type: 'string',
        description: 'The issuer\'s api-key',
      },
    },
  };
}
