import Vue from 'vue';
import Vuex from 'vuex';
import app, { State as AppState } from './modules/app';
import alert, { State as AlertState } from './modules/notification';
import schema, { State as SchemaState } from './modules/schema';

Vue.use(Vuex);

export interface State {
  app: AppState,
  alert: AlertState,
  schema: SchemaState
}

const store = new Vuex.Store({
  modules: {
    app,
    alert,
    schema
  }
});

export default store;
