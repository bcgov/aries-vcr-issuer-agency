import { authenticateIssuer } from '../../utils/hooks/authentication';
import { checkValidIssuerProfile } from '../../utils/hooks/issuer-profile';
import { autoSyncIssuerRegistration } from '../../utils/hooks/issuer-registration';
import { validateSchemaModel } from '../../utils/hooks/schemas';

export default {
  before: {
    all: [authenticateIssuer, checkValidIssuerProfile],
    find: [],
    get: [],
    create: [validateSchemaModel],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [autoSyncIssuerRegistration],
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
