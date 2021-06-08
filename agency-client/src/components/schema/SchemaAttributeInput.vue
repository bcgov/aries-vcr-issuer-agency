<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="12">
        <v-btn
          class="remove-attribute"
          icon
          @click="removeAttribute(attribute.id)"
        >
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="Name"
          outlined
          required
          :rules="[() => !!attribute.name || 'This field is required']"
          v-model="attribute.name"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          label="Type"
          outlined
          required
          :rules="[() => !!attribute.type || 'This field is required']"
          :items="attributeTypes"
          item-text="label"
          item-value="value"
          v-model="attribute.type"
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-if="attribute.type === attributeFieldType.DATE"
          label="Date Type"
          outlined
          required
          :rules="[() => !!attribute.dateType || 'This field is required']"
          :items="dateTypes"
          item-text="label"
          item-value="value"
          v-model="attribute.dateType"
        ></v-select>
      </v-col>
    </v-row>
    <v-row dense no-gutters>
      <v-col cols="12" md="3">
        <v-checkbox
          dense
          label="Searchable attribute"
          v-model="attribute.search"
        ></v-checkbox>
      </v-col>
      <v-col cols="12" md="3">
        <v-checkbox
          dense
          label="Cardinal attribute"
          v-model="attribute.cardinal"
        ></v-checkbox>
      </v-col>
    </v-row>
    <SchemaLabelList
      :labels="attribute.localizedLabels"
      @addLabel="addLabel(attribute.id, $event)"
      @removeLabel="removeLabel(attribute.id, $event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { KeyedLocale, KeyedLocalizedLabel } from './SchemaAttributeForm.vue';
import SchemaLabelList, { Translation } from './SchemaLabelList.vue';
import { LocalizedLabel } from './SchemLabelForm.vue';

export enum AttributeFieldType {
  TEXT = 1,
  NUMBER,
  DATE,
  ADDRESS,
}

export enum DateFieldType {
  EFFECTIVE = 1,
  REVOKED,
  OTHER,
}

export interface Attribute {
  id: Readonly<number>;
  name: string;
  type: AttributeFieldType | null;
  cardinal: boolean;
  search: boolean;
  dateType: DateFieldType | null;
  localizedLabels?: Record<string, Translation>;
}

@Component({
  components: {
    SchemaLabelList
  }
})
export default class extends Vue {
  attributeFieldType = AttributeFieldType;
  dateFieldType = DateFieldType;

  attributeTypes = [
    { label: 'Text', value: AttributeFieldType.TEXT },
    { label: 'Number', value: AttributeFieldType.NUMBER },
    { label: 'Date', value: AttributeFieldType.DATE },
    { label: 'Address', value: AttributeFieldType.ADDRESS }
  ];

  dateTypes = [
    { label: 'Effective Date', value: DateFieldType.EFFECTIVE },
    { label: 'Revoked Date', value: DateFieldType.REVOKED },
    { label: 'Other Date', value: DateFieldType.OTHER }
  ];

  @Prop() attribute!: Attribute;

  @Emit('removeAttribute')
  removeAttribute (id: number): number {
    return id;
  }

  @Emit('addLabel')
  addLabel (id: number, localizedLabel: LocalizedLabel): KeyedLocalizedLabel {
    return { id, localizedLabel };
  }

  @Emit('removeLabel')
  removeLabel (id: number, locale: string): KeyedLocale {
    return { id, locale };
  }
}
</script>

<style scoped>
.remove-attribute {
  float: right;
}
</style>
