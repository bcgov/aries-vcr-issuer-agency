<template>
  <v-form ref="form" :disabled="loading">
    <v-container>
      <v-alert
        text
        color="info"
        icon="mdi-information"
        v-if="!jsonInput || parseError"
      >
        <div v-if="!jsonInput || parseError">
          <h4>Enter a valid JSON Credential</h4>
        </div>
      </v-alert>
      <v-alert v-else text color="success" icon="mdi-check-circle">
        <h4>The Schema is valid</h4>
      </v-alert>
      <v-card elevation="2">
        <v-card-title>Issue Credential JSON Form</v-card-title>
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
                @input="parseJson"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text router-link to="/"> Cancel </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            type="submit"
            :disabled="loading"
            @click="submit"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */

import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import router from '../../router';
import { Credential } from '../../store/modules/credential';
import { Schema } from '../../store/modules/schema';

interface Data {
  jsonInput: string,
  jsonOutput: unknown,
  parseError: boolean
}

@Component({
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    ...mapActions(['issueCredential'])
  }
})
export default class CredentialJsonForm extends Vue {
  jsonInput!: string;
  jsonOutput!: unknown;
  parseError!: boolean;

  issueCredential!: (credential: Credential | Credential[]) => void;

  @Prop() schema!: Schema;

  data (): Data {
    let input = '';
    let output = {};
    if (this.schema) {
      const { schema_name, schema_version, attributes } = this.schema;
      input = JSON.stringify({
        schema_name,
        schema_version,
        attributes: attributes.reduce((acc, attribute) => ({ ...acc, [attribute]: '' }), {})
      }, null, 2);
      this.parseJson(input);
      output = this.jsonOutput as Credential;
    }

    return {
      jsonInput: input,
      jsonOutput: output,
      parseError: false
    };
  }

  async submit (e: Event): Promise<void> {
    e.preventDefault();
    if (!this.parseError) {
      await this.issueCredential(this.jsonOutput as Credential | Credential[]);
      router.push('/');
    }
  }

  parseJson (input: string): void {
    try {
      this.parseError = false;
      this.jsonOutput = JSON.parse(input);
    } catch (e) {
      this.parseError = true;
    }
  }
}
</script>
