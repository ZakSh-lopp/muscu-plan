import { useStorage, STORAGE_KEYS } from './useStorage';

export function useStreak() {
  // history = array de { date: 'YYYY-MM-DD', type, ... }
  const [history] = useStorage(STORAGE_KEYS.WORKOUT_HISTORY, []);

  const doneDates = new Set(
    Array.isArray(history) ? history.map(h => h.date) : []
  );

  // Compte jours consécutifs d'entraînement (dimanche de repos non pénalisant)
  let streak = 0;
  const check = new Date();

  for (let i = 0; i < 60; i++) {
    const key = check.toISOString().split('T')[0];
    const dayOfWeek = check.getDay(); // 0=dim

    if (doneDates.has(key)) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else if (dayOfWeek === 0 && i < 3) {
      // Dimanche de repos tolère sans casser le streak
      check.setDate(check.getDate() - 1);
    } else if (i === 0) {
      // Aujourd'hui pas encore fait — on regarde hier
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }

  function getBadge(n) {
    if (n >= 30) return '🔥🔥🔥';
    if (n >= 14) return '🔥🔥';
    if (n >= 7)  return '🔥';
    if (n >= 3)  return '⚡';
    return null;
  }

  return { streak, badge: getBadge(streak) };
}
