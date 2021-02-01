// Initializes the `issuer-profile` service on path `/issuer/profile`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { IssuerProfile } from './issuer-profile.class';
import hooks from './issuer-profile.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'issuer/profile': IssuerProfile & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/issuer/profile', new IssuerProfile(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('issuer/profile');

  service.hooks(hooks);
}
