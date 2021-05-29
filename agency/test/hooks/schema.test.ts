import { BadRequest } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { validateSchemaModel } from '../../src/utils/hooks/schemas';

import schema from '../data/schema.json';

describe('\'schema\' hooks', () => {
  describe('validates a schema model', () => {
    it('returns the hook context for a valid schema', async () => {
      const context = { data: { ...schema } } as unknown as HookContext;
      expect(await validateSchemaModel(context)).toEqual(context);
    });

    it('throws a bad request if schema name is missing', async () => {
      const invalidSchema = { ...schema, schema_name: '' };
      const context = { data: invalidSchema } as unknown as HookContext;
      await expect(validateSchemaModel(context)).rejects.toThrowError(BadRequest);
    });

    it('throws a bad request if schema version is missing', async () => {
      const invalidSchema = { ...schema, schema_version: '' };
      const context = { data: invalidSchema } as unknown as HookContext;
      await expect(validateSchemaModel(context)).rejects.toThrowError(BadRequest);
    });

    it('throws a bad request if schema attribute list is empty', async () => {
      const invalidSchema = { ...schema, attributes: [] };
      const context = { data: invalidSchema } as unknown as HookContext;
      await expect(validateSchemaModel(context)).rejects.toThrowError(BadRequest);
    });

    it('throws a bad request if schema metadata topic list is empty', async () => {
      const invalidSchema = { ...schema, metadata: { ...schema.metadata, topic: [] } };
      const context = { data: invalidSchema } as unknown as HookContext;
      await expect(validateSchemaModel(context)).rejects.toThrowError(BadRequest);
    });

    it('throws a bad request if schema metadata cardinality list is empty', async () => {
      const invalidSchema = {
        ...schema, metadata: {
          ...schema.metadata, cardinality: []
        }
      };
      const context = { data: invalidSchema } as unknown as HookContext;
      await expect(validateSchemaModel(context)).rejects.toThrowError(BadRequest);
    });

    it('throws a bad request if schema metadata effective date field is missing', async () => {
      const invalidSchema = {
        ...schema, metadata: {
          ...schema.metadata, date_fields: {
            revoked_date: new Date().toISOString()
          }
        }
      };
      const context = { data: invalidSchema } as unknown as HookContext;
      await expect(validateSchemaModel(context)).rejects.toThrowError(BadRequest);
    });

    it('throws a bad request if schema metadata revoked date field is missing', async () => {
      const invalidSchema = {
        ...schema, metadata: {
          ...schema.metadata, date_fields: {
            effective_date: new Date().toISOString()
          }
        }
      };
      const context = { data: invalidSchema } as HookContext;
      await expect(validateSchemaModel(context)).rejects.toThrowError(BadRequest);
    });
  });
});