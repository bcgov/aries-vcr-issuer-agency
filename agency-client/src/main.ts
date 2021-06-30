import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { AppConfig, getAppConfig } from './services/config';

Vue.config.productionTip = false;

async function init () {
  const config: AppConfig = await getAppConfig();
  new Vue({
    router,
    store,
    vuetify,
    created: () => store.dispatch('setController', { url: config.controller.url }),
    render: h => h(App)
  }).$mount('#app');
}

init();
