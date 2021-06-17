<template>
  <div>
    <v-text-field
      v-if="isTextAttribute(attribute)"
      :label="attributeLabel(attribute)"
      outlined
      dense
      :hint="attributeHint(attribute)"
      :persistent-hint="true"
      v-model="value"
      :rules="[
        () =>
          !isRequiredAttribute(attribute) ||
          !!value ||
          'This field is required',
      ]"
    ></v-text-field>
    <v-menu
      v-else-if="isDateAttribute(attribute)"
      :close-on-content-click="false"
      transition="scale-transition"
      min-width="auto"
      v-model="menu"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          :label="attributeLabel(attribute)"
          outlined
          dense
          readonly
          prepend-inner-icon="mdi-calendar"
          :hint="attributeHint(attribute)"
          :persistent-hint="true"
          v-model="value"
          :rules="[
            () =>
              !isRequiredAttribute(attribute) ||
              !!value ||
              'This field is required',
          ]"
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        no-title
        scrollable
        @change="menu = false"
        v-model="value"
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  Attribute,
  AttributeFieldType,
  DateFieldType
} from '../../utils/schema';

interface Data {
  menu: boolean;
  value: string;
}

@Component
export default class CredentialAttributeInput extends Vue {
  value!: string;

  @Prop() attribute!: Attribute;

  data (): Data {
    return {
      menu: false,
      value: ''
    };
  }

  attributeLabel (attribute: Attribute): string {
    let label = attribute.name;
    const enLabel = attribute?.localizedLabels?.en?.label;
    if (enLabel) {
      label = `${enLabel} (${attribute.name})`;
    }
    return label;
  }

  attributeHint (attribute: Attribute): string {
    return attribute?.localizedLabels?.en?.description || '';
  }

  isTextAttribute (attribute: Attribute): boolean {
    return attribute.type === AttributeFieldType.TEXT;
  }

  isDateAttribute (attribute: Attribute): boolean {
    return attribute.type === AttributeFieldType.DATE;
  }

  isRequiredAttribute (attribute: Attribute): boolean {
    return (
      attribute?.topic?.mapped ||
      attribute?.cardinal ||
      attribute?.search ||
      (attribute?.type === AttributeFieldType.DATE &&
        (attribute?.dateType === DateFieldType.EFFECTIVE ||
          attribute?.dateType === DateFieldType.REVOKED))
    );
  }
}
</script>
