import { GeneralError } from '@feathersjs/errors';
import { HookContext, Paginated, Service } from '@feathersjs/feathers';
import { DuplicatedProfileError } from '../../models/errors';
import { IssuerProfileModel } from '../../models/issuer-model';

export async function checkValidIssuerProfile(
  context: HookContext
): Promise<HookContext<any, Service<any>>> {
  const headers = context.params.headers || {};
  const apiKeyHeader = headers['issuer-api-key'] as string;

  const result = (await context.app.service('issuer-model').find({
    query: { 'api-key': apiKeyHeader },
    collation: { locale: 'en', strength: 1 },
  })) as Paginated<IssuerProfileModel>;

  if (result.total > 1 || result.data.length !== 1) {
    throw new DuplicatedProfileError(
      'The request returned inconsistent data, please contact an administrator.'
    );
  }

  const profile = result.data[0];

  if (!profile._id) {
    throw new GeneralError(
      'Unable to determine the identifier for the profile to be updated, please contact an administrator.'
    );
  }

  context.params.profile = profile;
  return context;
}
