import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Profile from '../views/Profile.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/profile/edit',
    name: 'EditProfile',
    component: Profile
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
