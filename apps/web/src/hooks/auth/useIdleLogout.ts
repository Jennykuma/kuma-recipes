import { useAuth, useClerk } from '@clerk/clerk-react';
import { useEffect, useMemo } from 'react';

const DEFAULT_IDLE_MINUTES = 60 * 24 * 7; // 7 days
const ACTIVITY_STORAGE_PREFIX = 'kuma:last-activity:';

function getIdleTimeoutMs(): number {
    const configured = Number(import.meta.env.VITE_IDLE_LOGOUT_MINUTES);
    const minutes =
        Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_IDLE_MINUTES;
    return minutes * 60 * 1000;
}

function getBasePath(): string {
    const base = import.meta.env.BASE_URL || '/';
    return base === '/' ? '/' : base.replace(/\/$/, '');
}

export default function useIdleLogout() {
    const { isLoaded, isSignedIn, userId } = useAuth();
    const clerk = useClerk();
    const idleTimeoutMs = useMemo(() => getIdleTimeoutMs(), []);
    const signInPath = useMemo(() => {
        const basePath = getBasePath();
        return basePath === '/' ? '/sign-in' : `${basePath}/sign-in`;
    }, []);

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !userId) return;

        const storageKey = `${ACTIVITY_STORAGE_PREFIX}${userId}`;
        let signingOut = false;
        let lastWrite = 0;

        const updateActivity = () => {
            const now = Date.now();
            if (now - lastWrite < 10_000) return;

            localStorage.setItem(storageKey, String(now));
            lastWrite = now;
        };

        const signOutIfIdle = async () => {
            if (signingOut) return;

            const lastActivityRaw = localStorage.getItem(storageKey);
            const lastActivity = lastActivityRaw ? Number(lastActivityRaw) : Date.now();
            const now = Date.now();

            if (now - lastActivity >= idleTimeoutMs) {
                signingOut = true;
                await clerk.signOut({ redirectUrl: signInPath });
            }
        };

        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                void signOutIfIdle();
            }
        };
        const onFocus = () => {
            void signOutIfIdle();
        };

        void signOutIfIdle();
        updateActivity();

        const events: Array<keyof WindowEventMap> = [
            'mousemove',
            'mousedown',
            'keydown',
            'scroll',
            'touchstart',
        ];

        for (const eventName of events) {
            window.addEventListener(eventName, updateActivity, { passive: true });
        }
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisibilityChange);

        const interval = window.setInterval(() => {
            void signOutIfIdle();
        }, 60_000);

        return () => {
            window.clearInterval(interval);
            for (const eventName of events) {
                window.removeEventListener(eventName, updateActivity);
            }
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [clerk, idleTimeoutMs, isLoaded, isSignedIn, signInPath, userId]);
}
