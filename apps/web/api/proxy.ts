import type { IncomingMessage, ServerResponse } from 'node:http';
import { buildApp } from '../../api/src/app.js';
import { normalizeProxyHeaders, readRequestBody } from './fastifyProxy.js';

let appPromise: ReturnType<typeof initApp> | null = null;

async function initApp() {
  const app = await buildApp();
  await app.ready();
  return app;
}

function getApp() {
  if (!appPromise) {
    appPromise = initApp();
  }

  return appPromise;
}

export function toFastifyUrl(req: IncomingMessage): string {
  const origin = `https://${req.headers.host || 'localhost'}`;
  const url = new URL(req.url || '/', origin);
  const route = (url.searchParams.get('route') || '').replace(/^\/+/, '');
  const path = `/${route}`;
  url.searchParams.delete('route');

  const queryString = url.searchParams.toString();
  return `${path === '/' ? '/' : path}${queryString ? `?${queryString}` : ''}`;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await getApp();
  const payload = await readRequestBody(req);
  const response = await app.inject({
    method: req.method || 'GET',
    url: toFastifyUrl(req),
    headers: normalizeProxyHeaders(req.headers, payload !== undefined),
    payload,
  });

  res.statusCode = response.statusCode;

  for (const [key, value] of Object.entries(response.headers)) {
    if (typeof value === 'string' || typeof value === 'number' || Array.isArray(value)) {
      res.setHeader(key, value);
    }
  }

  res.end(response.body);
}
