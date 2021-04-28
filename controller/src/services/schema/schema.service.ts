// Initializes the `schemas` service on path `/issuer/schemas`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Schema } from './schema.class';
import hooks from './schema.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'issuer/schema': Schema & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/issuer/schema', new Schema(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('issuer/schema');

  service.hooks(hooks);
}
