import { HookContext } from '../../app';
import { authenticateIssuer } from '../../utils/hooks/authentication';
import { checkValidIssuerProfile } from '../../utils/hooks/issuer-profile';

export default {
  before: {
    all: [authenticateIssuer, checkValidIssuerProfile],
    find: [],
    get: [],
    // TODO: Add this to a named function
    create: [async (context: HookContext) => {
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
    create: [],
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
