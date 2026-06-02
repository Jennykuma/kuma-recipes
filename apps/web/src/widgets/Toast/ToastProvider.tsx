import {
    createContext,
    useCallback,
    useMemo,
    useState,
    type PropsWithChildren,
} from 'react';
import ToastViewport from './ToastViewport';
import { type ShowToastInput, type ToastItem } from './toast.types';

type ToastContextValue = {
    showToast: (toast: ShowToastInput) => string;
    dismissToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: PropsWithChildren) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((toast: ShowToastInput) => {
        const id = crypto.randomUUID();
        const toastItem: ToastItem = { ...toast, id };
        setToasts((prev) => [...prev, toastItem]);
        return id;
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const value = useMemo(
        () => ({
            showToast,
            dismissToast,
        }),
        [showToast, dismissToast]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastViewport toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    );
};
