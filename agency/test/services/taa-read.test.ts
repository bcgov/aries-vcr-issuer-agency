import app from '../../src/app';

describe('\'taa-read\' service', () => {
  it('registered the service', () => {
    const service = app.service('issuer/taa');
    expect(service).toBeTruthy();
  });
});
