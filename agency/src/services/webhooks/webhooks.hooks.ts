import { HookContext } from '@feathersjs/feathers';
import { extractSubwallet } from '../../utils/hooks/webhooks';

export default {
  before: {
    all: [extractSubwallet],
    create: [],
  },

  after: {
    all: [],
    create: [],
  },

  error: {
    all: [
      async (context: HookContext): Promise<HookContext> => {
        console.error(
          `Error in ${context.path} calling ${context.method}  method`,
          context.error
        );
        return context;
      },
    ],
    create: [],
  },
};
