<template>
  <div>
    <v-form ref="form">
      <v-container>
        <SchemaAlert :errors="errors" />
        <v-card elevation="2">
          <v-card-title>Schema Form</v-card-title>
          <v-container>
            <div class="schema-identifiers">
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
                    :disabled="isEditMode"
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
                    :disabled="isEditMode"
                  ></v-text-field>
                </v-col>
              </v-row>
              <SchemaLabelList
                :labels="localizedLabels"
                @addLabel="addLabel"
                @removeLabel="removeLabel"
              />
            </div>
            <SchemaAttributeForm
              :attributes="attributes"
              :isEditMode="isEditMode"
              @addAttribute="addAttribute"
              @removeAttribute="removeAttribute"
              @addLabel="addAttrbuteLabel"
              @removeLabel="removeAttributeLabel"
            />
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
    <SchemaJsonOutput :schema="schemaJson" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SchemaAlert from './SchemaAlert.vue';
import SchemaLabelList, { Translation } from './SchemaLabelList.vue';
import SchemaAttributeForm, {
  KeyedLocale,
  KeyedLocalizedLabel
} from './SchemaAttributeForm.vue';
import {
  Attribute,
  AttributeFieldType,
  DateFieldType,
  formatAttributes,
  formatLocalizedLabels
} from '../../utils/schema';
import { LocalizedLabel } from './SchemLabelForm.vue';
import SchemaJsonOutput from './SchemaJsonOutput.vue';
import {
  AddressMetadata,
  DateMetadata,
  Metadata,
  MetadataTranslation,
  Schema,
  TopicMetadata
} from '../../store/modules/schema';
import { mapActions } from 'vuex';

interface Data {
  name: string;
  version: string;
  attributes: Attribute[];
  localizedLabels: Record<string, Translation>;
}

@Component({
  components: {
    SchemaAlert,
    SchemaLabelList,
    SchemaAttributeForm,
    SchemaJsonOutput
  },
  methods: {
    ...mapActions(['addSchema', 'updateSchema'])
  }
})
export default class SchemaForm extends Vue {
  name!: string;
  version!: number;
  attributes!: Attribute[];
  localizedLabels!: Record<string, Translation>;

  addSchema!: (schema: Schema) => void;
  updateSchema!: (schema: Schema) => void;

  @Prop() schema!: Schema | undefined;

  get isEditMode (): boolean {
    return !!this.schema;
  }

  get schemaJson (): Partial<Schema> {
    return {
      schema_name: this.name,
      schema_version: this.version.toString(),
      attributes: this.schemaAttributes,
      metadata: this.schemaMetadata
    };
  }

  get schemaAttributes (): string[] {
    return this.attributes.map((attribute) => attribute.name);
  }

  get schemaMetadataTranslations (): MetadataTranslation {
    return this.metadataTranslations(this.localizedLabels);
  }

  get attributeMetadataTranslations (): MetadataTranslation[] {
    return this.attributes
      .filter(
        (attribute) => Object.keys(attribute?.localizedLabels || {}).length
      )
      .map((attribute) =>
        this.metadataTranslations(
          attribute.localizedLabels || {},
          attribute.name
        )
      );
  }

  get schemaMetadataSearchFields (): string[] {
    return this.attributes
      .filter((attribute) => attribute.search)
      .map((attribute) => attribute.name);
  }

  get schemaMetadataCardinality (): string[] {
    return this.attributes
      .filter((attribute) => attribute.cardinal)
      .map((attribute) => attribute.name);
  }

  get schemaMetadataAddressFields (): AddressMetadata[] {
    return this.attributes
      .filter((attribute) => attribute.type === AttributeFieldType.ADDRESS)
      .map((attribute) => ({
        addressee: attribute?.address?.addressee || '',
        civic_address: attribute?.address?.civic_address || '',
        city: attribute?.address?.city || '',
        province: attribute?.address?.province || '',
        postal_code: attribute?.address?.postal_code || '',
        country: attribute?.address?.country || ''
      }));
  }

  get schemaMetadataDateFields (): DateMetadata {
    const dateAttributes = this.attributes.filter(
      (attribute) => attribute.type === AttributeFieldType.DATE
    );
    const effectiveDateAttribute = dateAttributes.find(
      (attribute) => attribute.dateType === DateFieldType.EFFECTIVE
    );
    const revokedDateAttribute = dateAttributes.find(
      (attribute) => attribute.dateType === DateFieldType.REVOKED
    );
    const otherDateAttributes = dateAttributes
      .filter((attribute) => attribute.dateType === DateFieldType.OTHER)
      .map((attribute) => attribute.name);

    return {
      effective_date: effectiveDateAttribute?.name || '',
      revoked_date: revokedDateAttribute?.name || '',
      other_date_fields: otherDateAttributes
    };
  }

  get schemaMetadataTopic (): TopicMetadata[] {
    return this.attributes
      .filter((attribute) => attribute?.topic?.mapped)
      .map((attribute) => ({
        name: attribute?.name || '',
        topic_type: attribute?.topic?.schema || this.name
      }));
  }

  get schemaMetadata (): Metadata {
    return {
      topic: this.schemaMetadataTopic,
      labels: {
        schema: this.schemaMetadataTranslations,
        attributes: this.attributeMetadataTranslations,
        cardinality: this.schemaMetadataCardinality,
        address_fields: this.schemaMetadataAddressFields,
        date_fields: this.schemaMetadataDateFields,
        search_fields: this.schemaMetadataSearchFields
      }
    } as unknown as Metadata;
  }

