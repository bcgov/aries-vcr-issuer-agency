export interface ServiceEventResult {
    id: string;
    success: boolean;
    data?: any;
    order?: number;
    error?: string;
}