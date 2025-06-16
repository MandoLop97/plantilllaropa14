import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getVapidKey, VAPID_KEY_STORAGE } from '../vapid';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('getVapidKey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches key when not cached', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.functions.invoke as unknown as any).mockResolvedValue({ data: { vapidPublicKey: 'key1' } });
    const key = await getVapidKey();
    expect(key).toBe('key1');
    expect(localStorage.getItem(VAPID_KEY_STORAGE)).toBe('key1');
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
  });

  it('returns cached key without fetching', async () => {
    localStorage.setItem(VAPID_KEY_STORAGE, 'cached');
    const key = await getVapidKey();
    expect(key).toBe('cached');
    expect(supabase.functions.invoke).not.toHaveBeenCalled();
  });
});
