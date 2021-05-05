import app from '../../src/app';

describe('\'schema\' service', () => {
  it('registered the service', () => {
    const service = app.service('issuer/schema');
    expect(service).toBeTruthy();
  });
});
