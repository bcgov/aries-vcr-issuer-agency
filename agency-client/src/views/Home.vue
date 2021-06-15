<template>
  <div>
    <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
    <AppRouterView v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapActions } from 'vuex';
import AppRouterView from '../components/app/AppRouterView.vue';

interface Data {
  loading: boolean;
}

@Component({
  name: 'Home',
  components: {
    AppRouterView
  },
  methods: {
    ...mapActions(['fetchProfile', 'fetchSchemas'])
  }
})
export default class HomeView extends Vue {
  loading!: boolean;

  fetchProfile!: () => Promise<void>;
  fetchSchemas!: () => Promise<void>;

  data (): Data {
    return {
      loading: true
    };
  }

  async created (): Promise<void> {
    await this.fetchProfile();
    await this.fetchSchemas();
    this.loading = false;
  }
}
</script>
