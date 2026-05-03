function normalizeBasePath(basePath: string): string {
    const ensuredLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`;
    return ensuredLeadingSlash.endsWith('/')
        ? ensuredLeadingSlash.slice(0, -1)
        : ensuredLeadingSlash;
}

function getProductionFallbackApiBase(): string | null {
    if (!import.meta.env.PROD) return null;

    const host = window.location.hostname.toLowerCase();
    if (host === 'www.jennyle.dev' || host === 'jennyle.dev') {
        return 'https://kuma-recipes-web.vercel.app/kuma-recipes/api';
    }

    return null;
}

function getApiBaseUrl(): string {
    const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.trim();
    if (configuredApiBase) {
        return configuredApiBase.replace(/\/$/, '');
    }

    const productionFallback = getProductionFallbackApiBase();
    if (productionFallback) {
        return productionFallback;
    }

    const appBasePath = normalizeBasePath(import.meta.env.BASE_URL || '/');
    return `${appBasePath}/api`;
}

const normalizedApiBaseUrl = getApiBaseUrl();

export function buildApiUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedApiBaseUrl}${normalizedPath}`;
}
