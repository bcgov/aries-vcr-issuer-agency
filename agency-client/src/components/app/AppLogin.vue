<template>
  <v-form ref="form">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title></v-card-title>
            <v-container>
              <v-text-field
                label="API Key"
                outlined
                v-model="key"
                :rules="[() => !!key || 'This field is required']"
              ></v-text-field>
            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn text block color="primary" type="submit" @click="login"
                >Login</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapActions } from 'vuex';

@Component({
  methods: {
    ...mapActions(['authenticate'])
  }
})
export default class AppLogin extends Vue {
  key!: string;

  authenticate!: (key: string) => void;

  data (): { key: string } {
    return {
      key: ''
    };
  }

  login (e: Event): void {
    e.preventDefault();
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      this.authenticate(this.key);
    }
  }
}
</script>
