// Initializes the `issuer-authentication` service on path `/issuer/authentication`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { IssuerAuthentication } from './issuer-authentication.class';
import hooks from './issuer-authentication.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'issuer/authentication': IssuerAuthentication & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/issuer/authentication', new IssuerAuthentication(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('issuer/authentication');

  service.hooks(hooks);
}
