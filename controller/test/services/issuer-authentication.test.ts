import app from '../../src/app';

describe('\'issuer-authentication\' service', () => {
  it('registered the service', () => {
    const service = app.service('issuer/authentication');
    expect(service).toBeTruthy();
  });
});
