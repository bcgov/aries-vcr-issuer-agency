import { Forbidden } from '@feathersjs/errors';
import { HookContext, Paginated, Service } from '@feathersjs/feathers';
import { IssuerProfileDbModel } from '../../models/issuer-model';

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

export async function authenticateIssuer(
  context: HookContext
): Promise<HookContext<any, Service<any>>> {
  const headers = context.params.headers || {};
  const apiKeyHeader = headers['issuer-api-key'] as string;

  if (!apiKeyHeader) {
    throw new Forbidden('The issuer-api-key header is missing');
  }

  const issuer = (await context.app.service('issuer-model').find({
    query: { 'api-key': apiKeyHeader },
  })) as Paginated<IssuerProfileDbModel>;

  if (issuer.data.length !== 1) {
    throw new Forbidden('The provided issuer-api-key is invalid');
  }

  return context;
}
