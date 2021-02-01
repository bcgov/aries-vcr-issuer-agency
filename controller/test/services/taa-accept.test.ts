import app from '../../src/app';

describe('\'taa-accept\' service', () => {
  it('registered the service', () => {
    const service = app.service('issuer/taa/accept');
    expect(service).toBeTruthy();
  });
});
