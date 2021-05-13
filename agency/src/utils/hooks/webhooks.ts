import { Forbidden } from '@feathersjs/errors';
import { HookContext, Paginated, Service } from '@feathersjs/feathers';
import { IssuerProfileModel } from '../../models/issuer-model';

export async function extractSubwallet(
  context: HookContext
): Promise<HookContext<any, Service<any>>> {
  const subwalletId = (context.params.headers || {})['x-wallet-id'];

  if (!subwalletId) {
    throw new Forbidden('The x-wallet-id header is invalid or missing');
  }

  const issuer = (await context.app.service('issuer/model').find({
    query: { 'wallet.id': subwalletId },
  })) as Paginated<IssuerProfileModel>;

  if (!issuer.data.length) {
    throw new Forbidden(`Issuer could not be found with wallet ID: ${subwalletId}`);
  }

  context.params.wallet = issuer.data[0].wallet;
  return context;
}