import { ServiceAddons } from '@feathersjs/feathers';

export function sleep<T>(ms: number): Promise<T> {
  return new Promise<T>(resolve => setTimeout(resolve, ms));
}

export function deferServiceOnce<T>(
  id: string,
  service: T & ServiceAddons<T>,
  order?: number
): Promise<{ id: string, success: boolean, data: any | undefined, order: number | undefined }> {
  return new Promise(resolve => service.once(id, (data?: any) => {
    resolve({ id, success: true, data, order });
  }));
}