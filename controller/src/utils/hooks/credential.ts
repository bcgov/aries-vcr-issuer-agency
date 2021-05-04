import { HookContext, Paginated, Service } from '@feathersjs/feathers';

export async function preProcessCredentials(context: HookContext): Promise<HookContext<any, Service<any>>> {
  context.params.credentials = { pending: [], results: [] };
  return context;
}

export async function postProcessCredentials(context: HookContext): Promise<HookContext<any, Service<any>>> {
  const params = context.params;
  params.credentials.results
    .sort((a: any, b: any) => a.order - b.order)
    .forEach((result: any, idx: number, self: any[]) => {
      self[idx] = {
        cred_ex_id: result?.credExId,
        success: result.success,
        error: result?.error?.message
      };
    });
  if (params.credentials.results.length === 1) {
    params.credentials.results = params.credentials.results[0];
  }
  context.result = params.credentials.results;
  return context;
}