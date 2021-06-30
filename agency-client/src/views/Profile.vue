<template>
  <ProfileForm :profile="profile" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import ProfileForm from '../components/profile/ProfileForm.vue';

@Component({
  name: 'Profile',
  components: {
    ProfileForm
  },
  computed: {
    ...mapGetters(['profile'])
  }
})
export default class ProfileView extends Vue {}
</script>
