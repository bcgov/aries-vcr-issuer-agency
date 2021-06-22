<template>
  <div>
    <v-progress-linear indeterminate fixed v-if="loading"></v-progress-linear>
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
    ...mapActions(['fetchSchemas'])
  }
})
export default class HomeView extends Vue {
  authenticated!: boolean;

  fetchSchemas!: () => Promise<void>;

  @Watch('authenticated')
  async onAuthenticated (authenticated: boolean): Promise<void> {
    if (authenticated) {
      await this.fetchSchemas();
    }
  }
}
</script>
