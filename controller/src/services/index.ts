import { Application } from '../declarations';
import admin from './admin/admin.service';
import ariesAgent from './aries-agent/aries-agent.service';
import credential from './credential/credential.service';
import issuerAuthentication from './issuer-authentication/issuer-authentication.service';
import issuerModel from './issuer-model/issuer-model.service';
import issuerProfile from './issuer-profile/issuer-profile.service';
import schema from './schema/schema.service';
import taaAccept from './taa-accept/taa-accept.service';
import taaRead from './taa-read/taa-read.service';
import webHooks from './webhooks/webhooks.service';
// Don't remove this comment. It's needed to format import lines nicely.

export function services(app: Application): void {
  app.configure(admin);
  app.configure(issuerProfile);
  app.configure(issuerAuthentication);
  app.configure(taaRead);
  app.configure(taaAccept);
  app.configure(schema);
  app.configure(credential);
}

export function internalServices(app: Application): void {
  app.configure(issuerModel);
  app.configure(ariesAgent);
  app.configure(webHooks);
}
