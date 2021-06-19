<template>
  <div>
    <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
    <AppRouterView v-if="authenticated" />
    <AppLogin v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import AppRouterView from '../components/app/AppRouterView.vue';
import AppLogin from '../components/app/AppLogin.vue';

@Component({
  name: 'Home',
  components: {
    AppRouterView,
    AppLogin
  },
  computed: {
    ...mapGetters(['loading', 'authenticated'])
  },
  methods: {
    ...mapActions([
      'setLoading',
      'fetchProfile',
      'fetchSchemas',
      'deauthenticate'
    ])
  }
})
export default class HomeView extends Vue {
  authenticated!: boolean;

  setLoading!: (loading: boolean) => void;
  fetchProfile!: () => Promise<void>;
  fetchSchemas!: () => Promise<void>;
  deauthenticate!: () => void;

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
      this.deauthenticate();
    } finally {
      this.setLoading(false);
    }
  }
}
</script>
