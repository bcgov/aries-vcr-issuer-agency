import Vue from 'vue';
import Vuex from 'vuex';
import app, { State as AppState } from './modules/app';
import profile, { State as ProfileState } from './modules/profile';

Vue.use(Vuex);

export interface State {
  app: AppState,
  profile: ProfileState
}

const store = new Vuex.Store({
  modules: {
    app,
    profile
  }
});

export default store;