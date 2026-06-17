import { useState, useEffect, useCallback } from 'react';
import { useStorage, STORAGE_KEYS } from './useStorage';

/**
 * Timer de séance — basé sur timestamp absolu.
 * Survit à : fermeture app, extinction écran, changement d'onglet.
 */
export function useSessionTimer() {
  const [startTs, setStartTs] = useStorage(STORAGE_KEYS.SESSION_START_TS, null);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(!!startTs);

  useEffect(() => {
    if (!startTs) { setElapsed(0); return; }
    const tick = () => setElapsed(Math.floor((Date.now() - startTs) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTs]);

  const start = useCallback(() => {
    const now = Date.now();
    setStartTs(now);
    setRunning(true);
  }, [setStartTs]);

  const stop = useCallback(() => {
    setStartTs(null);
    setRunning(false);
    setElapsed(0);
  }, [setStartTs]);

  const format = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return { elapsed, running, start, stop, formatted: format(elapsed) };
}

/**
 * Timer de repos entre séries — basé sur timestamp absolu.
 * Déclenché à chaque coche de série, survit au changement d'onglet.
 */
export function useRestTimer() {
  const [endTs, setEndTs] = useStorage(STORAGE_KEYS.REST_TIMER_END, null);
  const [remaining, setRemaining] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!endTs) { setRemaining(0); setActive(false); return; }
    const tick = () => {
      const rem = Math.max(0, Math.ceil((endTs - Date.now()) / 1000));
      setRemaining(rem);
      setActive(rem > 0);
      if (rem === 0) setEndTs(null);
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [endTs, setEndTs]);

  const startRest = useCallback((durationSecs = 90) => {
    setEndTs(Date.now() + durationSecs * 1000);
  }, [setEndTs]);

  const skipRest = useCallback(() => {
    setEndTs(null);
    setRemaining(0);
    setActive(false);
  }, [setEndTs]);

  const format = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return { remaining, active, startRest, skipRest, formatted: format(remaining) };
}
