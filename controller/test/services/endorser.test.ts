import app from '../../src/app';

describe('\'endorser/info\' service', () => {
  it('registered the service', () => {
    const service = app.service('endorser/info');
    expect(service).toBeTruthy();
  });
});

describe('\'endorser/request\' service', () => {
  it('registered the service', () => {
    const service = app.service('endorser/request');
    expect(service).toBeTruthy();
  });
});