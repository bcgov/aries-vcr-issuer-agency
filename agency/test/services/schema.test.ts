import app from '../../src/app';
import { HookContext } from '@feathersjs/feathers';
import memory from 'feathers-memory';
import { IssuerServiceParams } from '../../src/models/service-params';
import { SchemaServiceModel } from '../../src/models/schema';
import { CredDefError, EndorserError, SchemaError } from '../../src/models/errors';

import profile from '../data/profile.json';
import schema from '../data/schema.json';

import * as sleep from '../../src/utils/sleep';
jest.mock('../../src/utils/sleep');

const setupSuccessfulAgent = () => {
  const ariesAgentService = app.service('aries-agent');
  const ariesAgentCreate = jest.fn();
  ariesAgentCreate
    .mockResolvedValueOnce('schema-author-transaction-id')
    .mockResolvedValueOnce({
      messages_attach: [{
        '@id': 'schema-message-attachment-id'
      }]
    })
    .mockResolvedValueOnce('schema-id')
    .mockResolvedValueOnce('credential-definition-author-transaction-id')
    .mockResolvedValueOnce({
      messages_attach: [{
        '@id': 'credential-definition-message-attachment-id'
      }]
    })
    .mockResolvedValueOnce('credential-definition-id');
  ariesAgentService.create = ariesAgentCreate;
};

const context = {
  params: {
    headers: { 'issuer-api-key': 'valid-api-key' }
  },
  app
} as unknown as HookContext;

const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;

