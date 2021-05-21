import { NotImplemented } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import {
  CredState_2_0,
  EndorserServiceAction,
  EndorserState,
  ServiceType,
  WebhookTopic,
  WebhookTopic_2_0
} from '../../models/enums';
import { WebhookData } from '../../models/webhooks';
import { AriesAgentData } from '../aries-agent/aries-agent.class';

interface ServiceOptions { }

export class Webhooks {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) { 
    this.options = options;
    this.app = app;
  }

  async create(data: WebhookData, params?: Params): Promise<any> {
    const topic = params?.route?.topic;
    const state = data?.state;
    switch (topic) {
      case WebhookTopic_2_0.IssueCredential:
        const cred_ex_id = data?.cred_ex_id;
        if (!state || state === CredState_2_0.Done) {
          if (cred_ex_id) {
            this.app.service('events').emit(cred_ex_id, data);
          } else {
            // TODO: Gracefully handle the error here
            return { result: 'Error' };
          }
        }
        return { result: 'Success' };
      case WebhookTopic.EndorseTransaction:
        if (state === EndorserState.TransactionEndorsed) {
          await this.app.service('aries-agent').create({
            service: ServiceType.Endorser,
            action: EndorserServiceAction.Write_Transaction,
            token: params?.wallet?.token || '',
            data: {
              transaction_id: data._id
            }
          } as AriesAgentData);
        } else if (state === EndorserState.TransactionCompleted) {
          const txnMsgId = data?.messages_attach?.[0]?.['@id'] || '';
          if (txnMsgId) {
            this.app.service('events').emit(txnMsgId, data);
          } else {
            // TODO: Gracefully handle the error here
            return { result: 'Error' };
          }
        }
        return { result: 'Success' };
      default:
        return new NotImplemented(`Webhook ${topic} is not supported`);
    }
  }
}
