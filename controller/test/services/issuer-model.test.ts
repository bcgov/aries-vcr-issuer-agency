import app from '../../src/app';

describe("'issuer-model' service", () => {
  it('registered the service', () => {
    const service = app.service('issuer-model');
    expect(service).toBeTruthy();
  });
});
