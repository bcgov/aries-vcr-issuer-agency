import { GeneralError, NotImplemented } from '@feathersjs/errors';
import { Paginated, Params } from '@feathersjs/feathers';
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from 'feathers-swagger/types';
import { Application } from '../../declarations';
import { IssuerProfile } from '../../models/issuer-model';
import { v4 as uuidv4 } from 'uuid';

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
  async create(data: Data, params?: Params): Promise<Data> {
    const headers = params?.headers || {};
    const apiKeyHeader = headers['issuer-api-key'] as string;

    const findProfile = (await this.app.service('issuer-model').find({
      query: { 'api-key': apiKeyHeader },
      collation: { locale: 'en', strength: 1 },
    })) as Paginated<IssuerProfile>;
    const existingProfile = findProfile.data[0];

    if (!existingProfile._id) {
      throw new GeneralError(
        'Unable to determine the identifier for the profile to be updated, please contact an administrator.'
      );
    }

    const newApiKey = uuidv4();
    await this.app.service('issuer-model').patch(existingProfile._id, {
      'api-key': newApiKey,
    });

    return { 'api-key': newApiKey };
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
