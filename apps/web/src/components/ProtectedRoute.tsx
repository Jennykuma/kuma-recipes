import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) return null; // or spinner
    if (!isSignedIn) return <Navigate to="/sign-in" replace />;

    return children;
}
