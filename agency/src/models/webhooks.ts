import { CredState_2_0, EndorserState } from './enums';

export interface WebhookData {
    _id?: string;
    cred_ex_id?: string;
    state?: CredState_2_0 | EndorserState;
    thread_id?: string;
    messages_attach?: any[];
    error_msg?: string;
}