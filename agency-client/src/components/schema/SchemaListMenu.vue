<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        router-link
        :to="{
          path: `/credential/issue`,
          query: {
            schema_name: schema.schema_name,
            schema_version: schema.schema_version
          },
        }"
      >
        <v-list-item-title>Issue Credential</v-list-item-title>
      </v-list-item>
      <v-list-item
        router-link
        :to="{
          path: `/schema/${schema.schema_name}/${schema.schema_version}/edit`,
        }"
      >
        <v-list-item-title>Edit Schema</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Schema } from '../../store/modules/schema';

@Component
export default class SchemaListMenu extends Vue {
  @Prop() schema!: Schema;
}
</script>
