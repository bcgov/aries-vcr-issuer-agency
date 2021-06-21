import { ActionContext } from 'vuex';
import { State as RootState } from '@/store/index';

export const ISSUER_API_KEY = 'issuer-api-key';

export interface Controller {
  [ISSUER_API_KEY]: string;
  url?: URL;
}

export interface State {
  loading: boolean,
  controller: Controller
}

const state: State = {
  loading: false,
  controller: {
    [ISSUER_API_KEY]: ''
  }
};

const getters = {
  loading: (state: State): boolean => !!state.loading,
  authenticated: (state: State): boolean => !!state.controller[ISSUER_API_KEY],
  controller: (state: State): Controller => state.controller
};

const actions = {
  setLoading ({ commit }: ActionContext<State, RootState>, loading: boolean): void {
    commit('setLoading', loading);
  },
  authenticate ({ commit }: ActionContext<State, RootState>, key: string): void {
    if (!key) {
      throw new Error('API Key must be provided');
    }
    commit('setKey', key);
  },
  deauthenticate ({ commit }: ActionContext<State, RootState>): void {
    console.log('Logging user out');
    commit('setKey', '');
  },
  setController ({ commit }: ActionContext<State, RootState>, options: { url: string }): void {
    if (!options.url) {
      throw new Error('Controller URL must be provided');
    }
    const controller: Controller = {
      [ISSUER_API_KEY]: '',
      url: new URL(options.url)
    };
    commit('setController', controller);
  }
};

const mutations = {
  setLoading: (state: State, loading: boolean): boolean => (state.loading = loading),
  setKey: (state: State, key: string): string => (state.controller[ISSUER_API_KEY] = key),
  setController: (state: State, controller: Controller): Controller => (state.controller = controller)
};

export default {
  state,
  getters,
  actions,
  mutations
};
