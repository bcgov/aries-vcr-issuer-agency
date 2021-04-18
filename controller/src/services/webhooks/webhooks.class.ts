import { NotImplemented } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CredState_2_0, WebhookTopic_2_0 } from '../../models/enums';

interface Data {
  state?: CredState_2_0;
  cred_ex_id?: string;
}

interface ServiceOptions { }

export class Webhooks {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) { 
    this.options = options;
    this.app = app;
  }

  async create(data: Data, params?: Params): Promise<any> {
    const topic = params?.route?.topic;
    const state = data?.state;
    switch (topic) {
      case WebhookTopic_2_0.IssueCredential:
        if (state === CredState_2_0.CredentialIssued) {
          const cred_ex_id = data?.cred_ex_id;
          if (cred_ex_id) {
            this.app.service('issuer/credentials').emit(cred_ex_id, data);
          } else {
            // TODO: Gracefully handle the error here
            return { result: "Error" };
          }
        }
        return { result: "Success" };
      default:
        return new NotImplemented(`Webhook ${topic} is not supported`);
    }
  }
}
