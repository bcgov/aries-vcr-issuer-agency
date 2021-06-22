<template>
  <div>
    <v-container v-if="profile && profile.complete">
      <SchemaList :schemas="schemas" />
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import SchemaList from '../components/schema/SchemaList.vue';

@Component({
  name: 'Dashboard',
  components: {
    SchemaList
  },
  computed: {
    ...mapGetters(['profile', 'schemas'])
  }
})
export default class Dashboard extends Vue {}
</script>
