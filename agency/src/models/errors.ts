import { FeathersError } from '@feathersjs/errors';

export class UndefinedAppError extends Error {}

export class DuplicatedProfileError extends Error {}

export class AriesAgentError extends FeathersError {
  constructor(message: string | Error, code: number | undefined, data?: unknown) {
    super(message, 'aries-agent-error', code || 500, 'AriesAgentError', data);
  }
}

export class CredDefError extends FeathersError {
  constructor(message: string | Error, data?: unknown) {
    super(message, 'cred-def-error', 500, 'CredDefError', data);
  }
}

export class EndorserError extends FeathersError {
  constructor(message: string | Error, data?: unknown) {
    super(message, 'endorser-error', 500, 'EndorserError', data);
  }
}

export class SchemaError extends FeathersError {
  constructor(message: string | Error, data?: unknown) {
    super(message, 'schema-error', 500, 'SchemaError', data);
  }
}
