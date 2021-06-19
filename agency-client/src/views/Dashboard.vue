<template>
  <div>
    <v-container v-if="profile">
      <ProfileCard :profile="profile" />
    </v-container>
    <v-container v-if="profile && profile.complete">
      <SchemaList :schemas="schemas" />
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import ProfileCard from '../components/profile/ProfileCard.vue';
import SchemaList from '../components/schema/SchemaList.vue';

@Component({
  name: 'Dashboard',
  components: {
    ProfileCard,
    SchemaList
  },
  computed: {
    ...mapGetters(['profile', 'schemas'])
  }
})
export default class Dashboard extends Vue {}
</script>
