// Initializes the `schemas` service on path `/issuer/schemas`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Schemas } from './schemas.class';
import hooks from './schemas.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'issuer/schemas': Schemas & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/issuer/schemas', new Schemas(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('issuer/schemas');

  service.hooks(hooks);
}
