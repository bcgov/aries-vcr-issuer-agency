// Initializes the `credentials` service on path `/issuer/credentials`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Credentials } from './credentials.class';
import hooks from './credentials.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'issuer/credentials': Credentials & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/issuer/credentials', new Credentials(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('issuer/credentials');

  service.hooks(hooks);
}
