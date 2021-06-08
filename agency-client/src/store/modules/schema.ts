/* eslint-disable camelcase */

import axios from 'axios';
import { ActionContext } from 'vuex';
import { State as RootState } from '@/store/index';

interface SchemaTopic {
  name: string;
  topic_type: string;
}

interface AddressMetadata {
  addressee: string;
  civic_address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
}

interface Translation {
  label: string;
  description: string;
}

interface SchemaAttributeTranslation {
  name: string;
  translations: Record<string, Translation>;
}

interface CredentialMetadata {
  topic: SchemaTopic[];
  cardinality: string[];
  date_fields: {
    effective_date: string;
    revoked_date: string;
    other_date_fields: string[];
  };
  address_fields: AddressMetadata[];
  search_fields: string[];
  labels: {
    schema: Record<string, string>;
    attributes: SchemaAttributeTranslation[];
  };
}

export interface Schema {
  shcema_name: string;
  schema_version: string;
  attributes: string[];
  metadata: CredentialMetadata;
}

export interface State {
  schemas: Schema[];
}

const state = {
  schemas: []
};

const getters = {
  schemas: (state: State): Schema[] => state.schemas
};

const actions = {
  async fetchSchemas ({ commit, getters }: ActionContext<State, RootState>): Promise<void> {
    const response = await axios.get(getters.controller.url.toString() + 'schema');
    commit('setSchemas', response.data);
  }
};

const mutations = {
  setSchemas: (state: State, schemas: Schema[]): Schema[] => (state.schemas = schemas)
};

export default {
  state,
  getters,
  actions,
  mutations
};
