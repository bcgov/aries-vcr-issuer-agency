<template>
  <v-container>
    <Profile />
  </v-container>
</template>

<script lang="ts">
import Profile from '../components/Profile.vue';

export default {
  name: 'Home',
  components: {
    Profile
  }
};
</script>
