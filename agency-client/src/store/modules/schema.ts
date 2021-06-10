/* eslint-disable camelcase */

import axios from 'axios';
import { ActionContext } from 'vuex';
import { State as RootState } from '@/store/index';

export interface TopicMetadata {
  name: string;
  topic_type: string;
}

export interface AddressMetadata {
  addressee: string;
  civic_address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
}

export interface DateMetadata {
  effective_date: string;
  revoked_date: string;
  other_date_fields: string[];
}

export interface Translation {
  label: string;
  description: string;
}

export interface MetadataTranslation {
  name?: string;
  translations: Record<string, Translation>;
}

export interface Metadata {
  topic: TopicMetadata[];
  cardinality: string[];
  date_fields: DateMetadata
  address_fields: AddressMetadata[];
  search_fields: string[];
  labels: {
    schema: MetadataTranslation;
    attributes: MetadataTranslation[];
  };
}

export interface Schema {
  schema_name: string;
  schema_version: string;
  attributes: string[];
  metadata: Metadata;
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
