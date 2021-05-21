import { ServiceAddons } from '@feathersjs/feathers';
import { ServiceEventResult } from '../models/event';
import { WebhookData } from '../models/webhooks';

export function sleep<T>(ms: number): Promise<T> {
  return new Promise<T>(resolve => setTimeout(resolve, ms));
}

export function deferServiceOnce<T>(
  id: string,
  service: T & ServiceAddons<T>,
  options?: {
    order?: number,
    cb?: (res: ServiceEventResult) => void,
    timeout?: number,
    rejectOnTimeout?: boolean,
    rejectOnError?: boolean,
  }
): Promise<ServiceEventResult> {
  const processCb = (res: ServiceEventResult): void => {
    if (options?.cb && typeof options?.cb === 'function') {
      options?.cb(res);
    }
  };

  let res: ServiceEventResult = { id, success: true, order: options?.order };
  return new Promise<ServiceEventResult>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      res.success = false;
      res.error = `Timeout received for ID: ${id}`;
      processCb(res);
      if (options?.rejectOnTimeout) {
        return reject(res);
      }
      return resolve(res);
    }, options?.timeout);

    service.once(id, (data: WebhookData) => {
      clearTimeout(timeoutId);
      res = { ...res, data };
      if (data.error_msg) {
        res.success = false;
        res.error = data.error_msg;
      }
      processCb(res);
      if (res.error && options?.rejectOnError) {
        return reject(res);
      }
      return resolve(res);
    });
  });
}