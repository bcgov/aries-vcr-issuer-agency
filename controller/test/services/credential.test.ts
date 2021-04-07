import app from '../../src/app';

describe('\'credential\' service', () => {
  it('registered the service', () => {
    const service = app.service('issuer/credential');
    expect(service).toBeTruthy();
  });
});
