<template>
  <div>
    <v-form ref="form">
      <v-container>
        <v-card>
          <v-card-title>Issue Credential Form</v-card-title>
          <v-container>
            <v-row dense justify="center">
              <v-col cols="12" md="12">
                <v-autocomplete
                  label="Schema"
                  outlined
                  prepend-inner-icon="mdi-magnify"
                  required
                  :return-object="true"
                  :items="schemas"
                  :item-text="
                    (schema) => `${schema.schema_name}:${schema.schema_version}`
                  "
                  v-model="selected"
                  @input="setSchema"
                  :rules="[() => !!schema || 'This field is required']"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row dense v-if="schema">
              <v-col
                v-for="attribute in attributes"
                :key="attribute.id"
                cols="12"
                md="12"
              >
                <CredentialAttributeInput :attribute="attribute" />
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn text router-link to="/">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn text color="primary" type="submit">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { Schema } from '../../store/modules/schema';
import { Attribute, formatSchemaAttributes } from '../../utils/schema';
import CredentialAttributeInput from './CredentialAttributeInput.vue';

interface Data {
  selected: Schema | null | undefined;
}

@Component({
  components: {
    CredentialAttributeInput
  }
})
export default class CredentialForm extends Vue {
  selected!: Schema | null | undefined;

  @Prop({ default: () => [] }) schemas!: Schema[];
  @Prop() schema!: Schema | null | undefined;

  get attributes (): Attribute[] {
    return formatSchemaAttributes(this.selected);
  }

  data (): Data {
    return {
      selected: this.schema
    };
  }

  @Emit('setSchema')
  setSchema (): Schema | null | undefined {
    return this.selected;
  }
}
</script>
