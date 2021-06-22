<template>
  <v-container v-if="profile">
    <SchemaList v-if="profile.complete" :schemas="schemas" />
    <v-alert v-else prominent type="info">
      <v-row align="center">
        <v-col class="grow">
          Please complete your profile to enable Issuer features.
        </v-col>
        <v-col class="shrink">
          <v-btn router-link to="/profile/edit">Complete profile</v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import SchemaList from '../components/schema/SchemaList.vue';

@Component({
  name: 'Dashboard',
  components: {
    SchemaList
  },
  computed: {
    ...mapGetters(['profile', 'schemas'])
  }
})
export default class Dashboard extends Vue {}
</script>
