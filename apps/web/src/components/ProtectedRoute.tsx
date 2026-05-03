import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import type { ReactNode } from 'react';
import useIdleLogout from '../hooks/auth/useIdleLogout';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isLoaded, isSignedIn } = useAuth();
    useIdleLogout();

    if (!isLoaded) {
        return (
            <main className="min-h-screen grid place-items-center p-6">
                <p className="font-jua text-gray-600">Loading authentication...</p>
            </main>
        );
    }

    if (!isSignedIn) return <Navigate to="/sign-in" replace />;

    return children;
}
