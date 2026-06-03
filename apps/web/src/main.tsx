import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from './widgets/Toast/ToastProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './routes.tsx';
import { getAppRedirectPath, getSignInPath } from './utils/basePath';
import './index.css';
import './App.css';

const queryClient = new QueryClient();
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
    | string
    | undefined;
const appRedirectPath = getAppRedirectPath();
const signInPath = getSignInPath();
const signUpPath = signInPath.replace(/sign-in$/, 'sign-up');

if (!clerkPublishableKey) {
    throw new Error(
        'Missing VITE_CLERK_PUBLISHABLE_KEY. Add it to apps/web/.env (or your deployment env).'
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ClerkProvider
            publishableKey={clerkPublishableKey}
            signInUrl={signInPath}
            signUpUrl={signUpPath}
            signInForceRedirectUrl={appRedirectPath}
            signUpForceRedirectUrl={appRedirectPath}
            signInFallbackRedirectUrl={appRedirectPath}
            signUpFallbackRedirectUrl={appRedirectPath}
        >
            <ToastProvider>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                </QueryClientProvider>
            </ToastProvider>
        </ClerkProvider>
    </StrictMode>
);
