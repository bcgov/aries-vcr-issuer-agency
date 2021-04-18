import { BadRequest } from '@feathersjs/errors';
import { ServiceSwaggerAddon, ServiceSwaggerOptions, } from 'feathers-swagger/types';
import { Application } from '../../declarations';
import { AriesCredPreview, AriesCredPreviewAttribute, AriesCredServiceRequest, CredServiceModel } from '../../models/credential';
import { CredServiceAction, ServiceType } from '../../models/enums';
import { SchemaServiceModel } from '../../models/schema';
import { IssuerServiceParams } from '../../models/service-params';
import { AriesAgentData } from '../aries-agent/aries-agent.class';

interface ServiceOptions { }

abstract class CredentialBase implements ServiceSwaggerAddon {
  protected abstract formatCredServiceRequest(
    data: CredServiceModel, params: IssuerServiceParams | undefined, existingSchema: SchemaServiceModel
  ): AriesCredServiceRequest;

  protected abstract findSchema(
    schemas: SchemaServiceModel[], credSchemaName: string, credSchemaVersion: string
  ): SchemaServiceModel | undefined;

  protected abstract dispatch(
    action: CredServiceAction, params: IssuerServiceParams | undefined, data: AriesCredServiceRequest
  ): Promise<any | Error>;

  protected abstract sendCredServiceRequest(
    params: IssuerServiceParams | undefined, offer: AriesCredServiceRequest
  ): Promise<any | Error>;

  protected abstract receiveCredServiceResponse(): void;

  protected abstract create(
    data: CredServiceModel, params?: IssuerServiceParams
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
  // TODO: This needs to be attached to the request context instead,
  // it needs to be ephemeral to the request
  request: { pending: Promise<void>[], results: any[] }

  constructor(options: ServiceOptions = {}, app: Application) {
    super();
    this.options = options;
    this.app = app;
    // TODO: This needs to be attached to the request context instead,
    // it needs to be ephemeral to the request
    this.request = { pending: [], results: [] };
  }

  private formatCredAttributes(
    cred: CredServiceModel
  ): AriesCredPreviewAttribute[] {
    const attributes: AriesCredPreviewAttribute[] = [];
    for (const attribute in cred?.attributes) {
      if (Object.prototype.hasOwnProperty.call(cred?.attributes, attribute)) {
        attributes.push({
          'name': attribute,
          'mime-type': 'text/plain',
          'value': cred?.attributes[attribute].toString()
        } as AriesCredPreviewAttribute);
      }
    }
    return attributes;
  }

  private formatCredOffer(
    attributes: AriesCredPreviewAttribute[], params: IssuerServiceParams | undefined, schema: SchemaServiceModel
  ): AriesCredServiceRequest {
    return {
      credential_preview: {
        '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/2.0/credential-preview',
        'attributes': attributes
      } as AriesCredPreview,
      connection_id: params?.profile?.vcr_connection_id || '',
      filter: {
        indy: {
          issuer_did: params?.profile?.did || '',
          schema_issuer_did: params?.profile?.did || '',
          schema_id: schema?.schema_id,
          schema_name: schema?.schema_name,
          schema_version: schema?.schema_version,
          cred_def_id: schema?.credential_definition_id
        }
      }
    };
  }

  private deferCredEx(cred_ex_id: string): Promise<void> {
    const credService = this.app.service('issuer/credentials');
    return new Promise((resolve) => credService
      .once(cred_ex_id, (data: any) => {
        this.request.results.push(data);
        resolve(cred_ex_id);
      }))
      .then(() => {});
  }

  formatCredServiceRequest(
    data: CredServiceModel, params: IssuerServiceParams | undefined, existingSchema: SchemaServiceModel
  ): AriesCredServiceRequest {
    const credPreviewAttributes: AriesCredPreviewAttribute[] = this.formatCredAttributes(data);
    const credOffer: AriesCredServiceRequest = this.formatCredOffer(credPreviewAttributes, params, existingSchema);
    return credOffer;
  }

  findSchema(
    schemas: SchemaServiceModel[], credSchemaName: string, credSchemaVersion: string
  ): SchemaServiceModel | undefined {
    return schemas.find((schema: SchemaServiceModel) => {
      return schema.schema_name === credSchemaName && schema.schema_version === credSchemaVersion;
    });
  }

  async dispatch(
    action: CredServiceAction, params: IssuerServiceParams | undefined, data: AriesCredServiceRequest
  ): Promise<any | Error> {
    return await this.app.service('aries-agent').create({
      service: ServiceType.Cred,
      action,
      token: params?.profile?.wallet?.token,
      data,
    } as AriesAgentData);
  }

  async sendCredServiceRequest(
    params: IssuerServiceParams | undefined, offer: AriesCredServiceRequest
  ): Promise<any | Error> {
    return await this.dispatch(CredServiceAction.Create, params, offer);
  }

  async receiveCredServiceResponse(): Promise<any[]> {
    await Promise.all(this.request.pending);
    return this.request.results;
  }

  async create(
    data: CredServiceModel, params?: IssuerServiceParams
  ): Promise<any | Error> {
    const { schema_name: credSchemaName, schema_version: credSchemaVersion } = data;
    const schemas = (params?.profile?.schemas || []) as SchemaServiceModel[];
    const existingSchema = this.findSchema(schemas, credSchemaName, credSchemaVersion);
    if (!existingSchema) {
      return new BadRequest(
        `Schema: ${credSchemaName} with version: ${credSchemaVersion} does not exist.`
      );
    }

    if (Array.isArray(data)) {
      throw new Error('Not implemented');
    }

    const credOffer: AriesCredServiceRequest = this.formatCredServiceRequest(data, params, existingSchema);
    const request: any = await this.sendCredServiceRequest(params, credOffer);
    const cred_ex_id: string = request?.cred_ex_id;

    if (cred_ex_id) {
      this.request.pending.push(this.deferCredEx(cred_ex_id));
    } else {
      // TODO: Gracefully handle the error here
    }

    console.log(this.request);

    return await this.receiveCredServiceResponse();
  }
}

export class CredentialSend extends Credential {
  constructor(options: ServiceOptions = {}, app: Application) {
    super(options, app);
  }

  async sendCredServiceRequest(
    params: IssuerServiceParams | undefined, offer: AriesCredServiceRequest
  ): Promise<Partial<CredServiceModel> | Error> {
    return await this.dispatch(CredServiceAction.Send, params, offer);
  }
}
