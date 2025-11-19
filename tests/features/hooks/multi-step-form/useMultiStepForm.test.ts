import { renderHook, act } from '@testing-library/react';
import { useMultiStepForm } from '../../../../features/hooks/multi-step-form/useMultiStepForm';
import { FormStep } from '../../../../features/hooks/multi-step-form/types';

interface FormData {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  attachments?: File[];
}

describe('useMultiStepForm', () => {
  const initialData: FormData = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    attachments: [],
  };

  beforeEach(() => localStorage.clear());

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useMultiStepForm<FormData>(initialData),
    );
    expect(result.current.step).toBe(FormStep.Personal);
    expect(result.current.data).toEqual(initialData);
  });

  it('should navigate next and back correctly', () => {
    const { result } = renderHook(() =>
      useMultiStepForm<FormData>(initialData),
    );

    act(() => result.current.next());
    expect(result.current.step).toBe(FormStep.Contact);

    act(() => result.current.back());
    expect(result.current.step).toBe(FormStep.Personal);
  });

  it('should update data correctly', () => {
    const { result } = renderHook(() =>
      useMultiStepForm<FormData>(initialData),
    );

    act(() => result.current.setData({ fullName: 'Alice' }));
    expect(result.current.data.fullName).toBe('Alice');
  });

  it('should reset data', () => {
    const { result } = renderHook(() =>
      useMultiStepForm<FormData>(initialData),
    );

    act(() => {
      result.current.setData({ fullName: 'Bob' });
      result.current.goTo(FormStep.Review);
    });
    expect(result.current.data.fullName).toBe('Bob');
    expect(result.current.step).toBe(FormStep.Review);

    act(() => {
      result.current.reset?.();
    });

    expect(result.current.data).toEqual(initialData);
    expect(result.current.step).toBe(FormStep.Personal);
  });
});
