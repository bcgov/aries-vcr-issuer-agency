<template>
  <v-container>
    <v-tabs v-model="tab">
      <v-tab href="#schema-form">Form</v-tab>
      <v-tab href="#schema-json-form">JSON</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="schema-form">
        <SchemaForm />
      </v-tab-item>
      <v-tab-item value="schema-json-form">
        <SchemaJsonForm />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SchemaForm from '../components/schema/SchemaForm.vue';
import SchemaJsonForm from '../components/schema/SchemaJsonForm.vue';

interface Data {
  tab: string | null;
}

@Component({
  name: 'Schema',
  components: {
    SchemaForm,
    SchemaJsonForm
  }
})
export default class extends Vue {
  data (): Data {
    return {
      tab: null
    };
  }
}
</script>
