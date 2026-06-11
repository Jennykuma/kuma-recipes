import type { IncomingMessage, ServerResponse } from 'node:http';
import { buildApp } from '../../api/src/app.js';
import { normalizeProxyHeaders, readRequestBody } from './fastifyProxy.js';

let appPromise: ReturnType<typeof initApp> | null = null;

async function initApp() {
  const app = buildApp();
  await app.ready();
  return app;
}

function getApp() {
  if (!appPromise) {
    appPromise = initApp();
  }

  return appPromise;
}

function toFastifyUrl(req: IncomingMessage): string {
  const requestUrl = req.url || '/';
  const withoutBasePath = requestUrl.replace(/^\/kuma-recipes(?=\/|$)/, '');
  return withoutBasePath.replace(/^\/api(?=\/|$)/, '') || '/';
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
