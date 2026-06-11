function normalizeBasePath(basePath: string): string {
  const ensuredLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return ensuredLeadingSlash === '/' ? '/' : ensuredLeadingSlash.replace(/\/$/, '');
}

function getConfiguredBasePath(): string {
  return normalizeBasePath(import.meta.env.BASE_URL || '/');
}

function getRuntimePathname(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
}

export function getAppBasePath(): string {
  const configuredBasePath = getConfiguredBasePath();
  if (configuredBasePath !== '/') return configuredBasePath;

  const pathname = getRuntimePathname().replace(/\/+$/, '') || '/';
  if (pathname === '/') return '/';

  const [, firstSegment = ''] = pathname.split('/');
  if (!firstSegment) return '/';

  // If the first segment is one of our app routes, this is a root deployment.
  const rootRouteSegments = new Set(['sign-in', 'sign-up', 'recipes', 'api', 'assets']);
  if (rootRouteSegments.has(firstSegment)) return '/';

  // Otherwise treat the first segment as a dynamic deploy base path (e.g. /kuma-recipes).
  return `/${firstSegment}`;
}

export function getAppRedirectPath(): string {
  return getAppBasePath();
}

export function getSignInPath(): string {
  const basePath = getAppBasePath();
  return basePath === '/' ? '/sign-in' : `${basePath}/sign-in`;
}
