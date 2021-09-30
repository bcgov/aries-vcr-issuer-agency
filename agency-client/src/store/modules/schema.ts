/* eslint-disable camelcase */

import axios from 'axios';
import { ActionContext } from 'vuex';
import { State as RootState } from '@/store/index';
import { ISSUER_API_KEY } from './app';
import { AlertType } from './notification';

const ISSUER_SCHEMA_URL = 'issuer/schema';

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
  highlighted_attributes?: string[];
  credential_title?:string;
  date_fields: DateMetadata
  address_fields: AddressMetadata[];
  search_fields: string[];
  labels: {
    schema: MetadataTranslation;
    attributes: MetadataTranslation[];
  };
}

export interface Schema {
  id: number;
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
  schemaByNameVersion: (
    state: State
  ) => (
    name: string, version: string
  ): Schema | undefined => state.schemas
    .find(schema => schema.schema_name === name && schema.schema_version === version),
  schemas: (state: State): Schema[] => state.schemas
};

const actions = {
  async fetchSchemas (
    { dispatch, commit, getters }: ActionContext<State, RootState>
  ): Promise<void> {
    try {
      dispatch('setLoading', true);
      const response = await axios.get(getters.controller.url.toString() + ISSUER_SCHEMA_URL, {
        headers: { [ISSUER_API_KEY]: getters.controller[ISSUER_API_KEY] }
      });
      commit('setSchemas', response.data);
    } catch (error) {
      console.error(error);
      dispatch('notify', { type: AlertType.ERROR, msg: 'There was a problem' });
    } finally {
      dispatch('setLoading', false);
    }
  },
  async addSchema (
    { dispatch, commit, getters }: ActionContext<State, RootState>,
    schema: Schema
  ): Promise<void> {
    try {
      dispatch('setLoading', true);
      const response = await axios.post(getters.controller.url.toString() + ISSUER_SCHEMA_URL, schema, {
        headers: { [ISSUER_API_KEY]: getters.controller[ISSUER_API_KEY] }
      });
      commit('addSchema', { ...schema, ...response.data });
      dispatch('notify', { type: AlertType.SUCCESS, msg: 'Schema successfully published' });
    } catch (error) {
      console.error(error);
      dispatch('notify', { type: AlertType.ERROR, msg: 'There was a problem' });
    } finally {
      dispatch('setLoading', false);
    }
  },
  async updateSchema (
    { dispatch, commit, getters }: ActionContext<State, RootState>,
    schema: Schema
  ): Promise<void> {
    try {
      dispatch('setLoading', true);
      const response = await axios.post(getters.controller.url.toString() + ISSUER_SCHEMA_URL, schema, {
        headers: { [ISSUER_API_KEY]: getters.controller[ISSUER_API_KEY] }
      });
      commit('setSchema', { ...schema, ...response.data });
      dispatch('notify', { type: AlertType.SUCCESS, msg: 'Schema successfully updated' });
    } catch (error) {
      console.error(error);
      dispatch('notify', { type: AlertType.ERROR, msg: 'There was a problem' });
    } finally {
      dispatch('setLoading', false);
    }
  }
};

const mutations = {
  addSchema: (state: State, added: Schema): Schema[] => (state.schemas = [
    ...state.schemas, added
  ]),
  setSchema: (state: State, updated: Schema): Schema[] => {
    const schemas = [...state.schemas];
    schemas.splice(state.schemas
      .findIndex((schema) => schema.schema_name === updated.schema_name && schema.schema_version === updated.schema_version),
    1,
    updated
    );
    return (state.schemas = schemas);
  },
  setSchemas: (state: State, schemas: Schema[]): Schema[] => (state.schemas = schemas)
};

export default {
  state,
  getters,
  actions,
  mutations
};
