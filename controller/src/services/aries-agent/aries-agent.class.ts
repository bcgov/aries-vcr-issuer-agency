import { NotImplemented } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
import Axios, { AxiosError } from 'axios';
import { Application } from '../../declarations';
import logger from '../../logger';
import { ConnectionServiceResponse } from '../../models/connection';
import { AriesCredServiceRequest } from '../../models/credential';
import {
  AriesCredDefServiceRequest,
  CredDefServiceResponse,
} from '../../models/credential-definition';
import {
  ConnectionServiceAction,
  CredDefServiceAction,
  CredServiceAction,
  IssuerRegistrationServiceAction,
  LedgerServiceAction,
  MultitenancyServiceAction,
  SchemaServiceAction,
  ServiceType,
  WalletServiceAction,
} from '../../models/enums';
import { AriesAgentError } from '../../models/errors';
import { IssuerRegistrationPayload } from '../../models/issuer-registration';
import {
  MultitenancyServiceRequest,
  MultitenancyServiceResponse,
} from '../../models/multitenancy';
import { AriesSchema, AriesSchemaServiceRequest } from '../../models/schema';
import { WalletServiceResponse } from '../../models/wallet';
import { AcaPyUtils } from '../../utils/aca-py';

export interface AriesAgentData {
  service: ServiceType;
  action:
  | ConnectionServiceAction
  | CredDefServiceAction
  | CredServiceAction
  | LedgerServiceAction
  | MultitenancyServiceAction
  | SchemaServiceAction
  | WalletServiceAction
  | IssuerRegistrationServiceAction;
  token?: string;
  data: any;
}

