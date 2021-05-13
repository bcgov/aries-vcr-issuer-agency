/**
 * This service was created to call and handle service events within webhooks.
 * 
 * Often, one-time events will be created and wrapped within a promise to be resolved
 * when a webhook is called externally. Since webhooks wont have any context of which service the
 * one-time event is created this service is purpose built to attach these one-time events to that
 * can be called by webhooks.
 * 
 * For example: See Schema publishing and Credential issuance handling in webhooks.
 */

// Initializes the `event` service on path `/event`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Events } from './events.class';
import hooks from './events.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'events': Events & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/events', new Events(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('events');

  service.hooks(hooks);
}
