import app from '../../src/app';

describe('\'schemas\' service', () => {
  it('registered the service', () => {
    const service = app.service('issuer/schemas');
    expect(service).toBeTruthy();
  });
});
