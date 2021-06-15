<template>
  <v-form ref="form">
    <v-container>
      <v-alert
        text
        color="info"
        icon="mdi-information"
        v-if="!jsonInput || parseError || Object.keys(errors).length"
      >
        <div v-if="!jsonInput || parseError">
          <h4>Enter a valid JSON Schema</h4>
        </div>
        <div v-else-if="Object.keys(errors).length">
          <h4>A valid Schema:</h4>
          <ul>
            <li v-for="(description, key) of errors" :key="key">
              {{ description }} at path: {{ key }}
            </li>
          </ul>
        </div>
      </v-alert>
      <v-alert v-else text color="success" icon="mdi-check-circle">
        <h4>The Schema is valid</h4>
      </v-alert>
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
                :auto-grow="true"
                v-model="jsonInput"
                required
                :rules="[() => !!jsonInput || 'This field is required']"
                @input="validateJson"
                @change="prettyPrintJson"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text router-link to="/"> Cancel </v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="primary" type="submit" @click="submit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapActions } from 'vuex';
import validate from '../../json-schemas/schema';
import router from '../../router';
import { Schema } from '../../store/modules/schema';

interface Data {
  jsonInput: string;
  jsonOutput: unknown;
  parseError: boolean;
  validationError: boolean;
}

@Component({
  methods: {
    ...mapActions(['addSchema', 'updateSchema'])
  }
})
export default class SchemaJsonForm extends Vue {
  jsonInput!: string;
  jsonOutput!: unknown;
  parseError!: boolean;
  validationError!: boolean;

  addSchema!: (schema: Schema) => void;
  updateSchema!: (schema: Schema) => void;

  @Prop() schema!: Schema | undefined;

  get isEditMode (): boolean {
    return !!this.schema;
  }

  get errors (): Record<string, string> {
    let e: { [key: string]: string } = {};
    if (this.validationError) {
      const error = validate?.errors?.[0];
      if (error) {
        e = { [error.instancePath || '/']: error.message || '' };
      }
    }
    if (this.isEditMode && this.schema) {
      const current = this.jsonOutput as Schema;
      const nameChanged = current.schema_name !== this.schema.schema_name;
      const versionChanged =
        current.schema_version !== this.schema.schema_version;
      const attributesChanged =
        JSON.stringify(current.attributes) !==
        JSON.stringify(this.schema.attributes);
      if (nameChanged || versionChanged || attributesChanged) {
        e = {
          ...e,
          '/metadata': 'can only have metadata changed when updating a Schema'
        };
      }
    }
    return e;
  }

  data (): Data {
    let input = '';
    let output = {};
    if (this.schema) {
      input = JSON.stringify(this.schema, null, 2);
      this.parseJson(input);
      output = this.jsonOutput as Schema;
    }

    return {
      jsonInput: input,
      jsonOutput: output,
      parseError: false,
      validationError: false
    };
  }

  validateJson (input: string): void {
    this.validationError = false;
    this.parseJson(input);
    const valid = validate(this.jsonOutput);
    this.validationError = !valid;
  }

  prettyPrintJson (input: string): void {
    this.parseJson(input);
    if (!this.parseError) {
      this.jsonInput = JSON.stringify(this.jsonOutput, null, 2);
    }
  }

  submit (): void {
    if (!(this.parseError && this.validationError)) {
      if (this.isEditMode) {
        this.updateSchema(this.jsonOutput as Schema);
      } else {
        this.addSchema(this.jsonOutput as Schema);
      }
      router.push('/');
    }
  }

  private parseJson (input: string): void {
    try {
      this.parseError = false;
      this.jsonOutput = JSON.parse(input);
    } catch (e) {
      this.parseError = true;
    }
  }
}
</script>
