<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>
    <ProfileCard :profile="profile" />
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import ProfileCard from './ProfileCard.vue';

@Component({
  components: {
    ProfileCard
  },
  computed: {
    ...mapGetters(['profile', 'schemas'])
  }
})
export default class ProfileMenu extends Vue {}
</script>
