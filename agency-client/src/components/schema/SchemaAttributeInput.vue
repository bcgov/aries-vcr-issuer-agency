<template>
  <div>
    <v-row dense>
      <v-spacer></v-spacer>
      <v-col cols="12" md="3">
        <v-btn
          class="remove-attribute"
          plain
          block
          elevation="0"
          :disabled="isEditMode"
          @click="removeAttribute(attribute.id)"
        >
          <v-icon>mdi-delete</v-icon>
          <span>Remove Attribute</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
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
    <SchemaAttributeAddressInput
      :address="attribute.address"
      v-if="attribute.type === attributeFieldType.ADDRESS"
    />
    <v-row dense no-gutters>
      <v-col cols="12" md="12">
        <v-switch
          label="Make attribute searchable"
          inset
          dense
          hide-details
          v-model="attribute.search"
        ></v-switch>
      </v-col>
      <v-col cols="12" md="12">
        <v-switch
          label="Attribute has cardinality"
          inset
          dense
          hide-details
          v-model="attribute.cardinal"
        ></v-switch>
      </v-col>
      <v-col cols="12" md="12">
        <SchemaTopicInput :topic="attribute.topic" />
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
import SchemaLabelList from './SchemaLabelList.vue';
import SchemaTopicInput from './SchemaTopicInput.vue';
import SchemaAttributeAddressInput from './SchemaAttributeAddressInput.vue';
import { LocalizedLabel } from './SchemLabelForm.vue';
import { Attribute, AttributeFieldType, DateFieldType } from '../../utils/schema';

@Component({
  components: {
    SchemaTopicInput,
    SchemaAttributeAddressInput,
    SchemaLabelList
  }
})
export default class extends Vue {
  attributeFieldType = AttributeFieldType;
  dateFieldType = DateFieldType;

  attributeTypes = [
    { label: 'Text', value: AttributeFieldType.TEXT },
    // { label: 'Number', value: AttributeFieldType.NUMBER },
    { label: 'Date', value: AttributeFieldType.DATE },
    { label: 'Address', value: AttributeFieldType.ADDRESS }
  ];

  dateTypes = [
    { label: 'Effective Date', value: DateFieldType.EFFECTIVE },
    { label: 'Revoked Date', value: DateFieldType.REVOKED },
    { label: 'Other Date', value: DateFieldType.OTHER }
  ];

  @Prop() attribute!: Attribute;
  @Prop({ default: false }) isEditMode!: boolean;

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
