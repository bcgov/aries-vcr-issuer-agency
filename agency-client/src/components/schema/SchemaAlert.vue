<template>
  <v-alert
    v-if="Object.keys(errors).length"
    text
    color="info"
    icon="mdi-information"
  >
    <h4>A valid Schema:</h4>
    <ul>
      <li v-for="(description, key) in errors" :key="key">{{ description }}</li>
    </ul>
  </v-alert>
  <v-alert v-else text color="success" icon="mdi-check-circle">
    <h4>The Schema is valid</h4>
  </v-alert>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SchemaAlert extends Vue {
  @Prop({ default: () => ({}) }) errors!: Record<string, string>;
}
</script>
