import { Conflict } from '@feathersjs/errors';
import { NullableId, Paginated, Params } from '@feathersjs/feathers';
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from 'feathers-swagger/types';
import { v4 as uuidv4 } from 'uuid';
import { Application } from '../../declarations';
import logger from '../../logger';
import { ConnectionServiceResponse } from '../../models/connection';
import {
  ConnectionServiceAction,
  MultitenancyServiceAction,
  ServiceType,
  WalletServiceAction,
} from '../../models/enums';
import { BaseIssuerProfile } from '../../models/issuer-model';
import {
  MultitenancyServiceRequest,
  MultitenancyServiceResponse,
} from '../../models/multitenancy';
import { WalletServiceResponse } from '../../models/wallet';
import { AriesAgentData } from '../aries-agent/aries-agent.class';

interface Data extends BaseIssuerProfile {}

interface ServiceOptions {}

export class Admin implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceSwaggerOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(
    data: Data,
    params?: Params
  ): Promise<BaseIssuerProfile | Error> {
    try {
      // Remove special characters and replace spaces with "_", useful for matching existing users
      // as well as having a suitable name for the issuer's wallet schema
      const normalizedName = data.name
        .normalize('NFD')
        .replace(/[^a-zA-Z0-9\s]+/g, '')
        .replace(/\s+/g, '_');

      const existingProfiles = (await this.app.service('issuer-model').find({
        query: { normalizedName: normalizedName },
        collation: { locale: 'en', strength: 1 },
      })) as Paginated<Data>;

      if (existingProfiles.data.length > 0) {
        return new Conflict(
          `A profile with a matching normalized name of '${normalizedName}' has already been created`
        );
      }

      // Create sub-wallet
      const subWalletRequestData = {
        label: data.name,
        wallet_name: normalizedName,
        wallet_key: normalizedName,
        wallet_type: 'indy',
        key_management_mode: 'managed',
        wallet_dispatch_type: 'default',
        wallet_webhook_urls: this.app.get('defaultWebhookHosts'),
      } as MultitenancyServiceRequest;
      const subWallet = (await this.app.service('aries-agent').create({
        service: ServiceType.Multitenancy,
        action: MultitenancyServiceAction.Create,
        data: subWalletRequestData,
      } as AriesAgentData)) as MultitenancyServiceResponse;

      // Create wallet DID
      const subWalletDid = (await this.app.service('aries-agent').create({
        service: ServiceType.Wallet,
        action: WalletServiceAction.Create,
        token: subWallet.token,
      } as AriesAgentData)) as WalletServiceResponse;

      // Connect to credential registry
      const connection = (await this.app.service('aries-agent').create({
        service: ServiceType.Connection,
        action: ConnectionServiceAction.Create,
        token: subWallet.token,
        data: {
          alias: data.name,
        },
      } as AriesAgentData)) as ConnectionServiceResponse;

      // Create profile
      const issuerApiKey = uuidv4();
      await this.app.service('issuer-model').create({
        name: data.name,
        normalizedName: normalizedName,
        'api-key': issuerApiKey,
        wallet: {
          id: subWallet.wallet_id,
          name: subWallet.settings['wallet.name'],
          token: subWallet.token,
        },
        did: subWalletDid.result.did,
        verkey: subWalletDid.result.verkey,
        vcr_connection_id: connection.connection_id,
      } as BaseIssuerProfile);

      logger.debug(`Created new profile with name ${data.name}`);

      return { name: data.name, 'api-key': issuerApiKey };
    } catch (e) {
      return e as Error;
    }
  }

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: NullableId, params: Params): Promise<any> {
    try {
      await this.app.service('issuer-model').remove(id);
      return {};
    } catch (e) {
      return e as Error;
    }
  }

  docs: ServiceSwaggerOptions = {
    description:
      'Creation and deletion of issuer profiles, used by Agency administrators.',
    idType: 'string',
    refs: {
      createResponse: 'admin_create_response',
      removeResponse: 'empty_body',
    },
    definitions: {
      admin_create_response: {
        title: 'admin',
        type: 'object',
        required: ['name', 'api-key'],
        properties: {
          name: {
            type: 'string',
            description: 'The name of the issuer',
          },
          'api-key': {
            type: 'string',
            description: 'The new api-key generated for this issuer.',
          },
        },
      },
      empty_body: {
        title: 'empty',
        type: 'object',
        required: [],
        properties: {},
      },
    },
    securities: ['all'],
  };

  model = {
    description: 'Base Issuer Model',
    type: 'object',
    required: ['name'],
    properties: {
      id: {
        type: 'string',
        description: 'The issuer identifier generated by the system',
        readOnly: true,
      },
      name: {
        type: 'string',
        description: 'The name of the issuer',
      },
    },
  };
}
