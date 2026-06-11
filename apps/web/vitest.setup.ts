import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// Ensure requestAnimationFrame exists for components that schedule focus/blur work.
if (!globalThis.requestAnimationFrame) {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) =>
    window.setTimeout(() => cb(performance.now()), 0);
}

if (!globalThis.cancelAnimationFrame) {
  globalThis.cancelAnimationFrame = (id: number) => window.clearTimeout(id);
}

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
