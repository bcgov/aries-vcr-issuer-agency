import { HookContext, Service } from '@feathersjs/feathers';
import logger from '../../logger';

export async function autoSyncIssuerRegistration(
  context: HookContext
): Promise<HookContext<any, Service<any>>> {
  logger.debug(
    `Synchronizing issuer registration for ${context.params.profile.name}`
  );
  return context;
}
