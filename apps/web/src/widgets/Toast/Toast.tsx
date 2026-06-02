import { CircleCheck, CircleX, Info } from 'lucide-react';
import type { ToastStatus } from './toast.types';

type ToastProps = {
    message: string;
    status: ToastStatus;
};

const Toast = (props: ToastProps) => {
    const { message, status } = props;

    const successToast = (
        <div
            role="status"
            className="
                pointer-events-none
                flex items-center gap-3 rounded-md bg-white px-6 py-4
                border border-green-200
            "
        >
            <CircleCheck className="h-5 w-5 text-green-500" />
            <div>
                <span className="text-sm text-green-700 font-medium">Success</span>
                <p className="text-xs text-gray-500">{message}</p>
            </div>
        </div>
    );

    const errorToast = (
        <div
            role="alert"
            className="
                pointer-events-none
                flex items-center gap-3 rounded-md bg-white
                px-6 py-4 border border-red-200"
        >
            <CircleX className="h-5 w-5 text-red-500" />
            <div>
                <span className="text-sm text-red-700 font-medium">Error</span>
                <p className="text-xs text-gray-500">{message}</p>
            </div>
        </div>
    );

    const infoToast = (
        <div
            role="status"
            className="
                pointer-events-none
                flex items-center gap-3 rounded-md bg-white px-6 py-4
                border border-gray-200
            "
        >
            <Info className="h-5 w-5 text-gray-500" />
            <div>
                <span className="text-sm text-gray-700 font-medium">Info</span>
                <p className="text-xs text-gray-500">{message}</p>
            </div>
        </div>
    );

    return status === 'success'
        ? successToast
        : status === 'error'
          ? errorToast
          : infoToast;
};

export default Toast;
