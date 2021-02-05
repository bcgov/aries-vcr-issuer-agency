import { GeneralError, NotImplemented } from '@feathersjs/errors';
import { Paginated, Params } from '@feathersjs/feathers';
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from 'feathers-swagger/types';
import { Application } from '../../declarations';
import { DuplicatedProfileError } from '../../models/errors';
import { IssuerProfile as IssuerProfileModel } from '../../models/issuer-model';

interface Data {
  abbreviation: string;
  url: string;
  email: string;
  logo: string;
}

interface ServiceOptions {}

export class IssuerProfile implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceSwaggerOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params: Params): Promise<IssuerProfileModel> {
    const headers = params.headers || {};
    const apiKeyHeader = headers['issuer-api-key'] as string;

    const result = (await this.app.service('issuer-model').find({
      query: { 'api-key': apiKeyHeader },
      collation: { locale: 'en', strength: 1 },
    })) as Paginated<any>;

    if (result.total > 1 || result.data.length !== 1) {
      throw new DuplicatedProfileError(
        'The request returned inconsistent data, please contact an administrator.'
      );
    }

    return {
      did: result.data[0].did,
      verkey: result.data[0].verkey,
      name: result.data[0].name,
      abbreviation: result.data[0].abbreviation || '',
      url: result.data[0].url || '',
      email: result.data[0].email || '',
      logo: result.data[0].logo || '',
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<IssuerProfileModel> {
    const headers = params?.headers || {};
    const apiKeyHeader = headers['issuer-api-key'] as string;

    const findProfile = (await this.app.service('issuer-model').find({
      query: { 'api-key': apiKeyHeader },
      collation: { locale: 'en', strength: 1 },
    })) as Paginated<IssuerProfileModel>;
    const existingProfile = findProfile.data[0];

    if (!existingProfile._id) {
      throw new GeneralError(
        'Unable to determine the identifier for the profile to be updated, please contact an administrator.'
      );
    }
    const updatedProfile = await this.app
      .service('issuer-model')
      .patch(existingProfile._id, {
        abbreviation: data.abbreviation || '',
        url: data.url || '',
        email: data.email || '',
        logo: data.logo || '',
      });
    return {
      did: updatedProfile.did,
      verkey: updatedProfile.verkey,
      name: updatedProfile.name,
      abbreviation: updatedProfile.abbreviation || '',
      url: updatedProfile.url || '',
      email: updatedProfile.email || '',
      logo: updatedProfile.logo || '',
    };
  }

  model = {
    description: 'Issuer Profile Model',
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
      findResponse: 'issuer_find_response',
    },
    definitions: {
      issuer_find_response: {
        title: 'issuer find',
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
