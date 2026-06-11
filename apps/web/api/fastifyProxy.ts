import type { IncomingHttpHeaders, IncomingMessage } from 'node:http';

export function normalizeProxyHeaders(
  headers: IncomingHttpHeaders,
  hasPayload: boolean
): Record<string, string> {
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined) continue;

    const lowerKey = key.toLowerCase();
    if (
      !hasPayload &&
      (lowerKey === 'content-length' ||
        lowerKey === 'content-type' ||
        lowerKey === 'transfer-encoding')
    ) {
      continue;
    }

    normalized[key] = Array.isArray(value) ? value.join(',') : value;
  }

  return normalized;
}

export async function readRequestBody(req: IncomingMessage): Promise<Buffer | undefined> {
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
