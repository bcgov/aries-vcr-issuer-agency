<template>
  <v-container>
    <v-tabs v-model="tab">
      <v-tab href="#schema-form">Form</v-tab>
      <v-tab href="#schema-json-form">JSON</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="schema-form">
        <SchemaForm :schema="schema" />
      </v-tab-item>
      <v-tab-item value="schema-json-form">
        <SchemaJsonForm :schema="schema" />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import { Schema } from 'ajv';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import SchemaForm from '../components/schema/SchemaForm.vue';
import SchemaJsonForm from '../components/schema/SchemaJsonForm.vue';

interface Data {
  tab: string | null;
  schema: Schema | null | undefined;
}

@Component({
  name: 'Schema',
  components: {
    SchemaForm,
    SchemaJsonForm
  },
  computed: {
    ...mapGetters(['schemas'])
  },
  methods: {
    ...mapGetters(['schemaByNameVersion'])
  }
})
export default class extends Vue {
  tab!: string;
  schema!: Schema | null | undefined;

  schemaByNameVersion: (name: string, version: string) => Schema | undefined =
    this.$store.getters.schemaByNameVersion;

  data (): Data {
    return {
      tab: null,
      schema: null
    };
  }

  created (): void {
    const { name, version } = this.$route.params;
    if (name && version) {
      this.schema = this.schemaByNameVersion(name, version);
    }
  }
}
</script>
