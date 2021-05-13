export function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function deferServiceOnce(
  id: string,
  service: any,
  order?: number
): Promise<{ id: string, success: boolean, data: any | undefined, order: number | undefined }> {
  return new Promise((resolve) =>
    service.once(id, (data?: any) => {
      resolve({ id, success: true, data, order });
    })
  );
}