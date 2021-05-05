// Initializes the `taa-accept` service on path `/issuer/taa/accept`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TaaAccept } from './taa-accept.class';
import hooks from './taa-accept.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'issuer/taa/accept': TaaAccept & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/issuer/taa/accept', new TaaAccept(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('issuer/taa/accept');

  service.hooks(hooks);
}
