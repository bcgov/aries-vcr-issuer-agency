<template>
  <div>
    <v-form ref="form" :disabled="loading">
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
                  :value="selected"
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
                <CredentialAttributeInput
                  :attribute="attribute"
                  @input="updateAttribute"
                />
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn text router-link to="/">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              type="submit"
              @click="submit"
              :disabled="loading"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import router from '../../router';
import { Schema } from '../../store/modules/schema';
import { Attribute, formatSchemaAttributes } from '../../utils/schema';
import CredentialAttributeInput from './CredentialAttributeInput.vue';
import { Credential } from '../../store/modules/credential';

interface Data {
  attributes: Attribute[];
}

@Component({
  components: {
    CredentialAttributeInput
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    ...mapActions(['issueCredential'])
  }
})
export default class CredentialForm extends Vue {
  attributes!: Attribute[];

  issueCredential!: (credential: Credential | Credential[]) => void;

  @Prop({ default: () => [] }) schemas!: Schema[];
  @Prop() schema!: Schema | null | undefined;

  get selected (): Schema | null | undefined {
    return this.schema;
  }

  get credential (): Credential {
    return {
      schema_name: this.selected?.schema_name || '',
      schema_version: this.selected?.schema_version || '',
      attributes: this.attributes.reduce((acc, attribute) => {
        return { ...acc, [attribute.name]: attribute?.value?.toString() || '' };
      }, {})
    };
  }

  data (): Data {
    return {
      attributes: formatSchemaAttributes(this.schema)
    };
  }

  @Emit('setSchema')
  setSchema (schema: Schema | null | undefined): Schema | null | undefined {
    this.attributes = formatSchemaAttributes(schema);
    return schema;
  }

  updateAttribute (attribute: Attribute): void {
    this.attributes.splice(
      this.attributes.findIndex((a) => a.id === attribute.id),
      1,
      attribute
    );
  }

  async submit (e: Event): Promise<void> {
    e.preventDefault();
    const isFormValid = (
      this.$refs.form as Vue & { validate: () => boolean }
    ).validate();
    if (isFormValid) {
      await this.issueCredential(this.credential);
      router.push('/');
    }
  }
}
</script>
