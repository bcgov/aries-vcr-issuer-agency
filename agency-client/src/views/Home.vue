<template>
  <div>
    <v-container>
      <Profile />
    </v-container>
    <v-container v-if="profile && profile.complete">
      <SchemaList />
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import Profile from '../components/profile/Profile.vue';
import SchemaList from '../components/schema/SchemaList.vue';

@Component({
  name: 'Home',
  components: {
    Profile,
    SchemaList
  },
  computed: {
    ...mapGetters(['profile'])
  },
  methods: {
    ...mapActions(['fetchProfile', 'fetchSchemas'])
  }
})
export default class HomeView extends Vue {
  fetchProfile!: () => void;
  fetchSchemas!: () => void;

  created (): void {
    this.fetchProfile();
    this.fetchSchemas();
  }
}
</script>
