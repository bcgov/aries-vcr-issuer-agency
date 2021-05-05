import app from '../../src/app';

describe('\'aries-agent\' service', () => {
  it('registered the service', () => {
    const service = app.service('aries-agent');
    expect(service).toBeTruthy();
  });
});
