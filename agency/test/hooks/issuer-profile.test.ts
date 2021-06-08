import app from '../../src/app';
import { GeneralError } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import memory from 'feathers-memory';
import { checkValidIssuerProfile } from '../../src/utils/hooks/issuer-profile';
import { DuplicatedProfileError } from '../../src/models/errors';

import profile from '../data/profile.json';

const context = {
  params: {
    headers: { 'issuer-api-key': 'valid-api-key' }
  },
  app
} as unknown as HookContext;

describe('\'issuer-profile\' hooks', () => {
  beforeEach(() => {
    const options = {
      paginate: app.get('paginate')
    };
    app.use('/issuer/model', memory(options));
  });

  it('should return a valid issuer profile', async () => {
    await app.service('issuer/model').create(profile);
    expect(await checkValidIssuerProfile(context)).toEqual(context);
  });

  it('should throw an error if a duplicate profile exists ', async () => {
    /**
     * This is testing the hook to ensure it throws an error when more than one of the same name
     * exists. The call to the issuer model service simply adds the profile to the db.
     * Normally the profile would not be directly added to the db as below we would use the admin
     * service to create the profile.
     */
    await app.service('issuer/model').create(profile);
    await app.service('issuer/model').create(profile);
    await expect(checkValidIssuerProfile(context)).rejects.toThrowError(DuplicatedProfileError);
  });

  it('should throw an error if a profile is invalid', async () => {
    await app.service('issuer/model').create({ ...profile, '_id': '' });
    await expect(checkValidIssuerProfile(context)).rejects.toThrowError(GeneralError);
  });
});