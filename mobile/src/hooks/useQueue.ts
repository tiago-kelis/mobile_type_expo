import { useState, useEffect, useRef, useCallback } from 'react';
import { Appointment, getQueueByDate } from '../api/appointments';

const getLocalDateString = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

interface UseQueueOptions {
  pollingInterval?: number; // ms — padrão 15s
  date?:            string;
}

interface UseQueueReturn {
  queue:    Appointment[];
  loading:  boolean;
  error:    string | null;
  refresh:  () => Promise<void>;
}

export function useQueue({
  pollingInterval = 15000,
  date,
}: UseQueueOptions = {}): UseQueueReturn {
  const [queue, setQueue]     = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const timerRef              = useRef<ReturnType<typeof setInterval> | null>(null);

  const targetDate = date || getLocalDateString();

  const fetch = useCallback(async () => {
    try {
      setError(null);
      const data = await getQueueByDate(targetDate);
      setQueue(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [targetDate]);

  // polling
  useEffect(() => {
    fetch();
    timerRef.current = setInterval(fetch, pollingInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetch, pollingInterval]);

  return { queue, loading, error, refresh: fetch };
}