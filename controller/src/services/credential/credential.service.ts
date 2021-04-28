// Initializes the `credential` service on path `/issuer/credential`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Credential } from './credential.class';
import hooks from './credential.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'issuer/credential': Credential & ServiceAddons<any>;
    // 'issuer/credential/send': CredentialSend & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/issuer/credential', new Credential(options, app));
  // app.use('/issuer/credential/send', new CredentialSend(options, app));

  // Get our initialized service so that we can register hooks
  app.service('issuer/credential').hooks(hooks);
  // app.service('issuer/credential/send').hooks(hooks);
}
