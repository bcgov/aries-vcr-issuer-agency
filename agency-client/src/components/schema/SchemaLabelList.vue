<template>
  <v-chip-group column class="schema-label-list">
    <SchemaLabelForm @addLabel="addLabel" />
    <v-chip
      v-for="(translation, locale) in labels"
      :key="locale"
      close
      close-icon="mdi-close-circle"
      @click:close="removeLabel(locale)"
    >
      <span>{{ locale }}:&nbsp;{{ translation.label }}</span>
    </v-chip>
  </v-chip-group>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import SchemaLabelForm, { LocalizedLabel } from './SchemLabelForm.vue';

export interface Translation {
  label: string;
  description: string;
}

@Component({
  components: {
    SchemaLabelForm
  }
})
export default class SchemaLabelList extends Vue {
  @Prop({ default: () => ({}) }) labels!: Record<string, Translation>;

  @Emit('addLabel')
  addLabel (label: LocalizedLabel): LocalizedLabel {
    return label;
  }

  @Emit('removeLabel')
  removeLabel (locale: string): string {
    return locale;
  }
}
</script>

<style scoped>
.schema-label-list {
  padding: 4px 0px;
}
</style>
