import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setupTests.ts',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov'],
    }
  }
});
