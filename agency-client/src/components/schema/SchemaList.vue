<template>
  <v-card elevation="2">
    <v-card-title>Schemas</v-card-title>
    <v-list-item-group>
      <v-list-item v-if="!(schemas && schemas.length)">
        <v-list-item-content>
          <v-list-item-subtitle>
            Nothing to show here! Click on 'PUBLISH SCHEMA' to create a Schema.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-else
        v-for="schema in schemas"
        :key="schema.id"
        router-link
        :to="`schema/${schema.id}/edit`"
      >
        <v-list-item-content>
          <v-list-item-title>
            Name: {{ schema.schema_name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            Version: {{ schema.schema_version }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="primary" router-link to="/schema/add">
        Publish Schema
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters(['schemas'])
  }
})
export default class SchemaList extends Vue {}
</script>
