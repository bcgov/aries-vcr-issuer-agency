import { Application } from '../declarations';
import admin from './admin/admin.service';
import issuerModel from './issuer-model/issuer-model.service';
import issuerProfile from './issuer-profile/issuer-profile.service';
import issuerAuthentication from './issuer-authentication/issuer-authentication.service';
// Don't remove this comment. It's needed to format import lines nicely.

export function services(app: Application): void {
  app.configure(admin);
  app.configure(issuerProfile);
  app.configure(issuerAuthentication);
}

export function internalServices(app: Application): void {
  app.configure(issuerModel);
}
