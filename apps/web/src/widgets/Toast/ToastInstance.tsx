import { useEffect, useState } from 'react';
import Toast from './Toast';
import type { ToastItem } from './toast.types';
import classNames from 'classnames';

type ToastInstanceProps = {
    toast: ToastItem;
    onDismiss: () => void;
};

const EXIT_ANIMATION_DURATION = 200; // milliseconds

const ToastInstance = ({ toast, onDismiss }: ToastInstanceProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        let frame1 = 0;
        let frame2 = 0;

        frame1 = window.requestAnimationFrame(() => {
            frame2 = window.requestAnimationFrame(() => {
                setIsVisible(true);
            });
        });

        return () => {
            window.cancelAnimationFrame(frame1);
            window.cancelAnimationFrame(frame2);
        };
    }, []);

    useEffect(() => {
        const visibleMs = toast.duration ?? 3000;

        const leaveTimer = setTimeout(() => {
            setIsLeaving(true);
        }, visibleMs);

        const dismissTimer = setTimeout(() => {
            onDismiss();
        }, visibleMs + EXIT_ANIMATION_DURATION);

        return () => {
            clearTimeout(leaveTimer);
            clearTimeout(dismissTimer);
        };
    }, [toast.duration, onDismiss]);

    return (
        <div
            className={classNames(
                'pointer-events-auto transform transition-all duration-300 ease-out',
                !isVisible && 'translate-y-2 scale-95 opacity-0',
                isVisible && !isLeaving && 'translate-y-0 scale-100 opacity-100',
                isLeaving && 'translate-y-2 scale-95 opacity-0'
            )}
        >
            <Toast status={toast.status} message={toast.message} />
        </div>
    );
};

export default ToastInstance;
