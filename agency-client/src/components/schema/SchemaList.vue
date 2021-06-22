<template>
  <v-card elevation="2">
    <v-card-title>Schemas</v-card-title>
    <v-card-text v-if="!(schemas && schemas.length)">
      Nothing to show here! Click on 'PUBLISH SCHEMA' to create a Schema.
    </v-card-text>
    <v-virtual-scroll
      v-else
      :items="schemas"
      item-height="64"
      max-height="70vh"
    >
      <template v-slot:default="{ item: schema }">
        <v-list-item :key="schema.name + ':' + schema.version">
          <v-list-item-content>
            <v-list-item-title>
              Name: {{ schema.schema_name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              Version: {{ schema.schema_version }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-spacer></v-spacer>
          <SchemaListMenu :schema="schema" />
        </v-list-item>
      </template>
    </v-virtual-scroll>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn text v-if="schemas.length" router-link to="/credential/issue">
        Issue Credential
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn text color="primary" router-link to="/schema/add">
        Publish Schema
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Schema } from '../../store/modules/schema';
import SchemaListMenu from './SchemaListMenu.vue';

@Component({
  components: {
    SchemaListMenu
  }
})
export default class SchemaList extends Vue {
  @Prop() schemas!: Schema[];
}
</script>
