import { BadRequest } from '@feathersjs/errors';
import { ServiceSwaggerAddon, ServiceSwaggerOptions } from 'feathers-swagger/types';
import { Application } from '../../declarations';
import { AriesCredDefServiceRequest } from '../../models/credential-definition';
import {
  CredDefServiceAction,
  EndorserServiceAction,
  SchemaServiceAction,
  ServiceType
} from '../../models/enums';
import { CredDefError, EndorserError, SchemaError } from '../../models/errors';
import { AriesSchemaServiceRequest, SchemaServiceModel } from '../../models/schema';
import { IssuerServiceParams } from '../../models/service-params';
import { deferServiceOnce, sleep } from '../../utils/sleep';
import { AriesAgentData } from '../aries-agent/aries-agent.class';

interface ServiceOptions { }

export class Schema implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceSwaggerOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async find(params: IssuerServiceParams): Promise<SchemaServiceModel[]> {
    return params.profile.schemas || [];
  }

  async create(
    data: SchemaServiceModel,
    params: IssuerServiceParams
  ): Promise<Partial<SchemaServiceModel> | Error> {
    try {
      if (Array.isArray(data)) {
        return new BadRequest(
          'Only one schema definition can be submitted at once.'
        );
      }

      const agent = this.app.get('agent');
      const eventsService = this.app.service('events');

      let schemaList = (params.profile.schemas || []) as SchemaServiceModel[];
      let schema = data as SchemaServiceModel;
      let isNewSchema = true;

      if (schemaList.length > 0) {
        // find and update existing schema, if necessary - only metadata object should be updated
        schemaList = schemaList.map((existingSchema: SchemaServiceModel) => {
          if (
            existingSchema.schema_name === schema.schema_name &&
            existingSchema.schema_version === schema.schema_version
          ) {
            existingSchema.metadata = schema.metadata;
            schema = existingSchema;
            isNewSchema = false;
          }
          return existingSchema;
        });
      }

      if (isNewSchema) {
        // post schema on ledger
        const schemaAuthorTxn = await this.app.service('aries-agent').create({
          service: ServiceType.Schema,
          action: SchemaServiceAction.Create,
          token: params.profile.wallet.token,
          data: {
            schema_name: schema.schema_name,
            schema_version: schema.schema_version,
            attributes: schema.attributes,
            conn_id: params?.profile?.endorser?.connection_id || '',
          } as AriesSchemaServiceRequest,
        } as AriesAgentData);

        if (!schemaAuthorTxn) {
          throw new SchemaError('Invalid Schema author transaction returned');
        }

        const schemaRequestTxn = await this.app.service('aries-agent').create({
          service: ServiceType.Endorser,
          action: EndorserServiceAction.Create_Request,
          token: params.profile.wallet.token,
          data: {
            tran_id: schemaAuthorTxn?.txn?.transaction_id || '',
            expires_time: new Date().toISOString()
          }
        } as AriesAgentData);

        if (!schemaRequestTxn) {
          throw new EndorserError('Invalid Schema create request transaction returned');
        }

        const schemaTxnMsgId = schemaRequestTxn?.messages_attach?.[0]?.['@id'] || '';
        if (!schemaTxnMsgId) {
          throw new EndorserError('Message Attachment ID could not be found');
        }

        const schemaTxnResult = await deferServiceOnce(schemaTxnMsgId, eventsService, {
          timeout: agent.transactionTimeout
        });
        if (!schemaTxnResult.id) {
          throw new EndorserError('Transaction ID could not be found');
        }
        if (!schemaTxnResult.success) {
          throw new EndorserError('There was a problem endorsing the transaction');
        }

        const schemaId = await this.retryUntil(() => {
          return this.app.service('aries-agent').create({
            service: ServiceType.Schema,
            action: SchemaServiceAction.Find,
            token: params.profile.wallet.token,
            data: {
              schema_name: schema.schema_name,
              schema_version: schema.schema_version,
            }
          } as AriesAgentData);
        });

        if (!schemaId) {
          throw new SchemaError('Schema ID could not be found');
        }

        schema.schema_id = schemaId;

        // add the new schema to the profile
        schemaList.push(schema);

        // Save data to controller db
        await this.app.service('issuer/model').patch(params.profile._id, {
          schemas: schemaList,
        } as Partial<SchemaServiceModel>);

        // create credential definition based on schema
        const credDefAuthorTxn = await this.app.service('aries-agent').create({
          service: ServiceType.CredDef,
          action: CredDefServiceAction.Create,
          token: params.profile.wallet.token,
          data: {
            schema_id: schemaId,
            tag: params.profile.normalizedName,
            support_revocation: false,
            conn_id: params?.profile?.endorser?.connection_id || '',
          } as AriesCredDefServiceRequest,
        } as AriesAgentData);

        if (!credDefAuthorTxn) {
          throw new CredDefError('Invalid Credential Definition author transaction returned');
        }

        const credDefRequestTxn = await this.app.service('aries-agent').create({
          service: ServiceType.Endorser,
          action: EndorserServiceAction.Create_Request,
          token: params.profile.wallet.token,
          data: {
            tran_id: credDefAuthorTxn?.txn?.transaction_id || '',
            expires_time: new Date().toISOString()
          }
        } as AriesAgentData);

        if (!credDefRequestTxn) {
          throw new EndorserError(
            'Invalid Credential Defintiion create request transaction returned'
          );
        }

        const credDefTxnMsgId = credDefRequestTxn?.messages_attach?.[0]?.['@id'] || '';
        if (!credDefTxnMsgId) {
          throw new EndorserError('Message Attachment ID could not be found');
        }

        const credDefTxnResult = await deferServiceOnce(credDefTxnMsgId, eventsService, {
          timeout: agent.transactionTimeout
        });
        if (!credDefTxnResult.id) {
          throw new EndorserError('Transaction ID could not be found');
        }
        if (!credDefTxnResult.success) {
          throw new EndorserError('There was a problem endorsing the transaction');
        }

        const credDefId = await this.retryUntil(() => {
          return this.app.service('aries-agent').create({
            service: ServiceType.CredDef,
            action: CredDefServiceAction.Find,
            token: params.profile.wallet.token,
            data: {
              schema_name: schema.schema_name,
              schema_version: schema.schema_version,
            }
          } as AriesAgentData);
        });

        if (!credDefId) {
          throw new CredDefError('Credential Defnition ID could not be found');
        }

        schema.credential_definition_id = credDefId;
      }

      // Save data to controller db
      await this.app.service('issuer/model').patch(params.profile._id, {
        schemas: schemaList,
      } as Partial<SchemaServiceModel>);

      return {
        schema_id: schema.schema_id,
        credential_definition_id: schema.credential_definition_id,
      };
    } catch (e) {
      throw e as Error;
    }
  }

  /**
   * WARNING: This is a temporary hack, and should be used sparingly if at all.
   * Please remove this function as soon as a fix can be generated.
   * 
   * There are situations where a wallet query for created Schemas or Credential Definitions
   * temporarily returns empty results immediately after an endorsement transaction has
   * successfully completed and the Schema or Credential Definition has been written
   * to the ledger.
   * 
   * This hack retries the wallet query up to a maximum number of retries, with an exponential
   * delay on each retry. Upon exhaustion, the function will return an empty result which will
   * result in an error to be handled by the caller.
   */
  private async retryUntil(
    fn: () => Promise<string>,
    retries: number = 3,
    delayMs: number = 10,
    delayFactor: number = 10
  ): Promise<string> {
    let replay = 0;
    let res = '';
    while (replay < retries) {
      try {
        const delay = delayMs * (delayFactor ** replay++);
        console.debug(`Replaying ${replay} of ${retries} with delay ${delay} ms`);
        await sleep(delay);
        res = await fn();
        if (res) {
          return res;
        }
      } catch (error) {
        console.debug(`Error on replay ${replay} of ${retries}. Retrying...`, error);
      }
    }
    return res;
  }

  model = {
    title: 'issue schema',
    description: 'Issue Schema Model',
    type: 'object',
    required: ['attributes', 'schema_name', 'schema_version', 'metadata'],
    properties: {
      schema_id: {
        type: 'string',
        description: 'The schema identifier as it appears on the Ledger.',
        readOnly: true,
      },
      credential_definition_id: {
        type: 'string',
        description:
          'The credential definition identifier as it appears on the Ledger.',
        readOnly: true,
      },
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
        type: 'array',
        description: 'List of attributes associated with this schema.',
        items: {
          type: 'string',
        },
      },
      metadata: {
        type: 'object',
        description: 'The metadata associated by the issuer to this schema.',
        properties: {
          topic: {
            type: 'array',
            description:
              'The mappings between the filed containing the topic and the upstream schema defining the topic in the system.',
            items: {
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of the field to be mapped to a topic.',
                },
                topic_type: {
                  type: 'string',
                  description:
                    'The type (schema name) of the topic being mapped to.',
                },
              },
            },
          },
          highlighted_attributes: {
            type: 'array',
            description: 'List of additional attributes to be highlighted on the credential',
            items:{
              type: 'string'
            }
          },
          credential_title: {
            type: 'string',
            description: 'The attribute used to define the credential'
          },
          cardinality: {
            type: 'array',
            description:
              'List of fields to be used for the credential cardinality.',
            items: {
              type: 'string',
            },
          },
          date_fields: {
            type: 'object',
            properties: {
              effective_date: {
                type: 'string',
                description:
                  'The name of the field to be mapped to the credential effective date.',
              },
              revoked_date: {
                type: 'string',
                description:
                  'The name of the field to be mapped to the credential revoked date.',
              },
              other_date_fields: {
                type: 'array',
                description: 'List of fields representing dates.',
                items: {
                  type: 'string',
                },
              },
            },
          },
          address_fields: {
            type: 'array',
            description: 'The list of address field mappings.',
            items: {
              type: 'object',
              properties: {
                addressee: {
                  type: 'string',
                  description: 'The name of the field to be used as addressee.',
                },
                civic_address: {
                  type: 'string',
                  description:
                    'The name of the field to be used as civic_address.',
                },
                city: {
                  type: 'string',
                  description:
                    'The name of the field to be used as civic_address.',
                },
                province: {
                  type: 'string',
                  description:
                    'The name of the field to be used as civic_address.',
                },
                postal_code: {
                  type: 'string',
                  description:
                    'The name of the field to be used as civic_address.',
                },
                country: {
                  type: 'string',
                  description:
                    'The name of the field to be used as civic_address.',
                },
              },
            },
          },
          search_fields: {
            type: 'array',
            description: 'List of fields that will be indexed for searching.',
            items: {
              type: 'string',
            },
          },
          labels: {
            type: 'object',
            properties: {
              schema: {
                type: 'object',
                description: 'The localizations for the schema name.',
                properties: {
                  lan_1: {
                    type: 'string',
                    description: 'The schema name for lan_1',
                  },
                  lan_2: {
                    type: 'string',
                    description: 'The schema name for lan_2',
                  },
                },
              },
              attributes: {
                type: 'array',
                description:
                  'The localizations for the schema attribute labels.',
                items: {
                  properties: {
                    name: {
                      type: 'string',
                      description: 'The name of the field to be localized.',
                    },
                    translations: {
                      type: 'object',
                      description: 'The translations for this attribute label.',
                      properties: {
                        lan_1: {
                          type: 'object',
                          properties: {
                            label: {
                              type: 'string',
                            },
                            description: {
                              type: 'string',
                            },
                          },
                        },
                        lan_2: {
                          type: 'object',
                          properties: {
                            label: {
                              type: 'string',
                            },
                            description: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  docs: ServiceSwaggerOptions = {
    description: 'Schema management endpoints.',
    refs: {
      createRequest: 'create_schema_request',
      createResponse: 'create_schema_response',
    },
    definitions: {
      create_schema_request: {
        title: 'issue schema request',
        type: 'object',
        required: ['attributes', 'schema_name', 'schema_version', 'metadata'],
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
      create_schema_response: {
        title: 'issue schema response',
        type: 'object',
        required: [],
        properties: {
          schema_id: {
            type: 'string',
            description: 'The schema identifier as it appears on the Ledger.',
          },
          credential_definition_id: {
            type: 'string',
            description:
              'The credential definition identifier as it appears on the Ledger.',
          },
        },
      },
    },
    securities: ['all'],
  };
}
