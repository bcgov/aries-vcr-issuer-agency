import app from '../../src/app';
import { Forbidden } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import memory from 'feathers-memory';
import { authenticateIssuer } from '../../src/utils/hooks/authentication';

describe('\'authentication\' hooks', () => {
  beforeEach(async () => {
    const options = {
      paginate: app.get('paginate')
    };
    app.use('/issuer/model', memory(options));

    app.service('issuer/model').create({
      'api-key': 'valid-api-key',
      'name': 'Valid Test Issuer',
      'normalizedName': 'Valid_Test_Issuer',
    });
  });

  it('authenticates a valid issuer', async () => {
    const context = {
      params: {
        headers: { 'issuer-api-key': 'valid-api-key' }
      },
      app
    } as unknown as HookContext;
    expect(await authenticateIssuer(context)).toEqual(context);
  });

  it('forbids an unauthenticated issuer', async () => {
    const context = {
      params: {
        headers: { 'issuer-api-key': '' }
      },
      app
    } as unknown as HookContext;
    await expect(authenticateIssuer(context)).rejects.toThrowError(Forbidden);
  });

  it('forbids an invalid issuer', async () => {
    const context = {
      params: {
        headers: { 'issuer-api-key': 'invalid-api-key' }
      },
      app
    } as unknown as HookContext;
    await expect(authenticateIssuer(context)).rejects.toThrowError(Forbidden);
  });
});