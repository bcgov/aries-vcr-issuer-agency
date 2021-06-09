<template>
  <div>
    <div class="schema-attributes">
      <p>Attributes</p>
      <SchemaAttributeInput
        v-for="attribute in attributes"
        :key="attribute.id"
        :attribute="attribute"
        @removeAttribute="removeAttribute"
        @addLabel="addLabel"
        @removeLabel="removeLabel"
      />
    </div>
    <v-btn block elevation="0" @click="addAttribute">
      <v-icon left>mdi-plus-circle</v-icon>
      <span>Add Attribute</span>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import SchemaAttributeInput, { Attribute } from './SchemaAttributeInput.vue';
import { LocalizedLabel } from './SchemLabelForm.vue';

export interface KeyedLocalizedLabel {
  id: number;
  localizedLabel: LocalizedLabel;
}

export interface KeyedLocale {
  id: number;
  locale: string;
}

@Component({
  components: {
    SchemaAttributeInput
  }
})
export default class SchemaAttributeForm extends Vue {
  @Prop() attributes!: Attribute[];

  @Emit('addAttribute')
  addAttribute (): Attribute {
    return {
      id: this.attributes.length + 1,
      name: '',
      type: null,
      cardinal: false,
      search: false,
      dateType: null,
      address: {
        addressee: '',
        civic_address: '',
        city: '',
        province: '',
        postal_code: '',
        country: ''
      }
    };
  }

  @Emit('removeAttribute')
  removeAttribute (id: number): number {
    return id;
  }

  @Emit('addLabel')
  addLabel ({ id, localizedLabel }: KeyedLocalizedLabel): KeyedLocalizedLabel {
    return { id, localizedLabel };
  }

  @Emit('removeLabel')
  removeLabel ({ id, locale }: KeyedLocale): KeyedLocale {
    return { id, locale };
  }
}
</script>

<style scoped>
.schema-attributes {
  margin-bottom: 16px;
}
</style>
