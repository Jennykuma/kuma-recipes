import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState, type ReactNode } from 'react';
import useIdleLogout from '../hooks/auth/useIdleLogout';

const AuthLoadingScreen = () => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowLoader(true);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <main className="auth-page" role="status" aria-live="polite">
      <div
        className={[
          'flex items-center gap-3 text-sm text-gray-500 transition-opacity duration-200',
          showLoader ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        <span className="h-2 w-2 rounded-full bg-blush-400 animate-pulse" />
        <span className="font-jua">Checking your session</span>
      </div>
    </main>
  );
};

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  useIdleLogout();

  if (!isLoaded) return <AuthLoadingScreen />;

  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  return children;
}
