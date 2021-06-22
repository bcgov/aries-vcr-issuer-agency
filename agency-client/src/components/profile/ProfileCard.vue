<template>
  <div>
    <v-card elevation="2">
      <v-card-title>Issuer Profile</v-card-title>
      <v-card-text v-if="!profile.complete">
        Nothing to show here! Click on 'COMPLETE PROFILE' to create a Profile.
      </v-card-text>
      <v-list-item v-else three-line>
        <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            <span>{{ profile.name }}</span>
            <span v-if="profile.abbreviation"
              >&nbsp;({{ profile.abbreviation }})</span
            >
          </v-list-item-title>
          <v-list-item-subtitle v-if="profile.url">
            <a :href="profile.url" target="_blank">Visit website</a>
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="profile.email">
            <a :href="'mailto:' + profile.email">{{ profile.email }}</a>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn text @click="deauthenticate">
          Logout
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          v-if="profile.complete"
          router-link
          to="/profile/edit"
        >
          Update profile
        </v-btn>
        <v-btn
          text
          color="primary"
          v-else
          router-link
          to="/profile/edit"
        >
          Complete profile
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapActions } from 'vuex';
import { IssuerProfile } from '../../store/modules/app';

@Component({
  methods: {
    ...mapActions(['deauthenticate'])
  }
})
export default class ProfileCard extends Vue {
  @Prop() profile!: IssuerProfile;
}
</script>
