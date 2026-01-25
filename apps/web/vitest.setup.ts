import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
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
