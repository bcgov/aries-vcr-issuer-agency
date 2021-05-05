// Initializes the `taa-read` service on path `/issuer/taa`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TaaRead } from './taa-read.class';
import hooks from './taa-read.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'issuer/taa': TaaRead & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/issuer/taa', new TaaRead(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('issuer/taa');

  service.hooks(hooks);
}
