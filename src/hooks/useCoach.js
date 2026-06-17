import { useMemo } from 'react';
import { WORKOUT_TYPES } from '../data/workout';

/**
 * useCoach — cerveau local, sans appel API.
 * Analyse l'historique + la séance du jour et produit 1-2 insights contextuels.
 *
 * Règles par priorité :
 *  1. Célébration PR détectée aujourd'hui
 *  2. Fatigue : 3+ séances consécutives sans jour de repos -> suggérer repos
 *  3. Volume en baisse sur 3 dernières séances du même type
 *  4. Hydratation (si disponible depuis localStorage)
 *  5. Progression de charge suggérée (RPE <= 7 la dernière fois)
 *  6. Motivation générique si rien d'autre
 */
export function useCoach({ history, todaySession, hydration, hydrationGoal = 8 }) {
  const insights = useMemo(() => {
    const results = [];

    // ── 1. PR aujourd'hui ────────────────────────────────────────────────
    const allExercises = Object.values(WORKOUT_TYPES)
      .flatMap(wt => wt.exercises || [])
      .filter((ex, i, arr) => arr.findIndex(e => e.id === ex.id) === i);

    const todayWeights = todaySession?.weights || {};
    const prs = allExercises.filter(ex => {
      const w = todayWeights[ex.id];
      if (!w) return false;
      const prevMax = history
        .map(h => h.weights?.[ex.id] || 0)
        .reduce((m, v) => Math.max(m, v), 0);
      return w > prevMax;
    });

    if (prs.length > 0) {
      results.push({
        id: 'pr',
        type: 'success',
        icon: '🏆',
        title: 'Record personnel !',
        body: `${prs.map(e => e.name).join(', ')} — nouveau PR aujourd\'hui. Continue comme ca !`,
      });
    }

    // ── 2. Fatigue : 3 seances en 3 jours ─────────────────────────────────
    if (history.length >= 3) {
      const recent = history.slice(0, 3).map(h => h.date);
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yKey = yesterday.toISOString().split('T')[0];
      const dayBefore = new Date(); dayBefore.setDate(dayBefore.getDate() - 2);
      const dbKey = dayBefore.toISOString().split('T')[0];
      if (recent.includes(today) && recent.includes(yKey) && recent.includes(dbKey)) {
        results.push({
          id: 'fatigue',
          type: 'warning',
          icon: '😴',
          title: '3 seances consecutives',
          body: 'Tu t\'entraines depuis 3 jours de suite. Un jour de repos favorise la recuperation musculaire et previent les blessures.',
        });
      }
    }

    // ── 3. Volume en baisse ────────────────────────────────────────────────
    if (results.length < 2 && history.length >= 4) {
      const computeVol = (s) => {
        const wt = WORKOUT_TYPES[s.type];
        if (!wt) return 0;
        let v = 0;
        (wt.exercises || []).forEach(ex => {
          const w = s.weights?.[ex.id] || 0;
          const r = Math.round((ex.repsMin + ex.repsMax) / 2);
          for (let i = 0; i < ex.sets; i++) {
            if (s.sets?.[`${ex.id}_${i}`]) v += w * r;
          }
        });
        return v;
      };
      const vols = history.slice(0, 4).map(computeVol);
      if (vols[0] > 0 && vols[1] > 0 && vols[2] > 0) {
        const avg = (vols[1] + vols[2] + vols[3]) / 3;
        if (avg > 0 && vols[0] < avg * 0.8) {
          results.push({
            id: 'volume',
            type: 'info',
            icon: '📉',
            title: 'Volume en baisse',
            body: 'Ton volume de la derniere seance etait en baisse de plus de 20% par rapport a la moyenne. Fais attention a ne pas te sous-entrainer.',
          });
        }
      }
    }

    // ── 4. Hydratation insuffisante ────────────────────────────────────────
    if (results.length < 2 && typeof hydration === 'number') {
      if (hydration < Math.ceil(hydrationGoal * 0.5)) {
        results.push({
          id: 'hydration',
          type: 'warning',
          icon: '💧',
          title: 'Pense a t\'hydrater',
          body: `${hydration}/${hydrationGoal} verres aujourd\'hui. La performance chute de 10-15% avec seulement 2% de deshydratation.`,
        });
      }
    }

    // ── 5. Suggestions de progression ─────────────────────────────────────
    if (results.length < 2 && history.length >= 2) {
      const lastSession = history[0];
      const suggestions = allExercises.filter(ex => {
        const rpe = lastSession.rpe?.[ex.id];
        const w = lastSession.weights?.[ex.id];
        return rpe && rpe <= 7 && w && w > 0;
      }).slice(0, 2);

      if (suggestions.length > 0) {
        results.push({
          id: 'progress',
          type: 'info',
          icon: '📈',
          title: 'Pret a progresser',
          body: `RPE <= 7 la derniere fois pour ${suggestions.map(e => e.name).join(', ')}. Tu peux augmenter de 2.5kg !`,
        });
      }
    }

    // ── 6. Motivation generique ────────────────────────────────────────────
    if (results.length === 0) {
      const messages = [
        { icon: '💪', title: 'En route !', body: 'Chaque seance compte. Concentre-toi sur la technique et la regularite.' },
        { icon: '🎯', title: 'Focus', body: 'La progression c\'est 80% de regularite, 20% d\'intensite. Tu es sur la bonne voie.' },
        { icon: '🔥', title: 'Bonne seance !', body: 'Echauffe-toi bien, note tes poids et donne tout sur chaque serie.' },
      ];
      const pick = messages[new Date().getDay() % messages.length];
      results.push({ id: 'motivation', type: 'default', ...pick });
    }

    return results.slice(0, 2);
  }, [history, todaySession, hydration, hydrationGoal]);

  return { insights };
}
