import app from '../../src/app';
import memory from 'feathers-memory';
import { HookContext } from '@feathersjs/feathers';
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
    .mockReturnValueOnce(Promise.resolve('schema-author-transaction-id'))
    .mockReturnValueOnce(Promise.resolve({
      messages_attach: [{
        '@id': 'schema-message-attachment-id'
      }]
    }))
    .mockReturnValueOnce(Promise.resolve('schema-id'))
    .mockReturnValueOnce(Promise.resolve('credential-definition-author-transaction-id'))
    .mockReturnValueOnce(Promise.resolve({
      messages_attach: [{
        '@id': 'credential-definition-message-attachment-id'
      }]
    }))
    .mockReturnValueOnce(Promise.resolve('credential-definition-id'));
  ariesAgentService.create = ariesAgentCreate;
};

const context = {
  params: {
    headers: { 'issuer-api-key': 'valid-api-key' }
  },
  app
} as unknown as HookContext;

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
    const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;
    expect(await schemaService.find(params)).toEqual([]);
  });

  describe('schema unsuccessfully written to ledger', () => {
    it('should throw an error if a valid schema author transaction ID was not found', async () => {
      const ariesAgentService = app.service('aries-agent');
      const schemaService = app.service('issuer/schema');

      const ariesAgentCreate = jest.fn();
      ariesAgentCreate.mockReturnValue(Promise.resolve(undefined));
      ariesAgentService.create = ariesAgentCreate;

      const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;
      await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
        .rejects.toThrowError(SchemaError);

    });

    it('should throw an error if a valid schema request transaction ID was not found', async () => {
      const ariesAgentService = app.service('aries-agent');
      const schemaService = app.service('issuer/schema');

      const ariesAgentCreate = jest.fn();
      ariesAgentCreate
        .mockReturnValueOnce(Promise.resolve('schema-author-transaction-id'))
        .mockReturnValueOnce(Promise.resolve(undefined));
      ariesAgentService.create = ariesAgentCreate;

      const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;
      await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
        .rejects.toThrowError(EndorserError);
    });

    it('should throw an error if a valid schema message attachment ID was not found', async () => {
      const ariesAgentService = app.service('aries-agent');
      const schemaService = app.service('issuer/schema');

      const ariesAgentCreate = jest.fn();
      ariesAgentCreate
        .mockReturnValueOnce(Promise.resolve('schema-author-transaction-id'))
        .mockReturnValueOnce(Promise.resolve({}));
      ariesAgentService.create = ariesAgentCreate;

      const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;
      await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
        .rejects.toThrowError(EndorserError);
    });

    it('should throw an error if a valid schema ID was not found', async () => {
      const ariesAgentService = app.service('aries-agent');
      const schemaService = app.service('issuer/schema');

      const ariesAgentCreate = jest.fn();
      ariesAgentCreate
        .mockReturnValueOnce(Promise.resolve('schema-author-transaction-id'))
        .mockReturnValueOnce(Promise.resolve({
          messages_attach: [{
            '@id': 'schema-message-attachment-id'
          }]
        }))
        .mockReturnValueOnce(Promise.resolve(undefined));
      ariesAgentService.create = ariesAgentCreate;

      const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;
      await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
        .rejects.toThrowError(SchemaError);
    });

    it('should throw an error if a valid credential definition author transaction ID was not found',
      async () => {
        const ariesAgentService = app.service('aries-agent');
        const schemaService = app.service('issuer/schema');

        const ariesAgentCreate = jest.fn();
        ariesAgentCreate
          .mockReturnValueOnce(Promise.resolve('schema-author-transaction-id'))
          .mockReturnValueOnce(Promise.resolve({
            messages_attach: [{
              '@id': 'schema-message-attachment-id'
            }]
          }))
          .mockReturnValueOnce(Promise.resolve('schema-id'))
          .mockReturnValueOnce(Promise.resolve(undefined));
        ariesAgentService.create = ariesAgentCreate;

        const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;
        await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
          .rejects.toThrowError(CredDefError);
      });

    it('should throw an error if a valid credential definition request transaction ID was not found',
      async () => {
        const ariesAgentService = app.service('aries-agent');
        const schemaService = app.service('issuer/schema');

        const ariesAgentCreate = jest.fn();
        ariesAgentCreate
          .mockReturnValueOnce(Promise.resolve('schema-author-transaction-id'))
          .mockReturnValueOnce(Promise.resolve({
            messages_attach: [{
              '@id': 'schema-message-attachment-id'
            }]
          }))
          .mockReturnValueOnce(Promise.resolve('schema-id'))
          .mockReturnValueOnce(Promise.resolve('credential-definition-author-transaction-id'))
          .mockReturnValueOnce(Promise.resolve(undefined));
        ariesAgentService.create = ariesAgentCreate;

        const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;
        await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
          .rejects.toThrowError(EndorserError);
      });

    it('should throw an error if a valid credential definition message attachment ID was not found',
      async () => {
        const ariesAgentService = app.service('aries-agent');
        const schemaService = app.service('issuer/schema');

        const ariesAgentCreate = jest.fn();
        ariesAgentCreate
          .mockReturnValueOnce(Promise.resolve('schema-author-transaction-id'))
          .mockReturnValueOnce(Promise.resolve({
            messages_attach: [{
              '@id': 'schema-message-attachment-id'
            }]
          }))
          .mockReturnValueOnce(Promise.resolve('schema-id'))
          .mockReturnValueOnce(Promise.resolve('credential-definition-author-transaction-id'))
          .mockReturnValueOnce(Promise.resolve({}));
        ariesAgentService.create = ariesAgentCreate;

        const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;
        await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
          .rejects.toThrowError(EndorserError);
      });

    it('should throw an error if a valid credential definition ID was not found',
      async () => {
        const ariesAgentService = app.service('aries-agent');
        const schemaService = app.service('issuer/schema');

        const ariesAgentCreate = jest.fn();
        ariesAgentCreate
          .mockReturnValueOnce(Promise.resolve('schema-author-transaction-id'))
          .mockReturnValueOnce(Promise.resolve({
            messages_attach: [{
              '@id': 'schema-message-attachment-id'
            }]
          }))
          .mockReturnValueOnce(Promise.resolve('schema-id'))
          .mockReturnValueOnce(Promise.resolve('credential-definition-author-transaction-id'))
          .mockReturnValueOnce(Promise.resolve({
            messages_attach: [{
              '@id': 'credential-definition-message-attachment-id'
            }]
          }))
          .mockReturnValueOnce(Promise.resolve(undefined));
        ariesAgentService.create = ariesAgentCreate;

        const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;
        await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
          .rejects.toThrowError(CredDefError);
      });

    it('should throw an error if differed schema endrosement was unsuccessful', async () => {
      const schemaService = app.service('issuer/schema');

      setupSuccessfulAgent();

      jest.spyOn(sleep, 'deferServiceOnce')
        .mockReset()
        .mockResolvedValueOnce({ id: 'deferred-id', success: false });

      const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;
      await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
        .rejects.toThrowError(EndorserError);
    });

    it('should throw an error if differed credential definition endrosement was unsuccessful',
      async () => {
        const schemaService = app.service('issuer/schema');

        setupSuccessfulAgent();

        jest.spyOn(sleep, 'deferServiceOnce')
          .mockReset()
          .mockResolvedValueOnce({ id: 'deferred-id', success: true })
          .mockResolvedValueOnce({ id: 'deferred-id', success: false });

        const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;
        await expect(schemaService.create(schema as unknown as SchemaServiceModel, params))
          .rejects.toThrowError(EndorserError);
      });
  });

  describe('schema successfully written to ledger', () => {
    const schemaService = app.service('issuer/schema');

    beforeEach(() => setupSuccessfulAgent());

    it('should store schema in issuer profile', async () => {
      const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;
      await schemaService.create(schema as unknown as SchemaServiceModel, params);
      expect(await schemaService.find({ query: { '_id': profile._id }, ...params })).toHaveLength(1);
    });

    it('should return a valid result', async () => {
      const params = { profile, headers: context.params.headers } as unknown as IssuerServiceParams;
      const result = await schemaService.create(schema as unknown as SchemaServiceModel, params);
      expect(result).toEqual({
        schema_id: 'schema-id',
        credential_definition_id: 'credential-definition-id'
      });
    });
  });
});
