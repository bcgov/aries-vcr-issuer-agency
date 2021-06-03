import { ActionContext } from 'vuex';
import { State as RootState } from '@/store/index';

export interface Controller {
    url?: URL;
}

export interface State {
    controller: Controller;
}

const state: State = {
  controller: {}
};

const getters = {
  controller: (state: State): Controller => state.controller
};

const actions = {
  setController ({ commit }: ActionContext<State, RootState>, options: { url: string }): void {
    if (!options.url) {
      throw new Error('Controller URL must be provided');
    }
    const controller: Controller = {
      url: new URL(options.url)
    };
    commit('setController', controller);
  }
};

const mutations = {
  setController: (state: State, controller: Controller): Controller => (state.controller = controller)
};

export default {
  state,
  getters,
  actions,
  mutations
};
