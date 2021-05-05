import { authenticateIssuer } from '../../utils/hooks/authentication';
import { postProcessCredentials, preProcessCredentials } from '../../utils/hooks/credential';
import { checkValidIssuerProfile } from '../../utils/hooks/issuer-profile';

export default {
  before: {
    all: [authenticateIssuer, checkValidIssuerProfile],
    find: [],
    get: [],
    create: [preProcessCredentials],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [postProcessCredentials],
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
