import { BadRequest } from '@feathersjs/errors';
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from 'feathers-swagger/types';
import { Application } from '../../declarations';
import { AriesCredProposalAttribute, AriesCredServiceRequest, CredServiceModel } from '../../models/credential';
import { CredServiceAction, ServiceType } from '../../models/enums';
import { SchemaServiceModel } from '../../models/schema';
import { IssuerServiceParams } from '../../models/service-params';
import { AriesAgentData } from '../aries-agent/aries-agent.class';

interface ServiceOptions { }

export class Credentials implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceSwaggerOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: CredServiceModel, params?: IssuerServiceParams): Promise<Partial<CredServiceModel> | Error> {
    if (Array.isArray(data)) {
      throw new Error('Not implemented');
    }

    const credential: CredServiceModel = data;
    const { schema_name: credential_schema_name, schema_version: credential_schema_version } = credential;

    const schemas = (params?.profile?.schemas || []) as SchemaServiceModel[];
    const existingSchema = schemas.find((schema: SchemaServiceModel) => {
      return schema.schema_name === credential_schema_name && schema.schema_version === credential_schema_version;
    });

    if (!existingSchema) {
      return new BadRequest(
        `Schema: ${credential_schema_name} with version: ${credential_schema_version} does not exist.`
      );
    }

    const credentialProposalAttributes: AriesCredProposalAttribute[] = [];
    for (const attribute in credential?.attributes) {
      if (Object.prototype.hasOwnProperty.call(credential?.attributes, attribute)) {
        credentialProposalAttributes.push({
          'name': attribute,
          'mime-type': 'text/plain',
          'value': credential?.attributes[attribute].toString()
        } as AriesCredProposalAttribute);
      }
    }

    const credentialOffer: AriesCredServiceRequest = {
      issuer_did: params?.profile?.did || '',
      schema_issuer_did: params?.profile?.did || '',
      schema_id: existingSchema?.schema_id,
      schema_name: existingSchema?.schema_name,
      schema_version: existingSchema?.schema_version,
      cred_def_id: existingSchema?.credential_definition_id,
      credential_proposal: {
        '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview',
        'attributes': credentialProposalAttributes
      },
      connection_id: params?.profile?.vcr_connection_id || '',
    }

    const credResponse = (await this.app.service('aries-agent').create({
      service: ServiceType.Cred,
      action: CredServiceAction.Create,
      token: params?.profile?.wallet?.token,
      data: credentialOffer,
    } as AriesAgentData));

    return credResponse;
  }

  model = {
    title: 'issue credential',
    description: 'Issue Credential Model',
    type: 'object',
    required: ['schema_name', 'schema_version', 'attributes'],
    optional: ['metadata'],
    properties: {
      schema_name: {
        type: 'string',
        description: 'The name of the schema.',
        readOnly: true,
      },
      schema_version: {
        type: 'string',
        description: 'The version of the schema.',
        readOnly: true,
      },
      attributes: {
        type: 'object',
        description: 'Attributes associated with this schema.',
        items: {
          type: 'object',
        },
      },
    },
  };

  docs: ServiceSwaggerOptions = {
    description: 'Issue credentials endpoints.',
    refs: {
      createRequest: 'issue_credential_request',
      createResponse: 'issue_credential_response',
    },
    definitions: {
      issue_credential_request: {
        title: 'issue credential request',
        type: 'object',
        required: ['attributes', 'schema_name', 'schema_version'],
        optional: ['metadata'],
        properties: Object.assign({}, this.model.properties, {
          schema_name: {
            type: 'string',
            description: 'The name of the schema.',
          },
          schema_version: {
            type: 'string',
            description: 'The version of the schema.',
          },
        }),
      },
      issue_credential_response: {
        title: 'issue credential response',
        type: 'object',
        required: [],
        properties: {
          credential_exchange_id: {
            type: 'string',
            description:
              'The credential exchange identifier assigned by the issuing agent.',
          },
          status: {
            type: 'string',
            description: 'The status of the credential issuance.',
          },
        },
      },
    },
    securities: ['all'],
  };
}
