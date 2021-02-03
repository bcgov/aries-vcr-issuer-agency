import { Forbidden } from '@feathersjs/errors';
import { HookContext, Service } from '@feathersjs/feathers';

export async function authenticateAdmin(
  context: HookContext
): Promise<HookContext<any, Service<any>>> {
  const headers = context.params.headers || {};
  const apiKeyHeader = headers['x-api-key'] as string;
  const adminApiKey = context.app.get('authentication')?.adminApiKey;

  if (!apiKeyHeader || adminApiKey !== apiKeyHeader) {
    throw new Forbidden('The x-api-key header is invalid or missing');
  }
  return context;
}
