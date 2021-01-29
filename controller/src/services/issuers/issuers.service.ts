// Initializes the `issuers` service on path `/issuers`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Issuers } from './issuers.class';
import hooks from './issuers.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'issuers': Issuers & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/issuers', new Issuers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('issuers');

  service.hooks(hooks);
}
