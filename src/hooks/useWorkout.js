import { useCallback, useEffect } from 'react';
import { useStorage, STORAGE_KEYS } from './useStorage';
import { PROGRAM_START, DAY_TYPES } from '../data/workout';

const STARTING_WEIGHTS = {
  squat: 60, bench_press: 50, barbell_row: 50, hip_thrust: 60,
  ohp_a: 12, curl_bar_a: 20, leg_press_b: 80, incline_press_b: 30,
  pulldown_b: 40, rdl_b: 40, lateral_b: 6, triceps_b: 18,
  lunges_c: 14, dips_c: 0, cable_row_c: 35, leg_curl_c: 25,
  leg_ext_c: 25, facepull_c: 12,
};

export function useWorkout() {
  const today = getTodayKey();
  const [sessionState, setSessionState] = useStorage(STORAGE_KEYS.SESSION_STATE, {});
  const [history, setHistory] = useStorage(STORAGE_KEYS.WORKOUT_HISTORY, []);
  const [exerciseNotes, setExerciseNotes] = useStorage(STORAGE_KEYS.EXERCISE_NOTES, {});
  const [disabledExercises, setDisabledExercises] = useStorage(STORAGE_KEYS.DISABLED_EXERCISES, []);
  const [swappedExercises, setSwappedExercises] = useStorage(STORAGE_KEYS.SWAPPED_EXERCISES, {});

  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const cutoff = yesterday.toISOString().split('T')[0];
    setSessionState(prev => {
      const hasOld = Object.keys(prev).some(d => d < cutoff);
      if (!hasOld) return prev;
      const next = {};
      Object.entries(prev).forEach(([d, v]) => { if (d >= cutoff) next[d] = v; });
      return next;
    });
  }, []); // eslint-disable-line

  const todaySession = sessionState[today] || { sets: {}, weights: {}, rpe: {}, completed: false };

  const updateToday = useCallback((updater) => {
    setSessionState(prev => ({
      ...prev,
      [today]: updater(prev[today] || { sets: {}, weights: {}, rpe: {}, completed: false }),
    }));
  }, [today, setSessionState]);

  const toggleSet = useCallback((exerciseId, setIndex) => {
    updateToday(s => {
      const key = `${exerciseId}_${setIndex}`;
      return { ...s, sets: { ...s.sets, [key]: !s.sets[key] } };
    });
  }, [updateToday]);

  const setWeight = useCallback((exerciseId, kg) => {
    updateToday(s => ({ ...s, weights: { ...s.weights, [exerciseId]: kg } }));
  }, [updateToday]);

  const setRpe = useCallback((exerciseId, rpe) => {
    updateToday(s => ({ ...s, rpe: { ...s.rpe, [exerciseId]: rpe } }));
  }, [updateToday]);

  const finishWorkout = useCallback((workoutType, note = '', duration = '') => {
    updateToday(s => ({ ...s, completed: true }));
    const entry = {
      date: today, type: workoutType,
      sets: todaySession.sets, weights: todaySession.weights, rpe: todaySession.rpe,
      note, duration, finishedAt: Date.now(),
    };
    setHistory(prev => {
      const filtered = prev.filter(h => h.date !== today);
      return [entry, ...filtered];
    });
  }, [today, todaySession, updateToday, setHistory]);

  const deleteSession = useCallback((date) => {
    setHistory(prev => prev.filter(h => h.date !== date));
    setSessionState(prev => {
      if (!prev[date]) return prev;
      const next = { ...prev };
      delete next[date];
      return next;
    });
  }, [setHistory, setSessionState]);

  const getPR = useCallback((exerciseId) => {
    const currentWeight = todaySession.weights[exerciseId];
    if (!currentWeight) return false;
    const prevMax = history
      .filter(h => h.date !== today)
      .map(h => h.weights?.[exerciseId] || 0)
      .reduce((max, w) => Math.max(max, w), 0);
    return currentWeight > prevMax;
  }, [todaySession.weights, history, today]);

  // effectiveId : cle distincte pour les alts, historique independant de l'original
  const getEffectiveId = useCallback((exerciseId) => {
    const alt = swappedExercises[exerciseId];
    if (!alt) return exerciseId;
    return 'alt_' + alt.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  }, [swappedExercises]);

  // originalId : fallback pour trouver le poids de depart quand alt sans historique
  const getWeightSuggestion = useCallback((exerciseId, totalSets, originalId = null) => {
    const pastSessions = Array.isArray(history) ? history.filter(h => h.date !== today) : [];
    const lastWithExercise = pastSessions.find(h => h.weights?.[exerciseId] != null);

    if (!lastWithExercise) {
      // Pour les alts, utiliser le poids de depart de l'exercice original comme base
      const startWeight = STARTING_WEIGHTS[exerciseId] ??
        (originalId != null ? STARTING_WEIGHTS[originalId] : undefined) ??
        20;
      return {
        lastWeight: null, suggestion: startWeight, delta: 0,
        reason: startWeight === 0 ? 'Poids du corps' : 'Suggestion depart', isDefault: true,
      };
    }

    const lastWeight = lastWithExercise.weights[exerciseId];
    const lastRpe = lastWithExercise.rpe?.[exerciseId] || null;
    const setsCompleted = totalSets
      ? Array.from({ length: totalSets }, (_, i) =>
          lastWithExercise.sets?.[`${exerciseId}_${i}`]
        ).filter(Boolean).length
      : totalSets;
    const allSetsCompleted = totalSets ? setsCompleted === totalSets : true;

    let delta = 0, reason = '';
    if (lastRpe !== null && lastRpe <= 7 && allSetsCompleted) {
      delta = 2.5; reason = 'RPE ' + lastRpe + ' - facile';
    } else if (lastRpe !== null && lastRpe >= 9) {
      delta = -2.5; reason = 'RPE ' + lastRpe + ' - trop dur';
    } else if (allSetsCompleted) {
      reason = 'Maintien';
    } else {
      reason = 'Sets incomplets';
    }

    return { lastWeight, suggestion: Math.max(0, lastWeight + delta), delta, reason, isDefault: false };
  }, [history, today]);

  const setExerciseNote = useCallback((exerciseId, note) => {
    setExerciseNotes(prev => ({ ...prev, [exerciseId]: note }));
  }, [setExerciseNotes]);

  const toggleDisableExercise = useCallback((exerciseId) => {
    setDisabledExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  }, [setDisabledExercises]);

  const swapExercise = useCallback((exerciseId, altName) => {
    setSwappedExercises(prev => ({ ...prev, [exerciseId]: altName }));
  }, [setSwappedExercises]);

  const resetSwap = useCallback((exerciseId) => {
    setSwappedExercises(prev => {
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
  }, [setSwappedExercises]);

  return {
    todaySession, toggleSet, setWeight, setRpe, finishWorkout,
    getPR, getWeightSuggestion, deleteSession, history,
    exerciseNotes, setExerciseNote,
    disabledExercises, toggleDisableExercise,
    swappedExercises, swapExercise, resetSwap,
    getEffectiveId,
  };
}

export function getTodayWorkoutType() {
  const today = new Date(); today.setHours(0,0,0,0);
  const start = new Date(PROGRAM_START); start.setHours(0,0,0,0);
  const dayIndex = Math.floor((today - start) / 86400000);
  if (dayIndex < 0) return 'Push';
  return DAY_TYPES[dayIndex % 7];
}

export function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

export function getDaysUntilTrip() {
  const end = new Date('2026-07-26T00:00:00');
  return Math.max(0, Math.ceil((end - new Date()) / 86400000));
}

export function getProgramWeek() {
  const today = new Date(); today.setHours(0,0,0,0);
  const start = new Date(PROGRAM_START); start.setHours(0,0,0,0);
  const dayIndex = Math.floor((today - start) / 86400000);
  return Math.max(1, Math.floor(dayIndex / 7) + 1);
}
