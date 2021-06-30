<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <span>Aries VCR Issuer Agency (Alpha)</span>
      <v-spacer></v-spacer>
      <ProfileMenu v-if="authenticated" />
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import ProfileMenu from './components/profile/ProfileMenu.vue';

@Component({
  components: {
    ProfileMenu
  },
  computed: {
    ...mapGetters(['authenticated'])
  },
  methods: {
    ...mapActions(['setController'])
  }
})
export default class App extends Vue {
  setController!: ({ url }: { url: string }) => void;

  created (): void {
    // TODO: Configure the controller
    this.setController({ url: 'http://localhost:3030' });
  }
}
</script>
