<template>
  <v-menu
    :close-on-content-click="false"
    :close-on-click="false"
    offset-y
    v-model="displayForm"
  >
    <template v-slot:activator="{ on }">
      <v-chip
        v-on="!displayForm && on"
        :close="displayForm"
        close-icon="mdi-close-circle"
        icon="mdi-plus-circle"
        @click:close="cancel"
      >
        <v-icon left size="18px" style="padding-left: 4px" v-if="!displayForm"
          >mdi-plus-circle</v-icon
        >
        <span>Add Description</span>
      </v-chip>
    </template>
    <v-form ref="form">
      <v-card>
        <v-container>
          <p>Localized Description</p>
          <v-row dense>
            <v-col cols="12">
              <v-select
                label="Langauge"
                outlined
                required
                :items="locales"
                :item-text="(locale) => `${locale.label} (${locale.value})`"
                :item-value="(locale) => locale.value"
                v-model="localizedLabel.locale"
                :rules="[
                  () => !!localizedLabel.locale || 'This field is required',
                ]"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Label"
                placeholder="Label"
                outlined
                required
                v-model="localizedLabel.label"
                :rules="[
                  () => !!localizedLabel.label || 'This field is required',
                ]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Description"
                placeholder="Description"
                outlined
                required
                v-model="localizedLabel.description"
                :rules="[
                  () =>
                    !!localizedLabel.description || 'This field is required',
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text @click="cancel">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn text type="submit" @click="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-menu>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

export interface LocalizedLabel {
  locale: string;
  label: string;
  description: string;
}

interface Data {
  displayForm: boolean;
  localizedLabel?: LocalizedLabel;
}

@Component
export default class SchemaLabelForm extends Vue {
  displayForm!: boolean;

  // TODO: Get a full list
  locales = [
    { label: 'English', value: 'en' },
    { label: 'French', value: 'fr' },
    { label: 'Spanish', value: 'sp' },
    { label: 'Italian', value: 'it' }
  ];

  @Prop({ default: () => ({ locale: '', label: '', description: '' }) })
  localizedLabel!: LocalizedLabel;

  data (): Data {
    return {
      displayForm: false
    };
  }

  @Emit('addLabel')
  addLabel (label: LocalizedLabel): LocalizedLabel {
    return label;
  }

  submit (e: Event): void {
    e.preventDefault();
    const isFormValid = (
      this.$refs.form as Vue & { validate: () => boolean }
    ).validate();
    if (isFormValid) {
      this.addLabel({ ...this.localizedLabel });
      this.resetForm();
      this.displayForm = false;
    }
  }

  cancel (): void {
    this.resetForm();
    this.displayForm = false;
  }

  private resetForm (): void {
    (this.$refs.form as Vue & { reset: () => void }).reset();
  }
}
</script>
