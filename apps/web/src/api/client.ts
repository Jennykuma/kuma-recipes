function getApiBaseUrl(): string {
    const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.trim();
    if (configuredApiBase) {
        return configuredApiBase.replace(/\/$/, '');
    }

    return '/api';
}

const normalizedApiBaseUrl = getApiBaseUrl();

export function buildApiUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedApiBaseUrl}${normalizedPath}`;
}
