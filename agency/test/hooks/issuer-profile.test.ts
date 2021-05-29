import { HookContext } from '@feathersjs/feathers';
import { checkValidIssuerProfile } from '../../src/utils/hooks/issuer-profile';
import memory from 'feathers-memory';
import app from '../../src/app';
import { DuplicatedProfileError } from '../../src/models/errors';
import { GeneralError } from '@feathersjs/errors';

const profile = {
  '_id': 'abcdef',
  'api-key': 'valid-api-key',
  'name': 'Valid Test Issuer',
  'normalizedName': 'Valid_Test_Issuer',
};

describe('\'issuer-profile\' hooks', () => {
  beforeEach(async () => {
    const options = {
      paginate: app.get('paginate')
    };
    app.use('/issuer/model', memory(options));
  });

  it('should return a valid issuer profile', async () => {
    await app.service('issuer/model').create(profile);

    const context = {
      params: {
        headers: { 'issuer-api-key': 'valid-api-key' }
      },
      app
    } as unknown as HookContext;
    expect(await checkValidIssuerProfile(context)).toEqual(context);
  });

  it('should throw an error if a duplicate profile exists ', async () => {
    await app.service('issuer/model').create(profile);
    await app.service('issuer/model').create(profile);

    const context = {
      params: {
        headers: { 'issuer-api-key': 'valid-api-key' }
      },
      app
    } as unknown as HookContext;
    await expect(checkValidIssuerProfile(context)).rejects.toThrowError(DuplicatedProfileError);
  });

  it('should throw an error if a profile is invalid', async () => {
    await app.service('issuer/model').create({ ...profile, '_id': '' });

    const context = {
      params: {
        headers: { 'issuer-api-key': 'valid-api-key' }
      },
      app
    } as unknown as HookContext;
    await expect(checkValidIssuerProfile(context)).rejects.toThrowError(GeneralError);
  });
});