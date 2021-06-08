<template>
  <ProfileForm />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import ProfileForm from '../components/profile/ProfileForm.vue';

@Component({
  name: 'Profile',
  components: {
    ProfileForm
  }
})
export default class ProfileView extends Vue {}
</script>
