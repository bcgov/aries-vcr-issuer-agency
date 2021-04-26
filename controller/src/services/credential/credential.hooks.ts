import { HookContext, Service } from '@feathersjs/feathers';
import { authenticateIssuer } from '../../utils/hooks/authentication';
import { checkValidIssuerProfile } from '../../utils/hooks/issuer-profile';

export default {
  before: {
    all: [authenticateIssuer, checkValidIssuerProfile],
    find: [],
    get: [],
    // TODO: Add this to a named function
    create: [async (context: HookContext): Promise<HookContext<any, Service<any>>> => {
      context.params.credentials = { pending: [], results: [] };
      return context;
    }],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    // TODO: Add this to a named function
    create: [async (context: HookContext): Promise<HookContext<any, Service<any>>> => {
      const params = context.params;
      params.credentials.results
        .sort((a: any, b: any) => a.order - b.order)
        .forEach((result: any, idx: number, self: any[]) => {
          self[idx] = {
            cred_ex_id: result?.credExId,
            success: result.success,
            error: result?.error?.message
          };
        });
      if (params.credentials.results.length === 1) {
        params.credentials.results = params.credentials.results[0];
      }
      context.result = params.credentials.results;
      return context;
    }],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
