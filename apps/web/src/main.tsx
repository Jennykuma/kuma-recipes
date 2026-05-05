import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './routes.tsx';
import './index.css';
import './App.css';

const queryClient = new QueryClient();
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
    | string
    | undefined;

if (!clerkPublishableKey) {
    throw new Error(
        'Missing VITE_CLERK_PUBLISHABLE_KEY. Add it to apps/web/.env (or your deployment env).'
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ClerkProvider publishableKey={clerkPublishableKey}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
            </QueryClientProvider>
        </ClerkProvider>
    </StrictMode>
);
