import ToastInstance from './ToastInstance';
import { type ToastItem } from './toast.types';

type ToastViewportProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

const ToastViewport = ({ toasts, onDismiss }: ToastViewportProps) => {
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastInstance
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastViewport;
