<template>
  <v-snackbar v-model="display" :color="alert.type" @input="onInput">
    {{ alert.msg }}
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="onClick">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapActions } from 'vuex';
import { Alert } from '../../store/modules/alert';

@Component({
  methods: {
    ...mapActions(['removeAlert'])
  }
})
export default class AppSnackbar extends Vue {
  display!: boolean;

  @Prop({ default: null }) alert!: Alert;

  removeAlert!: (alert: Alert) => void;

  data (): { display: boolean } {
    return {
      display: !!this.alert || false
    };
  }

  @Watch('display')
  onDisplay (display: boolean): void {
    if (!display) {
      this.removeAlert(this.alert);
    }
  }

  onInput (display: boolean): void {
    this.display = display;
  }

  onClick (): void {
    this.display = false;
  }
}
</script>
