<template>
  <div>
    <p>Address</p>
    <v-row dense>
      <v-col cols="12" md="12">
        <v-select
          label="Country"
          outlined
          dense
          required
          v-model="address.country"
          :rules="[() => !!address.country || 'This field is required']"
        ></v-select>
      </v-col>
      <v-col cols="12" md="12">
        <v-text-field
          label="Addresee"
          outlined
          dense
          required
          v-model="address.addressee"
          :rules="[() => !!address.addressee || 'This field is required']"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="12">
        <v-text-field
          label="Civic Address"
          outlined
          dense
          required
          v-model="address.civic_address"
          :rules="[() => !!address.civic_address || 'This field is required']"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="State/Province"
          outlined
          dense
          required
          v-model="address.province"
          :rules="[() => !!address.province || 'This field is required']"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="City"
          outlined
          dense
          required
          v-model="address.city"
          :rules="[() => !!address.city || 'This field is required']"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="Postal/Zip Code"
          outlined
          dense
          required
          v-model="address.postal_code"
          :rules="[() => !!address.postal_code || 'This field is required']"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AddressMetadata as Address } from '../../store/modules/schema';

@Component
export default class SchemaAttributeAddressInput extends Vue {
  @Prop({
    default: () => ({
      addressee: '',
      civic_address: '',
      city: '',
      province: '',
      postal_code: '',
      country: ''
    })
  })
  address!: Address;
}
</script>
