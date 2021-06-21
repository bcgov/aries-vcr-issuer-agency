<template>
  <div>
    <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
    <AppRouterView v-if="authenticated" />
    <AppLogin v-else />
    <AppSnackbar
      v-for="alert in alerts"
      :key="alert.id"
      :alert="alert"
    ></AppSnackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import AppRouterView from '../components/app/AppRouterView.vue';
import AppLogin from '../components/app/AppLogin.vue';
import AppSnackbar from '../components/app/AppSnackbar.vue';
import { Alert, AlertType } from '../store/modules/alert';

@Component({
  name: 'Home',
  components: {
    AppRouterView,
    AppLogin,
    AppSnackbar
  },
  computed: {
    ...mapGetters(['loading', 'alerts', 'authenticated'])
  },
  methods: {
    ...mapActions([
      'addAlert',
      'setLoading',
      'fetchProfile',
      'fetchSchemas',
      'deauthenticate'
    ])
  }
})
export default class HomeView extends Vue {
  authenticated!: boolean;
  alerts!: Alert[];

  addAlert!: (alert: Alert) => void;
  deauthenticate!: () => void;
  fetchProfile!: () => Promise<void>;
  fetchSchemas!: () => Promise<void>;
  setLoading!: (loading: boolean) => void;

  async created (): Promise<void> {
    await this.load();
  }

  @Watch('authenticated')
  onAuthenticated (): void {
    this.load();
  }

  private async load (): Promise<void> {
    try {
      this.setLoading(true);
      if (this.authenticated) {
        await this.fetchProfile();
        await this.fetchSchemas();
      }
    } catch (e) {
      // TODO:
      this.addAlert({
        type: AlertType.ERROR,
        msg: 'Unable to authenticate'
      });
      this.deauthenticate();
    } finally {
      this.setLoading(false);
    }
  }
}
</script>
