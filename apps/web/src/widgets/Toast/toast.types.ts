export type ToastStatus = 'success' | 'error' | 'info';

export type ToastItem = {
    id: string;
    status: ToastStatus;
    title?: string;
    message: string;
    duration?: number; // milliseconds
};

export type ShowToastInput = Omit<ToastItem, 'id'>;
