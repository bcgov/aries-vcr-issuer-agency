// Initializes the `issuer` service on path `/issuer/model`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Issuer } from './issuer-model.class';
import hooks from './issuer-model.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'issuer/model': Issuer & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/issuer/model', new Issuer(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('issuer/model');

  service.hooks(hooks);
}
