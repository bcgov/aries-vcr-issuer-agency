<template>
  <v-form ref="form">
    <v-container>
      <v-card elevation="2">
        <v-card-title>Schema JSON Form</v-card-title>
        <v-container>
          <v-row>
            <v-col cols="12" md="12">
              <v-textarea
                label="Schema"
                placeholder="Paste your JSON Schema here"
                outlined
                clear-icon="mdi-close-circle"
                v-model="json"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text router-link to="/"> Cancel </v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="primary" type="submit"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

interface Data {
  json: string;
}

@Component
export default class SchemaJsonForm extends Vue {
  data (): Data {
    return {
      json: ''
    };
  }
}
</script>
