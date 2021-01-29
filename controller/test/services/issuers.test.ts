import app from '../../src/app';

describe('\'issuers\' service', () => {
  it('registered the service', () => {
    const service = app.service('issuers');
    expect(service).toBeTruthy();
  });
});
