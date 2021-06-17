<template>
  <CredentialForm :schemas="schemas" :schema="schema" @setSchema="setSchema" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import CredentialForm from '../components/credential/CredentialForm.vue';
import { Schema } from '../store/modules/schema';

interface Data {
  tab: string | null;
  schema: Schema | null | undefined;
}

@Component({
  components: {
    CredentialForm
  },
  computed: {
    ...mapGetters(['schemas'])
  },
  methods: {
    ...mapGetters(['schemaByNameVersion'])
  }
})
export default class CredentialView extends Vue {
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
    const { schema_name: name, schema_version: version } = this.$route.query;
    this.setSchema(this.findSchema(name as string, version as string));
  }

  setSchema (schema: Schema | null | undefined): void {
    this.schema = schema;
  }

  private findSchema (name: string, version: string): Schema | null | undefined {
    if (name && version) {
      return this.schemaByNameVersion(name, version);
    }
  }
}
</script>
