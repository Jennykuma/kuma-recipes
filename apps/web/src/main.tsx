import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './routes.tsx';
import './index.css';
import './App.css';

const queryClient = new QueryClient();
const clerkPublishableKey: string = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const signInUrl: string = import.meta.env.VITE_CLERK_SIGN_IN_URL;
const signUpUrl: string = import.meta.env.VITE_CLERK_SIGN_UP_URL;
const signInForceRedirectUrl: string = import.meta.env
    .VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL;
const signUpForceRedirectUrl: string = import.meta.env
    .VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL;

if (!clerkPublishableKey) {
    throw new Error(
        'Missing VITE_CLERK_PUBLISHABLE_KEY. Add it to apps/web/.env (or your deployment env).'
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ClerkProvider
            publishableKey={clerkPublishableKey}
            signInUrl={signInUrl}
            signUpUrl={signUpUrl}
            signInForceRedirectUrl={signInForceRedirectUrl}
            signUpForceRedirectUrl={signUpForceRedirectUrl}
        >
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
            </QueryClientProvider>
        </ClerkProvider>
    </StrictMode>
);
