import app from '../../src/app';
import { HookContext } from '@feathersjs/feathers';
import memory from 'feathers-memory';
import { SchemaServiceModel } from '../../src/models/schema';
import { IssuerServiceParams } from '../../src/models/service-params';

import profile from '../data/profile.json';
import schema from '../data/schema.json';

import * as sleep from '../../src/utils/sleep';
jest.mock('../../src/utils/sleep');

const context = {
  params: {
    headers: { 'issuer-api-key': 'valid-api-key' }
  },
  app
} as unknown as HookContext;

const params = {
  profile: profile,
  headers: context.params.headers
} as unknown as IssuerServiceParams;

const credential = {
  schema_name: schema.schema_name,
  schema_version: schema.schema_version,
  attributes: {
    reservation_number: '000001',
    guest_name: 'Giuseppe Verde',
    reservation_date: '2021-05-31',
    reservation_date_cancelled: '',
    another_date: '',
    num_guests: '2'
  }
};

const credentialServiceRequest = {
  credential_preview: {
    '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/2.0/credential-preview',
    attributes: [
      {
        'mime-type': 'text/plain',
        'name': 'reservation_number',
        'value': '000001'
      }, {
        'mime-type': 'text/plain',
        'name': 'guest_name',
        'value': 'Giuseppe Verde'
      }, {
        'mime-type': 'text/plain',
        'name': 'reservation_date',
        'value': '2021-05-31'
      }, {
        'mime-type': 'text/plain',
        'name': 'reservation_date_cancelled',
        'value': ''
      }, {
        'mime-type': 'text/plain',
        'name': 'another_date',
        'value': ''
      }, {
        'mime-type': 'text/plain',
        'name': 'num_guests',
        'value': '2'
      }
    ],
  },
  connection_id: 'valid-connection-id',
  filter: {
    indy: {
      issuer_did: 'valid-did',
      schema_issuer_did: 'valid-did',
      schema_id: 'table-reservation:0.1',
      schema_name: 'table-reservation',
      schema_version: '0.1',
      cred_def_id: 'valid-did:table-reservation:0.1',
    },
  },
};

const mockSuccess = (params: IssuerServiceParams, id: string) => {
  const result = { success: true };
  params.credentials.results.push({ ...result, credExId: id });
  return Promise.resolve({ ...result, id });
};

const mockError = (params: IssuerServiceParams, id: string) => {
  const result = { success: false };
  params.credentials.results.push({ ...result, credExId: id });
  return Promise.resolve({ ...result, id });
};

