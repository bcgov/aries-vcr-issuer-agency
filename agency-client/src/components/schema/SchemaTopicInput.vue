<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-switch
        label="Map attribute as Topic"
        inset
        dense
        v-model="topic.mapped"
      ></v-switch>
    </v-col>
    <v-col v-if="topic.mapped" cols="12" md="6">
      <v-combobox
        label="Schema Name"
        hint="Leaving this blank will default to current Schema"
        persistent-hint
        outlined
        v-model="topic.schema"
        @input="handleSchemaInput"
      ></v-combobox>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Topic } from './SchemaAttributeInput.vue';

@Component
export default class SchemaTopicInput extends Vue {
  @Prop({ default: () => ({ mapped: false, schema: '' }) }) topic!: Topic;

  handleSchemaInput (schema: string): void {
    this.topic.schema = schema;
  }
}
</script>
