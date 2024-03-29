<template>
  <v-form ref="form" :disabled="loading">
    <v-container>
      <v-card>
        <v-card-title>Issuer Profile</v-card-title>
        <v-container>
          <v-row dense>
            <v-col cols="12" md="12">
              <v-text-field
                label="Name"
                outlined
                required
                v-model="profile.name"
                :rules="[() => !!profile.name || 'This field is required']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                label="Abbreviation"
                outlined
                required
                v-model="profile.abbreviation"
                :rules="[
                  () => !!profile.abbreviation || 'This field is required',
                ]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                label="Email"
                outlined
                required
                v-model="profile.email"
                :rules="[() => !!profile.email || 'This field is required']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                label="Logo"
                outlined
                hint="https://www.example.com/image.png"
                persistent-hint
                v-model="profile.logo"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                label="Url"
                outlined
                hint="www.example.com/page"
                persistent-hint
                v-model="profile.url"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text router-link to="/">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            type="submit"
            @click="submit"
            :disabled="loading"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import router from '../../router';
import { IssuerProfile } from '../../store/modules/app';

@Component({
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    ...mapActions(['setLoading', 'updateProfile'])
  }
})
export default class ProfileForm extends Vue {
  @Prop() profile!: IssuerProfile;

  setLoading!: (loading: boolean) => void;
  updateProfile!: (profile: IssuerProfile) => void;

  async submit (e: Event): Promise<void> {
    e.preventDefault();
    const isFormValid = (
      this.$refs.form as Vue & { validate: () => boolean }
    ).validate();
    if (isFormValid) {
      this.setLoading(true);
      await this.updateProfile(this.profile);
      router.push('/');
      this.setLoading(false);
    }
  }
}
</script>
