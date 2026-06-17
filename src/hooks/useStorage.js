import { useState, useCallback } from 'react';

/**
 * Hook générique localStorage avec serialisation JSON automatique.
 * Remplace tous les accès directs localStorage éparpillés dans l'app.
 */
export function useStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const set = useCallback((newValue) => {
    setValue(prev => {
      const next = typeof newValue === 'function' ? newValue(prev) : newValue;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch (e) {
        console.warn('localStorage full:', e);
      }
      return next;
    });
  }, [key]);

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setValue(defaultValue);
  }, [key, defaultValue]);

  return [value, set, remove];
}

/** Clés localStorage centralisées — évite les fautes de frappe */
export const STORAGE_KEYS = {
  // Séance en cours
  SESSION_STATE: 'muscu_session_v2',
  SESSION_START_TS: 'muscu_session_start_ts',
  REST_TIMER_END: 'muscu_rest_end_ts',

  // Historique & progression
  WORKOUT_HISTORY: 'muscu_history_v2',
  WEIGHT_RECORDS: 'muscu_weight_records',
  BODY_MEASUREMENTS: 'muscu_measurements',

  // Suppléments & nutrition
  SUPPLEMENTS_TODAY: 'muscu_supps',
  NUTRITION_LOG: 'muscu_nutrition_log',
  MASS_GAINER_DOSES: 'muscu_mass_doses',

  // Courses
  GROCERY_CHECKED: 'muscu_grocery',

  // Photos & progrès
  PROGRESS_PHOTOS: 'muscu_photos',

  // Préférences
  DARK_MODE: 'muscu_dark_mode',
  NOTIFICATIONS_SETUP: 'muscu_notifs_setup',
  HYDRATION_TODAY: 'muscu_hydration',
  STREAK: 'muscu_streak',
};
