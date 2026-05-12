import { SignUp } from '@clerk/clerk-react';
import { getAppRedirectPath } from '../../utils/basePath';

export default function SignUpPage() {
    const redirectPath = getAppRedirectPath();

    return (
        <main className="auth-page">
            <div className="auth-shell">
                <SignUp
                    forceRedirectUrl={redirectPath}
                    fallbackRedirectUrl={redirectPath}
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
