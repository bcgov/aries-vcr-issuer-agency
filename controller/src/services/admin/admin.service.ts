// Initializes the `admin` service on path `/admin`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Admin } from './admin.class';
import hooks from './admin.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'admin/issuer': Admin & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/issuer', new Admin(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/issuer');

  service.hooks(hooks);
}
