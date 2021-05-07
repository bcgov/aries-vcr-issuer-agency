import { BadRequest, GeneralError } from '@feathersjs/errors';
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from 'feathers-swagger/types';
import { Application } from '../../declarations';
import {
  AriesCredPreview,
  AriesCredPreviewAttribute,
  AriesCredServiceRequest,
  CredServiceModel,
} from '../../models/credential';
import { CredServiceAction, ServiceType } from '../../models/enums';
import { SchemaServiceModel } from '../../models/schema';
import { IssuerServiceParams } from '../../models/service-params';
import { AriesAgentData } from '../aries-agent/aries-agent.class';

interface ServiceOptions {}

abstract class CredentialBase implements ServiceSwaggerAddon {
  protected abstract formatCredServiceRequest(
    existingSchema: SchemaServiceModel,
    data: CredServiceModel,
    params: IssuerServiceParams
  ): AriesCredServiceRequest;

  protected abstract findSchema(
    schemas: SchemaServiceModel[],
    credSchemaName: string,
    redSchemaVersion: string
  ): SchemaServiceModel | undefined;

  protected abstract dispatch(
    action: CredServiceAction,
    data: AriesCredServiceRequest,
    params: IssuerServiceParams
  ): Promise<any | Error>;

  protected abstract sendCredServiceRequest(
    offer: AriesCredServiceRequest,
    params: IssuerServiceParams
  ): Promise<any | Error>;

  protected abstract receiveCredServiceResponse(
    params: IssuerServiceParams
  ): Promise<any[] | Error>;

  protected abstract create(
    data: CredServiceModel,
    params: IssuerServiceParams
  ): Promise<any | Error>;

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

  // TODO: Update swagger docs
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

export class Credential extends CredentialBase {
  app: Application;
  options: ServiceSwaggerOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    super();
    this.options = options;
    this.app = app;
  }

  private formatCredAttributes(
    cred: CredServiceModel
  ): AriesCredPreviewAttribute[] {
    const attributes: AriesCredPreviewAttribute[] = [];
    for (const attribute in cred?.attributes) {
      if (Object.prototype.hasOwnProperty.call(cred?.attributes, attribute)) {
        attributes.push({
          name: attribute,
          'mime-type': 'text/plain',
          value: cred?.attributes[attribute].toString(),
        } as AriesCredPreviewAttribute);
      }
    }
    return attributes;
  }

  private formatCredProposal(
    attributes: AriesCredPreviewAttribute[],
    params: IssuerServiceParams,
    schema: SchemaServiceModel
  ): AriesCredServiceRequest {
    return {
      credential_preview: {
        '@type':
          'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/2.0/credential-preview',
        attributes: attributes,
      } as AriesCredPreview,
      connection_id: params?.profile?.vcr.connection_id || '',
      filter: {
        indy: {
          issuer_did: params?.profile?.did || '',
          schema_issuer_did: params?.profile?.did || '',
          schema_id: schema?.schema_id,
          schema_name: schema?.schema_name,
          schema_version: schema?.schema_version,
          cred_def_id: schema?.credential_definition_id,
        },
      },
    };
  }

  private deferCredEx(
    credExId: string,
    params: IssuerServiceParams,
    idx?: number
  ): Promise<void> {
    const credService = this.app.service('events');
    return new Promise((resolve) =>
      credService.once(credExId, () => {
        const res = { credExId, order: idx, success: true };
        params.credentials.results.push(res);
        resolve(res);
      })
    ).then();
  }

  formatCredServiceRequest(
    existingSchema: SchemaServiceModel,
    data: CredServiceModel,
    params: IssuerServiceParams
  ): AriesCredServiceRequest {
    const credPreviewAttributes: AriesCredPreviewAttribute[] = this.formatCredAttributes(
      data
    );
    return this.formatCredProposal(
      credPreviewAttributes,
      params,
      existingSchema
    );
  }

  findSchema(
    schemas: SchemaServiceModel[],
    credSchemaName: string,
    credSchemaVersion: string
  ): SchemaServiceModel | undefined {
    return schemas.find((schema: SchemaServiceModel) => {
      return (
        schema.schema_name === credSchemaName &&
        schema.schema_version === credSchemaVersion
      );
    });
  }

  findExistingSchema(
    data: CredServiceModel,
    params: IssuerServiceParams
  ): {
    credSchemaName: string;
    credSchemaVersion: string;
    existingSchema: SchemaServiceModel | undefined;
  } {
    const {
      schema_name: credSchemaName,
      schema_version: credSchemaVersion,
    } = data;
    const schemas = (params?.profile?.schemas || []) as SchemaServiceModel[];
    return {
      credSchemaName,
      credSchemaVersion,
      existingSchema: this.findSchema(
        schemas,
        credSchemaName,
        credSchemaVersion
      ),
    };
  }

  async dispatch(
    action: CredServiceAction,
    data: AriesCredServiceRequest,
    params: IssuerServiceParams
  ): Promise<any | Error> {
    return await this.app.service('aries-agent').create({
      service: ServiceType.Cred,
      action,
      token: params?.profile?.wallet?.token,
      data,
    } as AriesAgentData);
  }

  async sendCredServiceRequest(
    offer: AriesCredServiceRequest,
    params: IssuerServiceParams
  ): Promise<any | Error> {
    return await this.dispatch(CredServiceAction.Create, offer, params);
  }

  async receiveCredServiceResponse(
    params: IssuerServiceParams
  ): Promise<any[]> {
    await Promise.all(params.credentials.pending);
    return params.credentials.results;
  }

  async createOne(
    data: CredServiceModel,
    params: IssuerServiceParams,
    idx?: number
  ): Promise<void> {
    try {
      const {
        credSchemaName,
        credSchemaVersion,
        existingSchema,
      } = this.findExistingSchema(data, params);
      if (!existingSchema) {
        throw new BadRequest(
          `Schema: ${credSchemaName} with version: ${credSchemaVersion} does not exist.`
        );
      } else {
        const credProposal: AriesCredServiceRequest = this.formatCredServiceRequest(
          existingSchema,
          data,
          params
        );
        const request: any = await this.sendCredServiceRequest(
          credProposal,
          params
        );
        const credExId: string = request?.cred_ex_id;
        if (credExId) {
          params.credentials.pending.push(
            this.deferCredEx(credExId, params, idx)
          );
        } else {
          throw new GeneralError(
            `Could not obtain Credential Exchange ID for request: ${data}`
          );
        }
      }
    } catch (error) {
      const res = { error, order: idx, success: false };
      params.credentials.results.push(res);
    }
  }

  async create(
    data: CredServiceModel,
    params: IssuerServiceParams
  ): Promise<any | Error> {
    if (Array.isArray(data)) {
      await Promise.all(
        data.map((datum, idx) => this.createOne(datum, params, idx))
      );
    } else {
      await this.createOne(data, params);
    }
    return await this.receiveCredServiceResponse(params);
  }
}
