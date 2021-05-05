import { BadRequest } from '@feathersjs/errors';
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from 'feathers-swagger/types';
import { Application } from '../../declarations';
import {
  AriesCredDefServiceRequest,
  CredDefServiceResponse,
} from '../../models/credential-definition';
import { SchemaServiceAction, ServiceType } from '../../models/enums';
import {
  AriesSchema,
  AriesSchemaServiceRequest,
  SchemaServiceModel,
} from '../../models/schema';
import { IssuerServiceParams } from '../../models/service-params';
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
        // return Promise.all(data.map((current) => this.create(current, params)));
        return new BadRequest(
          'Only one schema definition can be submitted at once.'
        );
      }

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
        const schemaResponse = (await this.app.service('aries-agent').create({
          service: ServiceType.Schema,
          action: SchemaServiceAction.Create,
          token: params.profile.wallet.token,
          data: {
            schema_name: schema.schema_name,
            schema_version: schema.schema_version,
            attributes: schema.attributes,
          } as AriesSchemaServiceRequest,
        } as AriesAgentData)) as AriesSchema;
        schema.schema_id = schemaResponse.schema_id || schemaResponse.schema.id;

        // TODO: Should this be part of issuing the schema, or as a separate step?
        // create credential definition based on schema
        const credDefId = (await this.app.service('aries-agent').create({
          service: ServiceType.CredDef,
          action: SchemaServiceAction.Create,
          token: params.profile.wallet.token,
          data: {
            schema_id: schemaResponse.schema_id,
            tag: params.profile.normalizedName,
            support_revocation: false,
          } as AriesCredDefServiceRequest,
        } as AriesAgentData)) as CredDefServiceResponse;
        schema.credential_definition_id = credDefId.credential_definition_id;

        // add the new schema to the profile
        schemaList.push(schema);
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
      return e as Error;
    }
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
