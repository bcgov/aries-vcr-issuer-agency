import { NotImplemented } from '@feathersjs/errors';
import { rest } from '@feathersjs/express';
import { NullableId, Params } from '@feathersjs/feathers';
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from 'feathers-swagger/types';
import { Application } from '../../declarations';

interface Data {}

interface ServiceOptions {}

export class IssuerProfile implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceSwaggerOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(): Promise<Data> {
    return new NotImplemented();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<Data> {
    return new NotImplemented();
  }

  model = {
    title: 'Issuer',
    description: 'Base Issuer Model',
    type: 'object',
    required: ['name', 'abbreviation', 'url', 'email', 'logo'],
    properties: {
      did: {
        type: 'string',
        description: "The issuer's DID.",
        readOnly: true,
      },
      verkey: {
        type: 'string',
        description: "The issuer's verkey.",
        readOnly: true,
      },
      name: {
        type: 'string',
        description: "The issuer's name.",
      },
      abbreviation: {
        type: 'string',
        description: "The issuer's name abbreviation.",
      },
      url: {
        type: 'string',
        description: "The issuer's URL.",
      },
      email: {
        type: 'string',
        description: "The issuer's email address.",
      },
      logo: {
        type: 'string',
        description: "The issuer's base64-encoded logo.",
      },
    },
  };

  docs: ServiceSwaggerOptions = {
    description: 'Self-serve issuer profile management.',
    idType: 'string',
    idNames: {
      update: 'name',
    },
    refs: {
      findResponse: 'find_response',
    },
    definitions: {
      find_response: {
        title: 'Find service response',
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
