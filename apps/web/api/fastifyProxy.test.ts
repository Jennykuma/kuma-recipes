import { describe, expect, it } from 'vitest';
import { normalizeProxyHeaders } from './fastifyProxy';

describe('normalizeProxyHeaders', () => {
  it('drops body headers when there is no payload', () => {
    expect(
      normalizeProxyHeaders(
        {
          authorization: 'Bearer test-token',
          'content-length': '9',
          'content-type': 'application/json',
          'transfer-encoding': 'chunked',
        },
        false
      )
    ).toEqual({
      authorization: 'Bearer test-token',
    });
  });

  it('preserves body headers when a payload is present', () => {
    expect(
      normalizeProxyHeaders(
        {
          authorization: 'Bearer test-token',
          'content-length': '9',
          'content-type': 'application/json',
        },
        true
      )
    ).toEqual({
      authorization: 'Bearer test-token',
      'content-length': '9',
      'content-type': 'application/json',
    });
  });
});
