import { ActionContext } from 'vuex';
import { State as RootState } from '@/store/index';
import { AlertType } from './notification';
import axios from 'axios';
import { processProfile } from '@/utils/profile';

const ISSUER_PROFILE_URL = 'issuer/profile';

export const ISSUER_API_KEY = 'issuer-api-key';

export interface IssuerProfile {
  did?: Readonly<string>;
  verkey?: Readonly<string>;
  name?: Readonly<string>;
  abbreviation?: string;
  url?: string;
  email?: string;
  logo?: string;
  complete?: boolean;
  [key: string]: string | boolean | undefined;
}

export interface Controller {
  [ISSUER_API_KEY]: string;
  url?: URL;
}

export interface State {
  loading: boolean,
  controller: Controller,
  profile: IssuerProfile | null;
}

const state: State = {
  loading: false,
  controller: {
    [ISSUER_API_KEY]: ''
  },
  profile: null
};

const getters = {
  loading: (state: State): boolean => !!state.loading,
  authenticated: (state: State): boolean => !!(state.controller[ISSUER_API_KEY] && state.profile),
  controller: (state: State): Controller => state.controller,
  profile: (state: State): IssuerProfile | null => state.profile
};

const actions = {
  async authenticate ({ dispatch, commit, getters }: ActionContext<State, RootState>, key: string): Promise<void> {
    try {
      dispatch('setLoading', true);
      if (!key) {
        throw new Error('API Key must be provided');
      }
      commit('setKey', key);
      const response = await axios.get(getters.controller.url.toString() + ISSUER_PROFILE_URL, {
        headers: { [ISSUER_API_KEY]: getters.controller[ISSUER_API_KEY] }
      });
      commit('setProfile', response.data);
    } catch (error) {
      console.error(error);
      dispatch('notify', { type: AlertType.ERROR, msg: 'Unable to authenticate' });
    } finally {
      dispatch('setLoading', false);
    }
  },
  deauthenticate ({ commit }: ActionContext<State, RootState>): void {
    commit('setKey', '');
    commit('setProfile', null);
  },
  setLoading ({ commit }: ActionContext<State, RootState>, loading: boolean): void {
    commit('setLoading', loading);
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
  },
  async updateProfile ({ dispatch, commit, getters }:
    ActionContext<State, RootState>, profile: IssuerProfile): Promise<void> {
    try {
      dispatch('setLoading', true);
      const response = await axios.post(getters.controller.url.toString() + ISSUER_PROFILE_URL, profile, {
        headers: { [ISSUER_API_KEY]: getters.controller[ISSUER_API_KEY] }
      });
      commit('setProfile', response.data);
      dispatch('notify', { type: AlertType.SUCCESS, msg: 'Profile successfully updated' });
    } catch (error) {
      console.error(error);
      dispatch('notify', { type: AlertType.ERROR, msg: 'There was a problem' });
    } finally {
      dispatch('setLoading', false);
    }
  }
};

const mutations = {
  setLoading: (state: State, loading: boolean): boolean => (state.loading = loading),
  setKey: (state: State, key: string): string => (state.controller[ISSUER_API_KEY] = key),
  setController: (state: State, controller: Controller): Controller => (state.controller = controller),
  setProfile: (state: State, profile: IssuerProfile): IssuerProfile =>
    (state.profile = processProfile(profile))
};

export default {
  state,
  getters,
  actions,
  mutations
};
