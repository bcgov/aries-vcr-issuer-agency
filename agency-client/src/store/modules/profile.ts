import axios from 'axios';
import { ActionContext } from 'vuex';
import { State as RootState } from '@/store/index';
import { processProfile } from '@/utils/profile';

export interface IssuerProfile {
  did?: Readonly<string>;
  verkey?: Readonly<string>;
  name?: Readonly<string>;
  abbreviation?: string;
  url?: string;
  email?: string;
  logo?: string;
  complete: boolean;
  [key: string]: string | boolean | undefined;
}

export interface State {
  profile: IssuerProfile;
}

const state: State = {
  profile: {
    complete: false
  }
};

const getters = {
  profile: (state: State): IssuerProfile => state.profile
};

const actions = {
  async fetchProfile ({ commit, getters }:
    ActionContext<State, RootState>): Promise<void> {
    const response = await axios.get(getters.controller.url.toString() + 'profile');
    commit('setProfile', response.data);
  },
  async updateProfile ({ commit, getters }:
    ActionContext<State, RootState>, profile: IssuerProfile): Promise<void> {
    const response = await axios.patch(getters.controller.url.toString() + 'profile', profile);
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
