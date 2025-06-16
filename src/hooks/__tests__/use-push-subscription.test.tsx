import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePushSubscription } from '../use-push-subscription';
import React from 'react';

// polyfill atob for Node environment
// eslint-disable-next-line no-undef
(global as any).atob = (b: string) => Buffer.from(b, 'base64').toString('binary');

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock('@/lib/logger', () => ({
  logger: { log: vi.fn(), error: vi.fn() },
}));

let notificationsState = { isGranted: true, isSupported: true };
vi.mock('../use-notifications', () => ({
  useNotifications: () => notificationsState,
}));

vi.mock('@/utils/vapid', () => ({
  getVapidKey: vi.fn(() => 'dGVzdA=='),
}));

vi.mock('@/lib/supabase', () => {
  const single = vi.fn().mockResolvedValue({ data: null, error: null });
  const eqSelect = vi.fn(() => ({ single }));
  const select = vi.fn(() => ({ eq: eqSelect }));
  const eqUpdate = vi.fn().mockResolvedValue({ data: {}, error: null });
  const update = vi.fn(() => ({ eq: eqUpdate }));
  const from = vi.fn(() => ({ select, update }));
  return { supabase: { from } };
});

describe('subscribeToPush', () => {
  it('uses getRegistration before ready', async () => {
    const mockSubscription = { toJSON: vi.fn(() => ({ endpoint: 'e' })) } as any;
    const pushManager = {
      getSubscription: vi.fn().mockResolvedValue(null),
      subscribe: vi.fn().mockResolvedValue(mockSubscription),
    };
    const registration = { pushManager } as unknown as ServiceWorkerRegistration;
    const getReg = vi.fn().mockResolvedValue(registration);
    const readySpy = vi.fn(() => Promise.resolve(registration));
    Object.defineProperty(global.navigator, 'serviceWorker', {
      configurable: true,
      value: {
        getRegistration: getReg,
        get ready() { return readySpy(); },
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });

    const { result } = renderHook(() => usePushSubscription('u1'));
    await act(async () => {
      await result.current.subscribeToPush();
    });

    expect(getReg).toHaveBeenCalled();
    expect(readySpy).toHaveBeenCalledTimes(1); // called in effect only
    expect(pushManager.subscribe).toHaveBeenCalled();
    expect(result.current.isSubscribed).toBe(true);
  });
});
