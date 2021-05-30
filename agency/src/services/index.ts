import { Application } from '../declarations';
import admin from './admin/admin.service';
import ariesAgent from './aries-agent/aries-agent.service';
import credential from './credential/credential.service';
import events from './event/events.service';
import issuerAuthentication from './issuer-authentication/issuer-authentication.service';
import issuerModel from './issuer-model/issuer-model.service';
import issuerProfile from './issuer-profile/issuer-profile.service';
import schema from './schema/schema.service';
import webHooks from './webhooks/webhooks.service';
// Don't remove this comment. It's needed to format import lines nicely.

export function services(app: Application): void {
  app.configure(admin);
  app.configure(credential);
  app.configure(issuerProfile);
  app.configure(issuerAuthentication);
  app.configure(schema);
}

export function internalServices(app: Application): void {
  app.configure(ariesAgent);
  app.configure(events);
  app.configure(issuerModel);
  app.configure(webHooks);
}
