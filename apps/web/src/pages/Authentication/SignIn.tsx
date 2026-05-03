import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
    return (
        <main className="auth-page">
            <div className="auth-shell">
                <SignIn
                    forceRedirectUrl="/kuma-recipes"
                    appearance={{
                        variables: {
                            colorPrimary: '#E97F97',
                            colorText: '#2E2E2E',
                            colorBackground: '#FFFFFF',
                            colorInputBackground: '#FFF7F9',
                            colorInputText: '#2E2E2E',
                        },
                        elements: {
                            card: 'auth-card',
                            headerTitle: 'auth-title',
                            headerSubtitle: 'auth-subtitle',
                            socialButtonsBlockButton: 'auth-social-btn',
                            formButtonPrimary: 'auth-primary-btn',
                            footerActionLink: 'auth-link',
                            identityPreviewEditButton: 'auth-link',
                            formFieldInput: 'auth-input',
                            dividerLine: 'auth-divider-line',
                            dividerText: 'auth-divider-text',
                        },
                    }}
                />
            </div>
        </main>
    );
}
