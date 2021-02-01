import { disallow } from 'feathers-hooks-common';
// import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.

// const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [disallow('external')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [disallow('external')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [disallow('external')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
