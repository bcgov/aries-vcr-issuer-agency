import { NotImplemented } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CredState, WebhookTopic, WebhookTopic_2_0 } from '../../models/enums';

interface Data {
  state?: CredState;
  credential_exchange_id?: string;
  credential_proposal_dict?: any;
  revocation_id?: string;
  revoc_reg_id?: string;
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
    console.log(`TOPIC IS: ${topic}. STATE IS: ${data.state}`);
    switch (topic) {
      case WebhookTopic.IssueCredential:
        return { result: "Success" };
      case WebhookTopic_2_0.IssueCredential:
        return { result: "Success" };
      case WebhookTopic_2_0.IssueCredentialIndy:
        return { result: "Success" };
      default:
        return new NotImplemented(`Webhook ${topic} is not supported`);
    }
  }
}
