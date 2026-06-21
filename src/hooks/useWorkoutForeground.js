/**
 * useWorkoutForeground
 * --------------------
 * Wraps the native WorkoutNotificationPlugin (foreground service + RemoteInput).
 * Falls back silently on web / when Capacitor is not available.
 */

function getPlugin() {
  try {
    return window?.Capacitor?.Plugins?.WorkoutNotification ?? null;
  } catch {
    return null;
  }
}

export function useWorkoutForeground() {
  const plugin = getPlugin();

  /** Démarre le service — appeler à l'entrée du mode guidé */
  async function start({ exerciseName, exerciseNum, totalExercises, setsDone, setsTotal, weight, restDuration } = {}) {
    if (!plugin) return;
    await plugin.startWorkout({
      exerciseName:   exerciseName   ?? 'Séance en cours',
      exerciseNum:    exerciseNum    ?? 1,
      totalExercises: totalExercises ?? 1,
      setsDone:       setsDone       ?? 0,
      setsTotal:      setsTotal      ?? 4,
      weight:         weight         ?? 0,
      restDuration:   restDuration   ?? 90,
    });
  }

  /** Met à jour l'exercice courant (changement d'exo, série validée, poids modifié) */
  async function update(opts = {}) {
    if (!plugin) return;
    await plugin.updateExercise(opts);
  }

  /** Lance le timer de repos */
  async function startRest(seconds = 90) {
    if (!plugin) return;
    await plugin.startRest({ seconds });
  }

  /** Annule le repos (ex : bouton "Passer" dans l'app) */
  async function stopRest() {
    if (!plugin) return;
    await plugin.stopRest();
  }

  /** Arrête le service — appeler à la fin de la séance ou quand on quitte le mode guidé */
  async function stop() {
    if (!plugin) return;
    await plugin.stopWorkout();
  }

  /**
   * Écoute les événements venus de la notification (boutons + RemoteInput).
   *
   * @param {Object} handlers
   *   - setDone()          → bouton ✓ Série tapé depuis la notif
   *   - nextExercise()     → bouton Suivant tapé depuis la notif
   *   - restSkipped()      → bouton Passer tapé depuis la notif
   *   - restEnded()        → repos terminé naturellement (timer arrivé à 0)
   *   - weightChanged({weight: float})  → RemoteInput "Kg" soumis
   *   - repsChanged({reps: int})        → RemoteInput "Reps" soumis
   *
   * @returns {Function} removeListeners — appeler dans le cleanup useEffect
   */
  function addListeners(handlers = {}) {
    if (!plugin) return () => {};

    const subs = [];

    const register = (event, fn) => {
      if (fn) subs.push(plugin.addListener(event, fn));
    };

    register('setDone',       handlers.setDone);
    register('nextExercise',  handlers.nextExercise);
    register('restSkipped',   handlers.restSkipped);
    register('restEnded',     handlers.restEnded);
    register('weightChanged', handlers.weightChanged);
    register('repsChanged',   handlers.repsChanged);

    return () => subs.forEach(s => s?.remove?.());
  }

  return { start, update, startRest, stopRest, stop, addListeners };
}
