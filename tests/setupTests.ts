import '@testing-library/jest-dom';
import { vi } from 'vitest';

// --- Mock Next.js useRouter globally ---
vi.mock('next/navigation', async () => {
  const actual: any = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
    })),
  };
});

// --- Mock useAuth globally ---
vi.mock('@/features/hooks/multi-step-form/useAuth', () => {
  return {
    useAuth: vi.fn(),
  };
});

// --- Optional: Provide fetch globally if any component uses it ---
(global as any).fetch = vi.fn();
