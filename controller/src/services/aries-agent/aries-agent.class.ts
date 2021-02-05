import { NotImplemented } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
import Axios from 'axios';
import { Application } from '../../declarations';
import logger from '../../logger';
import {
  AriesConnection,
  ConnectionServiceResponse,
} from '../../models/connection';
import {
  AriesCredentialAttribute,
  AriesCredentialExchange,
  AriesCredentialOffer,
  CredExServiceResponse,
} from '../../models/credential-exchange';
import {
  ConnectionServiceAction,
  CredDefServiceAction,
  CredExServiceAction,
  LedgerServiceAction,
  MultitenancyServiceAction,
  SchemasServiceAction,
  ServiceType,
  WalletServiceAction,
} from '../../models/enums';
import {
  MultitenancyServiceRequest,
  MultitenancyServiceResponse,
} from '../../models/multitenancy';
import { WalletServiceResponse } from '../../models/wallet';
import { AcaPyUtils } from '../../utils/aca-py';
import { formatCredentialPreview } from '../../utils/credential-exchange';

export interface AriesAgentData {
  service: ServiceType;
  action:
    | ConnectionServiceAction
    | CredDefServiceAction
    | CredExServiceAction
    | LedgerServiceAction
    | MultitenancyServiceAction
    | SchemasServiceAction
    | WalletServiceAction;
  token?: string;
  data: any;
}

interface ServiceOptions {}

export class AriesAgent {
  app: Application;
  options: ServiceOptions;
  acaPyUtils: AcaPyUtils;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
    this.acaPyUtils = AcaPyUtils.getInstance(app);
    this.init();
  }

  private async init() {
    const result = await this.acaPyUtils.init();

    this.app.set('schemas', result.schemas);
    this.app.set('credDefs', result.credDefs);

    logger.info('Aries Agent service initialized');
  }

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: AriesAgentData, params?: Params): Promise<any> {
    switch (data.service) {
      case ServiceType.Multitenancy:
        if (data.action === MultitenancyServiceAction.Create) {
          return this.newSubWallet(data.data as MultitenancyServiceRequest);
        }
      case ServiceType.Wallet:
        if (data.action === WalletServiceAction.Create) {
          return this.newDID(data.token);
        }
      case ServiceType.Connection:
        if (data.action === ConnectionServiceAction.Create) {
          return this.newRegistryConnection(data.data.alias, data.token);
        } else {
          return this.getConnection(data.data.connection_id);
        }
      case ServiceType.CredEx:
        if (data.action === CredExServiceAction.Create) {
          return this.issueCredential(
            data.data.credential_exchange_id,
            data.data.attributes
          );
        }
      default:
        return new NotImplemented(
          `The operation ${data.service}/${data.action} is not supported`
        );
    }
  }

  private async newSubWallet(
    data: MultitenancyServiceRequest
  ): Promise<MultitenancyServiceResponse> {
    logger.debug(`Creating new sub-wallet with name ${data.wallet_name}`);
    const url = `${this.acaPyUtils.getAdminUrl()}/multitenancy/wallet`;
    const response = await Axios.post(
      url,
      data,
      this.acaPyUtils.getRequestConfig()
    );
    return response.data as MultitenancyServiceResponse;
  }

  private async newDID(
    token: string | undefined
  ): Promise<WalletServiceResponse> {
    logger.debug(`Creating new ${token ? 'sub-' : 'main '}wallet DID`);
    const url = `${this.acaPyUtils.getAdminUrl()}/wallet/did/create`;
    const response = await Axios.post(
      url,
      {},
      this.acaPyUtils.getRequestConfig(token)
    );
    return response.data as WalletServiceResponse;
  }

  private async newRegistryConnection(
    alias: string,
    token: string | undefined
  ): Promise<ConnectionServiceResponse> {
    const registryAlias = this.app.get('aries-vcr').alias;

    logger.debug(
      `Creating new connection to Credential Registry with alias ${alias}`
    );
    const registryResponse = await Axios.post(
      `${this.acaPyUtils.getRegistryAdminUrl()}/connections/create-invitation?alias=${alias}`,
      {},
      this.acaPyUtils.getRegistryRequestConfig()
    );

    logger.debug(
      `Accepting connection invitation from Credential Registry ${registryAlias}`
    );
    const response = await Axios.post(
      `${this.acaPyUtils.getAdminUrl()}/connections/receive-invitation?alias=${registryAlias}`,
      registryResponse.data.invitation,
      this.acaPyUtils.getRequestConfig(token)
    );
    return response.data as ConnectionServiceResponse;
  }

  private async getConnection(id: string): Promise<ConnectionServiceResponse> {
    logger.debug(`Getting info for connection [${id}]`);
    const url = `${this.acaPyUtils.getAdminUrl()}/connections/${id}`;
    const response = await Axios.get(url, this.acaPyUtils.getRequestConfig());
    const data = response.data as AriesConnection;
    return {
      connection_id: data.connection_id,
      state: data.state,
    } as ConnectionServiceResponse;
  }

  private async newCredentialExchange(
    data: AriesCredentialOffer
  ): Promise<any> {
    logger.debug('Creating new credential exchange');
    const url = `${this.acaPyUtils.getAdminUrl()}/issue-credential/send-offer`;
    const response = await Axios.post(
      url,
      data,
      this.acaPyUtils.getRequestConfig()
    );
    const credExData = response.data as AriesCredentialExchange;
    return {
      credential_exchange_id: credExData.credential_exchange_id,
      state: credExData.state,
    } as CredExServiceResponse;
  }

  private async getCredentialExchange(
    id: string
  ): Promise<CredExServiceResponse> {
    logger.debug(`Fetching data for credential exchange [${id}]`);
    const url = `${this.acaPyUtils.getAdminUrl()}/issue-credential/records/${id}`;
    const response = await Axios.get(url, this.acaPyUtils.getRequestConfig());
    const credExData = response.data as AriesCredentialExchange;
    return {
      credential_exchange_id: credExData.credential_exchange_id,
      state: credExData.state,
    } as CredExServiceResponse;
  }

  private async issueCredential(
    id: string,
    attributes: AriesCredentialAttribute[]
  ): Promise<CredExServiceResponse> {
    logger.debug(`Issuing credential on credential exchange [${id}]`);
    const url = `${this.acaPyUtils.getAdminUrl()}/issue-credential/records/${id}/issue`;
    const response = await Axios.post(
      url,
      { credential_preview: formatCredentialPreview(attributes) },
      this.acaPyUtils.getRequestConfig()
    );
    const credExData = response.data as AriesCredentialExchange;
    return {
      credential_exchange_id: credExData.credential_exchange_id,
      state: credExData.state,
    } as CredExServiceResponse;
  }

  private async revokeCredential(
    revocation_id: string,
    revoc_reg_id: string
  ): Promise<boolean> {
    logger.debug(
      `Attempting revocation for id [${revocation_id}] on registry [${revoc_reg_id}]`
    );
    const url = `${this.acaPyUtils.getAdminUrl()}/revocation/revoke`;
    const response = await Axios.post(
      url,
      {
        cred_rev_id: revocation_id,
        rev_reg_id: revoc_reg_id,
        publish: true,
      },
      this.acaPyUtils.getRequestConfig()
    );
    return response.status === 200;
  }
}
