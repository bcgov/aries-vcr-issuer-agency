<template>
  <v-card elevation="2">
    <v-card-title>Schemas</v-card-title>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="primary" router-link to="/schema/add">
        Publish Schema
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters(['schemas'])
  }
})
export default class SchemaList extends Vue {}
</script>
