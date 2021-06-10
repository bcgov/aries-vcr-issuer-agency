<template>
  <v-container>
    <v-card elevation="2">
      <v-card-title>
        <span>JSON Schema Output</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="showJsonOutput = !showJsonOutput">
          <v-icon>{{
            showJsonOutput ? "mdi-chevron-up" : "mdi-chevron-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-expand-transition>
        <v-container v-if="showJsonOutput">
          <pre>{{ JSON.stringify(schema, null, 2) }}</pre>
        </v-container>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Schema } from '../../store/modules/schema';

interface Data {
  showJsonOutput: boolean;
}

@Component
export default class SchemaJsonOutput extends Vue {
  @Prop({ default: () => ({}) }) schema!: Schema;

  data (): Data {
    return {
      showJsonOutput: false
    };
  }
}
</script>
