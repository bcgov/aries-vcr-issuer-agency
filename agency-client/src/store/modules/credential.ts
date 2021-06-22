/* eslint-disable camelcase */

import axios, { AxiosResponse } from 'axios';
import { ActionContext } from 'vuex';
import { State as RootState } from '@/store/index';
import { ISSUER_API_KEY } from './app';
import { AlertType } from './notification';

const ISSUER_CREDENTIAL_URL = 'issuer/credential';

export interface Credential {
  schema_name: string;
  schema_version: string;
  attributes: Record<string, string>;
}

interface CredentialResult {
  success: boolean;
  cred_ex_id?: string;
  error?: string;
}

const actions = {
  async issueCredential (
    { dispatch, getters }: ActionContext<unknown, RootState>,
    credential: Credential | Credential[]
  ): Promise<void> {
    try {
      dispatch('setLoading', true);
      const result: AxiosResponse<CredentialResult | CredentialResult[]> =
        await axios.post(getters.controller.url.toString() + ISSUER_CREDENTIAL_URL, credential, {
          headers: { [ISSUER_API_KEY]: getters.controller[ISSUER_API_KEY] }
        });
      let successful = [];
      let errors = [];
      if (result.data) {
        if (Array.isArray(result.data)) {
          errors = result.data.filter((datum) => !datum.success);
          successful = result.data.filter((datum) => datum.success);
        } else if (!result.data.success) {
          errors.push(result.data);
        }
      }
      if (!errors.length) {
        dispatch('notify', { type: AlertType.SUCCESS, msg: 'Credentials successfully issued' });
      } else if (!successful.length) {
        dispatch('notify', { type: AlertType.ERROR, msg: 'There was a problem' });
      } else {
        dispatch('notify', { type: AlertType.INFO, msg: 'Some credentials could not be issued' });
      }
    } catch (error) {
      console.error(error);
      dispatch('notify', { type: AlertType.ERROR, msg: 'There was a problem' });
    } finally {
      dispatch('setLoading', false);
    }
  }
};

export default {
  actions
};
