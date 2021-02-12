import { authenticateIssuer } from '../../utils/hooks/authentication';
import { checkValidIssuerProfile } from '../../utils/hooks/issuer-profile';

export default {
  before: {
    all: [authenticateIssuer, checkValidIssuerProfile],
    find: [],
    get: [],
    create: [],
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
