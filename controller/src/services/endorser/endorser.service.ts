// Initializes the `endorser` service on path `/endorser`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { EndorserInfo } from './endorser-info.class';
import { EndorserRequest } from './endorser-request.class';
import infoHooks from './endorser-info.hooks';
import requestHooks from './endorser-request.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'endorser/info': EndorserInfo & ServiceAddons<any>;
    'endorser/request': EndorserRequest & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/endorser/info', new EndorserInfo(options, app))

  // Get our initialized service so that we can register hooks
  app.service('endorser/info').hooks(infoHooks);

  // Initialize our service with any options it requires
  app.use('/endorser/request', new EndorserRequest(options, app))

  // Get our initialized service so that we can register hooks
  app.service('endorser/request').hooks(requestHooks);
}
