import { Paginated, Params } from '@feathersjs/feathers';
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from 'feathers-swagger/types';
import { Application } from '../../declarations';

interface Data {}

interface ServiceOptions {}

export class Schemas implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceSwaggerOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  model = {
    description: 'Aries Schema Model',
    type: 'object',
    required: [],
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
            // ],
          },
          cardinality: {
            type: 'array',
            description:
              'List of fields to be used for the credential cardinality.',
            items: {
              type: 'string',
            },
          },
          effective_date: {
            type: 'string',
            description:
              'The name of the field to be mapped to the credential effective date.',
          },
          other_date_fields: {
            type: 'array',
            description: 'List of fields representing dates.',
            items: {
              type: 'string',
            },
          },
          search_fields: {
            type: 'array',
            description: 'List of fields that will be indexed for searching.',
            items: {
              type: 'string',
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
        title: 'schemas request',
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
        title: 'schemas response',
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
