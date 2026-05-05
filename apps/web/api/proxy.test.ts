import type { IncomingMessage } from 'node:http';
import { describe, expect, it } from 'vitest';
import { toFastifyUrl } from './proxy';

function request(url: string): IncomingMessage {
    return {
        url,
        headers: { host: 'example.test' },
    } as IncomingMessage;
}

describe('proxy toFastifyUrl', () => {
    it('forwards non-route query parameters to Fastify', () => {
        expect(
            toFastifyUrl(request('/api/proxy?route=recipes&tag=matcha&tag=dessert'))
        ).toBe('/recipes?tag=matcha&tag=dessert');
    });

    it('does not forward the internal route query parameter', () => {
        expect(toFastifyUrl(request('/api/proxy?route=recipes'))).toBe('/recipes');
    });
});