describe('\'credential\' service', () => {
  beforeEach(async () => {
    const options = {
      id: '_id',
      paginate: app.get('paginate')
    };
    app.use('/issuer/model', memory(options));

    const issuerModelService = app.service('issuer/model');
    const ariesAgentService = app.service('aries-agent');

    const ariesAgentCreate = jest.fn();
    ariesAgentCreate.mockResolvedValue({ cred_ex_id: 'credential-exchange-id' });
    ariesAgentService.create = ariesAgentCreate;

    await issuerModelService.create(profile);
    await issuerModelService.patch(profile._id, {
      schemas: [schema],
    } as Partial<SchemaServiceModel>);
  });

  it('registered the service', () => {
    const service = app.service('issuer/credential');
    expect(service).toBeTruthy();
  });

  it('should find a valid existing schema in the issuer profile', async () => {
    const credentialService = app.service('issuer/credential');
    const profileWithSchema = await app.service('issuer/model').get(profile._id);
    const params = {
      profile: profileWithSchema,
      headers: context.params.headers
    } as unknown as IssuerServiceParams;
    expect(credentialService.findExistingSchema(credential, params)).toEqual({
      credSchemaName: 'table-reservation',
      credSchemaVersion: '0.1',
      existingSchema: schema
    });
  });

  it('should format the credential service request correctly', () => {
    const credentialService = app.service('issuer/credential');
    expect(credentialService.formatCredServiceRequest(
      schema as unknown as SchemaServiceModel, credential, params
    )).toEqual(credentialServiceRequest);
  });

  it('should create a credential and return a valid response', async () => {
    const credentialService = app.service('issuer/credential');
    const profileWithSchema = await app.service('issuer/model').get(profile._id);
    const params = {
      profile: profileWithSchema,
      headers: context.params.headers
    } as unknown as IssuerServiceParams;

    jest.spyOn(sleep, 'deferServiceOnce')
      .mockReset()
      .mockImplementationOnce((id) => mockSuccess(params, id));

    await credentialService.create(credential, params);
    expect(params.credentials.results).toBeInstanceOf(Object);
    expect(params.credentials.results).toEqual({ cred_ex_id: 'credential-exchange-id', success: true, error: undefined });
  });

  it('should create a list of credentials and return a valid response', async () => {
    const credentialService = app.service('issuer/credential');
    const profileWithSchema = await app.service('issuer/model').get(profile._id);
    const params = {
      profile: profileWithSchema,
      headers: context.params.headers
    } as unknown as IssuerServiceParams;

    jest.spyOn(sleep, 'deferServiceOnce')
      .mockReset()
      .mockImplementationOnce((id) => mockSuccess(params, id))
      .mockImplementationOnce((id) => mockSuccess(params, id));

    const credentials = [
      { ...credential, reservation_number: '000002' },
      { ...credential, reservation_number: '000003' }
    ];
    await credentialService.create(credentials, params);
    expect(params.credentials.results).toBeInstanceOf(Array);
    expect(params.credentials.results).toEqual([
      { cred_ex_id: 'credential-exchange-id', success: true, error: undefined },
      { cred_ex_id: 'credential-exchange-id', success: true, error: undefined }
    ]);
  });

  it('should return a valid response even if one or more credentials aren\'t succesffully issued',
    async () => {
      const credentialService = app.service('issuer/credential');
      const profileWithSchema = await app.service('issuer/model').get(profile._id);
      const params = {
        profile: profileWithSchema,
        headers: context.params.headers
      } as unknown as IssuerServiceParams;

      jest.spyOn(sleep, 'deferServiceOnce')
        .mockReset()
        .mockImplementationOnce((id) => mockSuccess(params, id))
        .mockImplementationOnce((id) => mockError(params, id));

      const credentials = [
        { ...credential, reservation_number: '000003' },
        { ...credential, reservation_number: '000004' }
      ];
      await credentialService.create(credentials, params);
      expect(params.credentials.results).toBeInstanceOf(Array);
      expect(params.credentials.results).toEqual([
        { cred_ex_id: 'credential-exchange-id', success: true, error: undefined },
        { cred_ex_id: 'credential-exchange-id', success: false, error: undefined }
      ]);
    });

  it('should return a valid response even if all credentials aren\'t succesffully issued',
    async () => {
      const credentialService = app.service('issuer/credential');
      const profileWithSchema = await app.service('issuer/model').get(profile._id);
      const params = {
        profile: profileWithSchema,
        headers: context.params.headers
      } as unknown as IssuerServiceParams;

      jest.spyOn(sleep, 'deferServiceOnce')
        .mockReset()
        .mockImplementationOnce((id) => mockError(params, id))
        .mockImplementationOnce((id) => mockError(params, id));

      const credentials = [
        { ...credential, reservation_number: '000005' },
        { ...credential, reservation_number: '000006' }
      ];
      await credentialService.create(credentials, params);
      expect(params.credentials.results).toBeInstanceOf(Array);
      expect(params.credentials.results).toEqual([
        { cred_ex_id: 'credential-exchange-id', success: false, error: undefined },
        { cred_ex_id: 'credential-exchange-id', success: false, error: undefined }
      ]);
    });

  it('should throw a bad request error when existing schema is not found', async () => {
    const credentialService = app.service('issuer/credential');
    const profileWithSchema = await app.service('issuer/model').get(profile._id);
    const params = {
      profile: profileWithSchema,
      headers: context.params.headers
    } as unknown as IssuerServiceParams;
    await credentialService.create({ ...credential, schema_name: 'unknown-schema' }, params);
    const result = params.credentials.results as any;
    expect(result).toBeInstanceOf(Object);
    expect(result.cred_ex_id).toBeFalsy();
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('should throw a general error when credential exchange id is not found', async () => {
    const ariesAgentService = app.service('aries-agent');
    const ariesAgentCreate = jest.fn();
    ariesAgentCreate.mockResolvedValue({ cred_ex_id: undefined });
    ariesAgentService.create = ariesAgentCreate;

    const credentialService = app.service('issuer/credential');
    const profileWithSchema = await app.service('issuer/model').get(profile._id);
    const params = {
      profile: profileWithSchema,
      headers: context.params.headers
    } as unknown as IssuerServiceParams;
    await credentialService.create(credential, params);
    const result = params.credentials.results as any;
    expect(result).toBeInstanceOf(Object);
    expect(result.cred_ex_id).toBeFalsy();
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});