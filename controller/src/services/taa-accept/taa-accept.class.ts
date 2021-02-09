import { Params } from '@feathersjs/feathers';
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from 'feathers-swagger/types';
import { Application } from '../../declarations';
import {
  LedgerServiceAction,
  ServiceType,
  WalletServiceAction,
} from '../../models/enums';
import { TAAServiceResponse } from '../../models/ledger';
import { WalletServiceResponse } from '../../models/wallet';
import { AriesAgentData } from '../aries-agent/aries-agent.class';

interface Data {
  mechanism: string;
  text: string;
  version: string;
}

interface ServiceOptions {}

export class TaaAccept implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceSwaggerOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<any> {
    const taa = (await this.app.service('aries-agent').create({
      service: ServiceType.Ledger,
      action: LedgerServiceAction.TAA_Fetch,
      token: params?.profile.wallet.token,
      data: data,
    } as AriesAgentData)) as TAAServiceResponse;

    if (!taa.taa_required) {
      // Just return success without doing anything as it is not required
      return {};
    }

    const isDIDPublic = (await this.app.service('aries-agent').create({
      service: ServiceType.Wallet,
      action: WalletServiceAction.Fetch,
      token: params?.profile.wallet.token,
      data: {},
    } as AriesAgentData)) as WalletServiceResponse;
    if (!isDIDPublic.result) {
      // DID needs to be made public
      await this.app.service('aries-agent').create({
        service: ServiceType.Wallet,
        action: WalletServiceAction.Publish,
        token: params?.profile.wallet.token,
        data: params?.profile.did,
      } as AriesAgentData);
    }

    // TODO: verify ACA-Py will update the TAA if submitted more than once
    await this.app.service('aries-agent').create({
      service: ServiceType.Ledger,
      action: LedgerServiceAction.TAA_Accept,
      token: params?.profile.wallet.token,
      data: data,
    } as AriesAgentData);
    return {};
  }

  docs: ServiceSwaggerOptions = {
    refs: {
      createResponse: 'empty_body',
    },
    definitions: {
      empty_body: {
        title: 'empty',
        type: 'object',
        required: [],
        properties: {},
      },
    },
    operations: {},
    securities: ['all'],
  };

  model = {
    type: 'object',
    properties: {
      mechanism: {
        description: 'The TAA acceptance mechanism.',
        type: 'string',
      },
      text: {
        description: 'The text of the TAA at the time of acceptance.',
        type: 'string',
      },
      version: {
        description: 'The version of the TAA at the time of acceptance.',
        type: 'string',
      },
    },
  };
}
