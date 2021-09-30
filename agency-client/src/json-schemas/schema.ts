import { Schema } from '@/store/modules/schema';
import Ajv from 'ajv';

const ajv = new Ajv();

const schema = {
  type: 'object',
  properties: {
    schema_name: {
      description: 'The Schema name',
      type: 'string',
      minLength: 3
    },
    schema_version: {
      description: 'The Schema version',
      type: 'string',
      minLength: 1
    },
    attributes: {
      description: 'Attributes for the Schema',
      type: 'array',
      items: {
        type: 'string',
        minLength: 1
      },
      minItems: 1,
      uniqueItems: true
    },
    metadata: {
      description: 'The metadata for the Schema',
      type: 'object',
      properties: {
        topic: {
          description: 'Mapping of Schema attributes to a Topic',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                minLength: 1
              },
              topic_type: {
                type: 'string',
                minLength: 3
              }
            },
            required: ['name', 'topic_type']
          }
        },
        date_fields: {
          description: 'Date Schema attributes',
          type: 'object',
          properties: {
            effective_date: {
              description: 'The effective date of a Schema Credential',
              type: 'string',
              minLength: 1
            },
            revoked_date: {
              description: 'The revoked date of a Schema Credential',
              type: 'string',
              minLength: 1
            },
            other_dates: {
              description: 'Other dates of a Schema Credential',
              type: 'array',
              items: {
                type: 'string',
                minLength: 1
              }
            }
          },
          required: ['effective_date', 'revoked_date']
        },
        search_fields: {
          description: 'A searchable Schema attribute',
          type: 'array',
          items: {
            type: 'string',
            minLength: 1
          },
          uniqueItems: true
        },
        credential_title: {
          description: 'The primary attribute of the credential',
          type: 'string',
          minLength: 1
        },
        highlighted_attributes: {
          description: 'A set of attributes to display on the credential card',
          type: 'array',
          items: {
            type: 'string',
            minLength: 1
          },
          uniqueItems: true
        },
        cardinality: {
          description: 'A cardinal Schema attribute',
          type: 'array',
          items: {
            type: 'string',
            minLength: 1
          },
          uniqueItems: true
        }
      },
      required: ['topic', 'date_fields']
    }
  },
  required: ['schema_name', 'schema_version', 'attributes']
};

export default ajv.compile<Schema>(schema);
