import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from 'feathers-swagger/types';
import { Application } from '../../declarations';
import { IssuerProfileModel } from '../../models/issuer-model';
import { IssuerServiceParams } from '../../models/service-params';

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

  async find(
    params: IssuerServiceParams
  ): Promise<Partial<IssuerProfileModel> | Error> {
    try {
      return {
        did: params.profile.did,
        verkey: params.profile.verkey,
        name: params.profile.name,
        abbreviation: params.profile.abbreviation || '',
        url: params.profile.url || '',
        email: params.profile.email || '',
        logo: params.profile.logo || '',
      };
    } catch (e) {
      return e as Error;
    }
  }

  async create(
    data: Data,
    params: IssuerServiceParams
  ): Promise<IssuerProfileModel | Error> {
    try {
      const updatedProfile = await this.app
        .service('issuer/model')
        .patch(params.profile._id, {
          abbreviation: data.abbreviation || '',
          url: data.url || '',
          email: data.email || '',
          logo: data.logo || '',
        } as Partial<IssuerProfileModel>);
      return {
        did: updatedProfile.did,
        verkey: updatedProfile.verkey,
        name: updatedProfile.name,
        abbreviation: updatedProfile.abbreviation || '',
        url: updatedProfile.url || '',
        email: updatedProfile.email || '',
        logo: updatedProfile.logo || '',
      } as IssuerProfileModel;
    } catch (e) {
      return e as Error;
    }
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
        readOnly: true,
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
