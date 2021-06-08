<template>
  <v-form ref="form">
    <v-container>
      <v-card elevation="2">
        <v-card-title>Schema Form</v-card-title>
        <v-container>
          <div>
            <p>Identifiers</p>
            <v-row dense>
              <v-col cols="12" md="12">
                <v-text-field
                  ref="name"
                  label="Schema Name"
                  outlined
                  required
                  v-model="name"
                  :rules="[() => !!name || 'This field is required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  ref="version"
                  label="Schema Version"
                  outlined
                  required
                  v-model="version"
                  :rules="[() => !!version || 'This field is required']"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
          <SchemaAttributeForm :attributes="attributes" />
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
import SchemaAttributeForm from './SchemaAttributeForm.vue';
import { Attribute } from './SchemaAttributeInput.vue';

interface Data {
  name: string;
  version: string;
  attributes: Attribute[];
  label: Record<string, string>;
}

@Component({
  components: {
    SchemaAttributeForm
  }
})
export default class SchemaForm extends Vue {
  data (): Data {
    return {
      name: '',
      version: '',
      label: {},
      attributes: []
    };
  }
}
</script>
