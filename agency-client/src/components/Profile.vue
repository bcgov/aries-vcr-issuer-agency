<template>
  <v-card elevation="2">
    <v-skeleton-loader
      type="list-item-avatar, list-item-three-line, actions"
    ></v-skeleton-loader>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Profile extends Vue {}
</script>
