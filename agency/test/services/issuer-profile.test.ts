import app from '../../src/app';

describe('\'issuer-profile\' service', () => {
  it('registered the service', () => {
    const service = app.service('issuer/profile');
    expect(service).toBeTruthy();
  });
});