interface ServiceOptions { }

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
        } else if (data.action === WalletServiceAction.Fetch) {
          return this.getPublicDID(data.token);
        } else if (data.action === WalletServiceAction.Publish) {
          return this.publishDID(data.data.did, data.token);
        }
      case ServiceType.Connection:
        if (data.action === ConnectionServiceAction.Create) {
          return this.newRegistryConnection(data.data.alias, data.token);
        }
      case ServiceType.Ledger:
        if (data.action === LedgerServiceAction.TAA_Fetch) {
          return this.fetchTAA(data.token);
        } else if (data.action === LedgerServiceAction.TAA_Accept) {
          return this.acceptTAA(
            data.token,
            data.data.mechanism,
            data.data.text,
            data.data.version
          );
        }
      case ServiceType.CredDef:
        if (data.action === CredDefServiceAction.Details) {
          return this.getCredDefDetailsForSchema(
            data.token,
            data.data.schema_id
          );
        } else if (data.action === CredDefServiceAction.Create) {
          return this.publishCredentialDefinition(data.data, data.token);
        }
      case ServiceType.Cred:
        if (data.action === CredServiceAction.Send) {
          return this.sendCredential(data.data, data.token);
        } else if (data.action === CredDefServiceAction.Create) {
          return this.createCredential(data.data, data.token)
        }
      case ServiceType.Schema:
        if (data.action === SchemaServiceAction.Details) {
          return this.getSchemaDetails(data.token, data.data.schema_id);
        } else if (data.action === SchemaServiceAction.List) {
          return this.getCreatedSchemas(data.token);
        } else if (data.action === SchemaServiceAction.Create) {
          return this.publishSchema(data.data, data.token);
        }
      case ServiceType.IssuerRegistration:
        if (data.action === IssuerRegistrationServiceAction.Submit) {
          return this.handleIssuerRegistration(data.data, data.token);
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
    try {
      logger.debug(`Creating new sub-wallet with name ${data.wallet_name}`);
      const url = `${this.acaPyUtils.getAdminUrl()}/multitenancy/wallet`;
      const response = await Axios.post(
        url,
        data,
        this.acaPyUtils.getRequestConfig()
      );
      return response.data as MultitenancyServiceResponse;
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  private async newDID(
    token: string | undefined
  ): Promise<WalletServiceResponse> {
    try {
      logger.debug(`Creating new ${token ? 'sub-' : 'main '}wallet DID`);
      const url = `${this.acaPyUtils.getAdminUrl()}/wallet/did/create`;
      const response = await Axios.post(
        url,
        {},
        this.acaPyUtils.getRequestConfig(token)
      );
      return response.data as WalletServiceResponse;
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  private async getPublicDID(
    token: string | undefined
  ): Promise<WalletServiceResponse> {
    try {
      logger.debug('Retrieving wallet DID');
      const url = `${this.acaPyUtils.getAdminUrl()}/wallet/did/public`;
      const response = await Axios.get(
        url,
        this.acaPyUtils.getRequestConfig(token)
      );
      return response.data as WalletServiceResponse;
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  private async publishDID(
    did: string,
    token: string | undefined
  ): Promise<WalletServiceResponse> {
    try {
      logger.debug(`Setting DID ${did} as public`);
      const url = `${this.acaPyUtils.getAdminUrl()}/wallet/did/public?did=${did}`;
      const response = await Axios.post(
        url,
        {},
        this.acaPyUtils.getRequestConfig(token)
      );
      return response.data as WalletServiceResponse;
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  private async newRegistryConnection(
    alias: string,
    token: string | undefined
  ): Promise<ConnectionServiceResponse> {
    try {
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
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  private async fetchTAA(token: string | undefined): Promise<any> {
    try {
      logger.debug('Fetching TAA');
      const url = `${this.acaPyUtils.getAdminUrl()}/ledger/taa`;
      const response = await Axios.get(
        url,
        this.acaPyUtils.getRequestConfig(token)
      );
      return response.data.result;
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  private async acceptTAA(
    token: string | undefined,
    mechanism: string,
    text: string,
    version: string
  ): Promise<any> {
    try {
      logger.debug('Accepting TAA');
      const url = `${this.acaPyUtils.getAdminUrl()}/ledger/taa/accept`;
      const response = await Axios.post(
        url,
        {
          mechanism: mechanism,
          text: text,
          version: version,
        },
        this.acaPyUtils.getRequestConfig(token)
      );
      return response.data;
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  private async getCreatedSchemas(
    token: string | undefined
  ): Promise<string[]> {
    try {
      logger.debug('Fetching all created schemas');
      const url = `${this.acaPyUtils.getAdminUrl()}/schemas/created`;
      const response = await Axios.get(
        url,
        this.acaPyUtils.getRequestConfig(token)
      );
      return response.data.schema_ids;
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  private async getSchemaDetails(
    token: string | undefined,
    schema_id: string
  ): Promise<AriesSchema> {
    try {
      logger.debug(`Fetching details for schema with id: ${schema_id}`);
      const url = `${this.acaPyUtils.getAdminUrl()}/schemas/${schema_id}`;
      const response = await Axios.get(
        url,
        this.acaPyUtils.getRequestConfig(token)
      );
      return response.data.schema;
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  private async getCredDefDetailsForSchema(
    token: string | undefined,
    schema_id: string
  ): Promise<string> {
    try {
      logger.debug(`Fetching credential definition for schema ${schema_id}`);
      const url = `${this.acaPyUtils.getAdminUrl()}/credential-definitions/created?schema_id=${schema_id}`;
      const response = await Axios.get(
        url,
        this.acaPyUtils.getRequestConfig(token)
      );
      return response.data.credential_definition_ids[0];
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  private async publishSchema(
    schema: AriesSchemaServiceRequest,
    token: string | undefined
  ): Promise<AriesSchema> {
    try {
      const url = `${this.acaPyUtils.getAdminUrl()}/schemas`;
      logger.debug(`Publishing schema to ledger: ${JSON.stringify(schema)}`);
      const response = await Axios.post(
        url,
        schema,
        this.acaPyUtils.getRequestConfig(token)
      );
      const schemaResponse = response.data as AriesSchema;
      return schemaResponse;
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  async publishCredentialDefinition(
    credDef: AriesCredDefServiceRequest,
    token: string | undefined
  ): Promise<CredDefServiceResponse> {
    try {
      logger.debug(
        `Publishing credential definition to ledger: ${JSON.stringify(credDef)}`
      );
      const url = `${this.acaPyUtils.getAdminUrl()}/credential-definitions`;
      const response = await Axios.post(
        url,
        credDef,
        this.acaPyUtils.getRequestConfig(token)
      );
      return response.data as CredDefServiceResponse;
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  private async handleIssuerRegistration(
    payload: IssuerRegistrationPayload,
    token: string | undefined
  ): Promise<any> {
    try {
      const issuerName = payload.issuer_registration.issuer.name;
      const schemaName = payload.issuer_registration.credential_types[0].schema;
      const schemaVersion =
        payload.issuer_registration.credential_types[0].version;
      logger.debug(
        `Processing issuer registration request for ${issuerName}, ${schemaName}:${schemaVersion}`
      );
      const url = `${this.acaPyUtils.getAdminUrl()}/issuer_registration/send`;
      const response = await Axios.post(
        url,
        payload,
        this.acaPyUtils.getRequestConfig(token)
      );
      return response.data;
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  // TODO: Need to type response
  private async sendCredential(
    credential: AriesCredServiceRequest,
    token: string | undefined
  ): Promise<any> {
    try {
      logger.debug(
        `Sending new credential: ${JSON.stringify(credential)}`
      );
      const url = `${this.acaPyUtils.getAdminUrl()}/issue-credential-2.0/send`;
      const response = await Axios.post(
        url,
        credential,
        this.acaPyUtils.getRequestConfig(token)
      );
      const credentialResponse = response.data;
      return credentialResponse;
    } catch (e) {
      const error = e as AxiosError;
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }

  // TODO: Need to type response
  private async createCredential(
    credential: AriesCredServiceRequest,
    token: string | undefined
  ): Promise<any> {
    try {
      logger.debug(
        `Creating new credential: ${JSON.stringify(credential)}`
      );
      const url = `${this.acaPyUtils.getAdminUrl()}/issue-credential-2.0/send-offer`;
      const response = await Axios.post(
        url,
        credential,
        this.acaPyUtils.getRequestConfig(token)
      );
      const credentialResponse = response.data;
      return credentialResponse;
    } catch (error) {
      throw new AriesAgentError(
        error.response?.statusText || error.message,
        error.response?.status,
        error.response?.data
      );
    }
  }
}
