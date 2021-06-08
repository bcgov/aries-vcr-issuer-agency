<template>
  <div>
    <p>Attributes</p>
    <SchemaAttributeInput
      v-for="attribute in attributes"
      :key="attribute.id"
      :attribute="attribute"
    />
    <v-btn block @click="addAttribute">
      <v-icon left>mdi-plus-circle</v-icon>
      <span>Add Attribute</span>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SchemaAttributeInput, { Attribute } from './SchemaAttributeInput.vue';

@Component({
  components: {
    SchemaAttributeInput
  }
})
export default class SchemaAttributeForm extends Vue {
  @Prop() attributes!: Attribute[];

  addAttribute (): void {
    this.attributes.push({
      id: this.attributes.length + 1,
      name: '',
      type: null,
      cardinal: false,
      search: false,
      dateType: null
    });
  }
}
</script>