describe('\'schema\' service', () => {
  beforeEach(async () => {
    jest.spyOn(sleep, 'deferServiceOnce')
      .mockReset()
      .mockResolvedValue({ id: 'deferred-id', success: true });

    const options = {
      id: '_id',
      paginate: app.get('paginate')
    };
    app.use('/issuer/model', memory(options));
    await app.service('issuer/model').create(profile);
  });

  it('registered the service', () => {
    const service = app.service('issuer/schema');
    expect(service).toBeTruthy();
  });

  it('should return a list of schemas', async () => {
    const schemaService = app.service('issuer/schema');
    expect(await schemaService.find(params)).toEqual([]);
  });

  describe('schema unsuccessfully written to ledger', () => {
    it('should throw an error if a valid schema author transaction ID was not found', async () => {
      const ariesAgentService = app.service('aries-agent');
      const schemaService = app.service('issuer/schema');

      const ariesAgentCreate = jest.fn();
      ariesAgentCreate.mockReturnValue(undefined);
      ariesAgentService.create = ariesAgentCreate;

      await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
        .rejects.toThrowError(SchemaError);

    });

    it('should throw an error if a valid schema request transaction ID was not found', async () => {
      const ariesAgentService = app.service('aries-agent');
      const schemaService = app.service('issuer/schema');

      const ariesAgentCreate = jest.fn();
      ariesAgentCreate
        .mockResolvedValueOnce('schema-author-transaction-id')
        .mockResolvedValueOnce(undefined);
      ariesAgentService.create = ariesAgentCreate;

      await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
        .rejects.toThrowError(EndorserError);
    });

    it('should throw an error if a valid schema message attachment ID was not found', async () => {
      const ariesAgentService = app.service('aries-agent');
      const schemaService = app.service('issuer/schema');

      const ariesAgentCreate = jest.fn();
      ariesAgentCreate
        .mockResolvedValueOnce('schema-author-transaction-id')
        .mockResolvedValueOnce({});
      ariesAgentService.create = ariesAgentCreate;

      await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
        .rejects.toThrowError(EndorserError);
    });

    it('should throw an error if a valid schema ID was not found', async () => {
      const ariesAgentService = app.service('aries-agent');
      const schemaService = app.service('issuer/schema');

      const ariesAgentCreate = jest.fn();
      ariesAgentCreate
        .mockResolvedValueOnce('schema-author-transaction-id')
        .mockResolvedValueOnce({
          messages_attach: [{
            '@id': 'schema-message-attachment-id'
          }]
        })
        .mockResolvedValueOnce(undefined);
      ariesAgentService.create = ariesAgentCreate;

      await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
        .rejects.toThrowError(SchemaError);
    });

    it('should throw an error if a valid credential definition author transaction ID was not found',
      async () => {
        const ariesAgentService = app.service('aries-agent');
        const schemaService = app.service('issuer/schema');

        const ariesAgentCreate = jest.fn();
        ariesAgentCreate
          .mockResolvedValueOnce('schema-author-transaction-id')
          .mockResolvedValueOnce({
            messages_attach: [{
              '@id': 'schema-message-attachment-id'
            }]
          })
          .mockResolvedValueOnce('schema-id')
          .mockResolvedValueOnce(undefined);
        ariesAgentService.create = ariesAgentCreate;

        await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
          .rejects.toThrowError(CredDefError);
      });

    it('should throw an error if a valid credential definition request transaction ID was not found',
      async () => {
        const ariesAgentService = app.service('aries-agent');
        const schemaService = app.service('issuer/schema');

        const ariesAgentCreate = jest.fn();
        ariesAgentCreate
          .mockResolvedValueOnce('schema-author-transaction-id')
          .mockResolvedValueOnce({
            messages_attach: [{
              '@id': 'schema-message-attachment-id'
            }]
          })
          .mockResolvedValueOnce('schema-id')
          .mockResolvedValueOnce('credential-definition-author-transaction-id')
          .mockResolvedValueOnce(undefined);
        ariesAgentService.create = ariesAgentCreate;

        await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
          .rejects.toThrowError(EndorserError);
      });

    it('should throw an error if a valid credential definition message attachment ID was not found',
      async () => {
        const ariesAgentService = app.service('aries-agent');
        const schemaService = app.service('issuer/schema');

        const ariesAgentCreate = jest.fn();
        ariesAgentCreate
          .mockResolvedValueOnce('schema-author-transaction-id')
          .mockResolvedValueOnce({
            messages_attach: [{
              '@id': 'schema-message-attachment-id'
            }]
          })
          .mockResolvedValueOnce('schema-id')
          .mockResolvedValueOnce('credential-definition-author-transaction-id')
          .mockResolvedValueOnce({});
        ariesAgentService.create = ariesAgentCreate;

        await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
          .rejects.toThrowError(EndorserError);
      });

    it('should throw an error if a valid credential definition ID was not found',
      async () => {
        const ariesAgentService = app.service('aries-agent');
        const schemaService = app.service('issuer/schema');

        const ariesAgentCreate = jest.fn();
        ariesAgentCreate
          .mockResolvedValueOnce('schema-author-transaction-id')
          .mockResolvedValueOnce({
            messages_attach: [{
              '@id': 'schema-message-attachment-id'
            }]
          })
          .mockResolvedValueOnce('schema-id')
          .mockResolvedValueOnce('credential-definition-author-transaction-id')
          .mockResolvedValueOnce({
            messages_attach: [{
              '@id': 'credential-definition-message-attachment-id'
            }]
          })
          .mockResolvedValueOnce(undefined);
        ariesAgentService.create = ariesAgentCreate;

        await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
          .rejects.toThrowError(CredDefError);
      });

    it('should throw an error if deferred schema endrosement was unsuccessful', async () => {
      const schemaService = app.service('issuer/schema');

      setupSuccessfulAgent();

      jest.spyOn(sleep, 'deferServiceOnce')
        .mockReset()
        .mockResolvedValueOnce({ id: 'deferred-id', success: false });

      await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
        .rejects.toThrowError(EndorserError);
    });

    it('should throw an error if deferred credential definition endrosement was unsuccessful',
      async () => {
        const schemaService = app.service('issuer/schema');

        setupSuccessfulAgent();

        jest.spyOn(sleep, 'deferServiceOnce')
          .mockReset()
          .mockResolvedValueOnce({ id: 'deferred-id', success: true })
          .mockResolvedValueOnce({ id: 'deferred-id', success: false });

        await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
          .rejects.toThrowError(EndorserError);
      });
  });

  describe('schema successfully written to ledger', () => {
    const schemaService = app.service('issuer/schema');

    beforeEach(() => setupSuccessfulAgent());

    it('should store schema in issuer profile', async () => {
      await schemaService.create(schema as unknown as SchemaServiceModel, params);
      expect(await schemaService.find({ query: { '_id': profile._id }, ...params })).toHaveLength(1);
    });

    it('should return a valid result', async () => {
      const result = await schemaService.create(schema as unknown as SchemaServiceModel, params);
      expect(result).toEqual({
        schema_id: 'schema-id',
        credential_definition_id: 'credential-definition-id'
      });
    });
  });
});
