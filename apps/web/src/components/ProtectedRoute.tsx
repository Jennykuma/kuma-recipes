import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState, type ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isLoaded, isSignedIn } = useAuth();
    const [isStuckLoading, setIsStuckLoading] = useState(false);

    useEffect(() => {
        if (isLoaded) return;

        const timeout = window.setTimeout(() => {
            setIsStuckLoading(true);
        }, 8000);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [isLoaded]);

    if (!isLoaded && !isStuckLoading) {
        return (
            <main className="min-h-screen grid place-items-center p-6">
                <p className="font-jua text-gray-600">Loading authentication...</p>
            </main>
        );
    }

    if (!isLoaded && isStuckLoading) {
        return (
            <main className="min-h-screen grid place-items-center p-6">
                <div className="max-w-xl rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
                    Authentication did not initialize. Check the Clerk domain and allowed origins for
                    this deployment.
                </div>
            </main>
        );
    }

    if (!isSignedIn) return <Navigate to="/sign-in" replace />;

    return children;
}
