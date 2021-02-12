import { HookContext, Service } from '@feathersjs/feathers';
import logger from '../../logger';
import {
  IssuerRegistrationServiceAction,
  ServiceType,
} from '../../models/enums';
import { SchemaServiceModel } from '../../models/schema';
import { AriesAgentData } from '../../services/aries-agent/aries-agent.class';
import { formatIssuerRegistrationRequest } from '../issuer-registration';

export async function autoSyncIssuerRegistration(
  context: HookContext
): Promise<HookContext<any, Service<any>>> {
  logger.debug(
    `Synchronizing issuer registration for ${context.params.profile.name}`
  );
  const issuerRegistrationPayload = formatIssuerRegistrationRequest(
    context.params.profile,
    context.data as SchemaServiceModel
  );
  await context.app.service('aries-agent').create({
    service: ServiceType.IssuerRegistration,
    action: IssuerRegistrationServiceAction.Submit,
    token: context.params?.profile.wallet.token,
    data: issuerRegistrationPayload,
  } as AriesAgentData);
  return context;
}
