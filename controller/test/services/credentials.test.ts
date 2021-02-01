import app from '../../src/app';

describe('\'credentials\' service', () => {
  it('registered the service', () => {
    const service = app.service('issuer/credentials');
    expect(service).toBeTruthy();
  });
});
