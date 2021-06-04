<template>
  <v-container>
    <ProfileCard />
  </v-container>
</template>

<script lang="ts">
import ProfileCard from '../components/profile/ProfileCard.vue';

export default {
  name: 'Home',
  components: {
    ProfileCard
  }
};
</script>
