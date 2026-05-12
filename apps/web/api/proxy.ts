import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'node:http';
import { buildApp } from '../../api/src/app.js';

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

function normalizeHeaders(headers: IncomingHttpHeaders): Record<string, string> {
    const normalized: Record<string, string> = {};

    for (const [key, value] of Object.entries(headers)) {
        if (value === undefined) continue;
        normalized[key] = Array.isArray(value) ? value.join(',') : value;
    }

    return normalized;
}

async function readRequestBody(req: IncomingMessage): Promise<Buffer | undefined> {
    if (req.method === 'GET' || req.method === 'HEAD') {
        return undefined;
    }

    const chunks: Buffer[] = [];

    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }

    if (chunks.length === 0) {
        return undefined;
    }

    return Buffer.concat(chunks);
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
    const response = await app.inject({
        method: req.method || 'GET',
        url: toFastifyUrl(req),
        headers: normalizeHeaders(req.headers),
        payload: await readRequestBody(req),
    });

    res.statusCode = response.statusCode;

    for (const [key, value] of Object.entries(response.headers)) {
        if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            Array.isArray(value)
        ) {
            res.setHeader(key, value);
        }
    }

    res.end(response.body);
}
