import axios from 'axios';
import { ActionContext } from 'vuex';
import { State as RootState } from '@/store/index';
import { processProfile } from '@/utils/profile';
import { ISSUER_API_KEY } from './app';

const ISSUER_PROFILE_URL = 'issuer/profile';

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

export interface State {
  profile: IssuerProfile | null;
}

const state: State = {
  profile: null
};

const getters = {
  profile: (state: State): IssuerProfile | null => state.profile
};

const actions = {
  async fetchProfile ({ commit, getters }:
    ActionContext<State, RootState>): Promise<void> {
    const response = await axios.get(getters.controller.url.toString() + ISSUER_PROFILE_URL, {
      headers: { [ISSUER_API_KEY]: getters.controller[ISSUER_API_KEY] }
    });
    commit('setProfile', response.data);
  },
  async updateProfile ({ commit, getters }:
    ActionContext<State, RootState>, profile: IssuerProfile): Promise<void> {
    const response = await axios.post(getters.controller.url.toString() + ISSUER_PROFILE_URL, profile, {
      headers: { [ISSUER_API_KEY]: getters.controller[ISSUER_API_KEY] }
    });
    commit('setProfile', response.data);
  }
};

const mutations = {
  setProfile: (state: State, profile: IssuerProfile): IssuerProfile =>
    (state.profile = processProfile(profile))
};

export default {
  state,
  actions,
  getters,
  mutations
};