  get errors (): Record<string, string> {
    let e = {};
    if (!this.attributes.length) {
      e = { ...e, attribute: 'must have at least one attribute' };
    }
    if (!this.attributes.some((attribute) => attribute?.topic?.mapped)) {
      e = {
        ...e,
        topic:
          'must have at least one attribute mapped as a Topic of a Credential'
      };
    }
    if (
      !this.attributes.some(
        (attribute) =>
          attribute.type === AttributeFieldType.DATE &&
          attribute.dateType === DateFieldType.EFFECTIVE
      )
    ) {
      e = {
        ...e,
        effective_date:
          'must have at least one attribute that is the Effective Date of a Credential'
      };
    }
    if (
      !this.attributes.some(
        (attribute) =>
          attribute.type === AttributeFieldType.DATE &&
          attribute.dateType === DateFieldType.REVOKED
      )
    ) {
      e = {
        ...e,
        revoked_date:
          'must have at least one attribute that is the Revoked Date of a Credential'
      };
    }
    return e;
  }

  data (): Data {
    return {
      name: this.schema?.schema_name || '',
      version: this.schema?.schema_version || '',
      attributes: this.formatSchemaAttributes(this.schema),
      localizedLabels: this.formatSchemaLocalizedLabels(this.schema)
    };
  }

  addLabel (localizedLabel: LocalizedLabel): void {
    this.localizedLabels = this.addLocalizedLabel(
      this.localizedLabels,
      localizedLabel
    );
  }

  removeLabel (locale: string): void {
    this.localizedLabels = this.removeLocalozedLabel(
      this.localizedLabels,
      locale
    );
  }

  addAttribute (attribute: Attribute): void {
    this.attributes = [...this.attributes, attribute];
  }

  removeAttribute (id: number): void {
    const attributes = [...this.attributes];
    attributes.splice(
      attributes.findIndex((attribute) => attribute.id === id),
      1
    );
    this.attributes = attributes;
  }

  addAttrbuteLabel ({ id, localizedLabel }: KeyedLocalizedLabel): void {
    let attribute = this.findAttribute(id);
    if (attribute) {
      attribute = { ...attribute };
      attribute.localizedLabels = this.addLocalizedLabel(
        attribute.localizedLabels || {},
        localizedLabel
      );
      this.replaceAttribute(id, attribute);
    }
  }

  removeAttributeLabel ({ id, locale }: KeyedLocale): void {
    let attribute = this.findAttribute(id);
    if (attribute) {
      attribute = { ...attribute };
      attribute.localizedLabels = this.removeLocalozedLabel(
        attribute.localizedLabels || {},
        locale
      );
      this.replaceAttribute(id, attribute);
    }
  }

  submit (e: Event): void {
    e.preventDefault();
    const isFormValid = (
      this.$refs.form as Vue & { validate: () => boolean }
    ).validate();
    if (isFormValid && !Object.keys(this.errors).length) {
      if (this.isEditMode) {
        this.updateSchema(this.schemaJson as Schema);
      } else {
        this.addSchema(this.schemaJson as Schema);
      }
    }
  }

  private removeLocalozedLabel (
    localizedLabels: Record<string, Translation>,
    locale: string
  ): Record<string, Translation> {
    const labels = Object.entries({ ...localizedLabels });
    labels.splice(
      labels.findIndex((label) => label[0] === locale),
      1
    );
    localizedLabels = labels.reduce(
      (acc, entry) => ({ ...acc, [entry[0]]: entry[1] }),
      {}
    );
    return localizedLabels;
  }

  private addLocalizedLabel (
    localizedLabels: Record<string, Translation>,
    localizedLabel: LocalizedLabel
  ): Record<string, Translation> {
    const { locale, label, description } = localizedLabel;
    localizedLabels = {
      ...localizedLabels,
      [locale]: { label, description }
    };
    return localizedLabels;
  }

  private metadataTranslations (
    localizedLabels: Record<string, Translation>,
    name?: string
  ): MetadataTranslation {
    return Object.entries(localizedLabels).reduce((acc, entry) => {
      const locale = entry[0];
      const { label, description } = entry[1];
      const translation = { [locale]: { label, description } };
      return { name, translations: { ...acc.translations, ...translation } };
    }, {} as MetadataTranslation);
  }

  private findAttribute (id: number): Attribute | undefined {
    return this.attributes.find((attribute) => attribute.id === id);
  }

  private replaceAttribute (id: number, attribute: Attribute): void {
    this.attributes.splice(
      this.attributes.findIndex((attribute) => attribute.id === id),
      1,
      attribute
    );
  }

  private formatSchemaAttributes (schema?: Schema): Attribute[] {
    if (!schema) {
      return [];
    }
    return formatAttributes(schema.metadata, schema.attributes);
  }

  private formatSchemaLocalizedLabels (
    schema?: Schema
  ): Record<string, Translation> {
    const labels = schema?.metadata?.labels?.schema;
    if (!(schema && labels)) {
      return {};
    }
    return formatLocalizedLabels(labels);
  }
}
</script>

<style scoped>
.schema-identifiers {
  margin-bottom: 16px;
}
</style>
