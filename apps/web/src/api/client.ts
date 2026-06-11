function normalizeBasePath(basePath: string): string {
  const ensuredLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return ensuredLeadingSlash.endsWith('/')
    ? ensuredLeadingSlash.slice(0, -1)
    : ensuredLeadingSlash;
}

function getApiBaseUrl(): string {
  const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configuredApiBase) {
    return configuredApiBase.replace(/\/$/, '');
  }

  const appBasePath = normalizeBasePath(import.meta.env.BASE_URL || '/');
  return `${appBasePath}/api`;
}

const normalizedApiBaseUrl = getApiBaseUrl();

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedApiBaseUrl}${normalizedPath}`;
}
