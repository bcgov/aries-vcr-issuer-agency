<template>
  <div>
    <v-alert v-if="profile && !profile.complete" prominent type="info">
      <v-row align="center">
        <v-col class="grow">
          Please complete your profile to enable Issuer features.
        </v-col>
        <v-col class="shrink">
          <v-btn router-link to="/profile/edit">Complete profile</v-btn>
        </v-col>
      </v-row>
    </v-alert>
    <v-card elevation="2">
      <div v-if="!profile">
        <v-skeleton-loader
          type="list-item-avatar, list-item-three-line, actions"
        ></v-skeleton-loader>
      </div>
      <div v-else>
        <v-card-title>Issuer Profile</v-card-title>
        <v-list-item three-line>
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
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            v-if="profile && profile.complete"
            router-link
            to="/profile/edit"
          >
            Update profile
          </v-btn>
          <v-btn
            text
            color="primary"
            v-if="profile && !profile.complete"
            router-link
            to="/profile/edit"
          >
            Complete profile
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters(['profile'])
  }
})
export default class Profile extends Vue {}
</script>
