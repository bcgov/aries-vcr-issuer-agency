import { NotImplemented } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions
} from 'feathers-swagger/types';
import { Application } from '../../declarations';

interface Data {}

interface ServiceOptions {}

export class TaaAccept implements ServiceSwaggerAddon {
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
    refs: {
      createResponse: 'empty_body',
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
    type: 'object',
    properties: {
      mechanism: {
        description: 'The TAA acceptance mechanism.',
        type: 'string',
      },
      text: {
        description: 'The text of the TAA at the time of acceptance.',
        type: 'string',
      },
      version: {
        description: 'The version of the TAA at the time of acceptance.',
        type: 'string',
      },
    },
  };
}
