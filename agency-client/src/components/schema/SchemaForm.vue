<template>
  <div>
    <v-form ref="form">
      <v-container>
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
              <SchemaLabelList
                :labels="localizedLabels"
                @addLabel="addLabel"
                @removeLabel="removeLabel"
              />
            </div>
            <SchemaAttributeForm
              :attributes="attributes"
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
    <v-container>
      <v-card elevation="2">
        <v-card-title>
          <span>JSON Schema Output</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="showJsonOutput = !showJsonOutput">
            <v-icon>{{
              showJsonOutput ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-expand-transition>
          <v-container v-if="showJsonOutput">
            <pre>{{ JSON.stringify(schema, null, 2) }}</pre>
          </v-container>
        </v-expand-transition>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SchemaLabelList, { Translation } from './SchemaLabelList.vue';
import SchemaAttributeForm, {
  KeyedLocale,
  KeyedLocalizedLabel
} from './SchemaAttributeForm.vue';
import {
  Attribute,
  AttributeFieldType,
  DateFieldType
} from './SchemaAttributeInput.vue';
import { LocalizedLabel } from './SchemLabelForm.vue';
import {
  AddressMetadata,
  DateMetadata,
  Metadata,
  MetadataTranslation,
  Schema
} from '../../store/modules/schema';

interface Data {
  name: string;
  version: string;
  attributes: Attribute[];
  localizedLabels: Record<string, Translation>;
  showJsonOutput: boolean;
}

@Component({
  components: {
    SchemaLabelList,
    SchemaAttributeForm
  }
})
export default class SchemaForm extends Vue {
  name!: string;
  version!: number;
  attributes!: Attribute[];
  localizedLabels!: Record<string, Translation>;

  get schema (): Partial<Schema> {
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

  get schemaMetadata (): Metadata {
    return {
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

  data (): Data {
    return {
      name: '',
      version: '',
      attributes: [],
      localizedLabels: {},
      showJsonOutput: false
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
    // TODO: Need to add a validator to ensure at least one attribute is added
    // TODO: Need to add a validator to ensure at least one effective_date is added
    // TODO: Need to add a validator to ensure at least one revoked_date is added
    // TODO: Need to add a validator to ensure at least one attribute mapped as topic
    e.preventDefault();
    const isFormValid = (
      this.$refs.form as Vue & { validate: () => void }
    ).validate();
    console.log(isFormValid);
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

  private replaceAttribute (id: number, attribiute: Attribute): void {
    this.attributes.splice(
      this.attributes.findIndex((attribiute) => attribiute.id === id),
      1,
      attribiute
    );
  }
}
</script>

<style scoped>
.schema-identifiers {
  margin-bottom: 16px;
}
</style>
