package com.zakaria.muscuplan;

import android.content.Intent;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WorkoutNotification")
public class WorkoutNotificationPlugin extends Plugin {

    public static WorkoutNotificationPlugin instance = null;

    @Override
    public void load() {
        instance = this;
    }

    /** Démarre le foreground service — appelé quand la séance commence en mode guidé */
    @PluginMethod
    public void startWorkout(PluginCall call) {
        // Reset chrono
        WorkoutForegroundService.sessionSeconds = 0;
        WorkoutForegroundService.isResting      = false;
        WorkoutForegroundService.restSeconds    = 0;

        applyExerciseOptions(call);

        Intent intent = new Intent(getContext(), WorkoutForegroundService.class);
        getContext().startForegroundService(intent);
        call.resolve();
    }

    /** Met à jour les données de l'exercice courant (exercice changé, série validée, poids saisi) */
    @PluginMethod
    public void updateExercise(PluginCall call) {
        applyExerciseOptions(call);
        if (WorkoutForegroundService.instance != null) {
            WorkoutForegroundService.instance.updateNotification();
        }
        call.resolve();
    }

    /** Démarre le timer de repos (secondes données par le JS) */
    @PluginMethod
    public void startRest(PluginCall call) {
        int seconds = call.getInt("seconds", 90);
        WorkoutForegroundService.restDuration = seconds;
        WorkoutForegroundService.restSeconds  = seconds;
        WorkoutForegroundService.isResting    = true;
        if (WorkoutForegroundService.instance != null) {
            WorkoutForegroundService.instance.updateNotification();
        }
        call.resolve();
    }

    /** Passe le repos (bouton "Passer" dans l'app) */
    @PluginMethod
    public void stopRest(PluginCall call) {
        WorkoutForegroundService.isResting   = false;
        WorkoutForegroundService.restSeconds = 0;
        if (WorkoutForegroundService.instance != null) {
            WorkoutForegroundService.instance.updateNotification();
        }
        call.resolve();
    }

    /** Arrête le foreground service — appelé quand on quitte le mode guidé */
    @PluginMethod
    public void stopWorkout(PluginCall call) {
        Intent intent = new Intent(getContext(), WorkoutForegroundService.class);
        getContext().stopService(intent);
        call.resolve();
    }

    // --- helpers ---

    private void applyExerciseOptions(PluginCall call) {
        String name = call.getString("exerciseName");
        if (name != null) WorkoutForegroundService.exerciseName = name;

        Integer num = call.getInt("exerciseNum");
        if (num != null) WorkoutForegroundService.exerciseNum = num;

        Integer total = call.getInt("totalExercises");
        if (total != null) WorkoutForegroundService.totalExercises = total;

        Integer done = call.getInt("setsDone");
        if (done != null) WorkoutForegroundService.setsDone = done;

        Integer sTotal = call.getInt("setsTotal");
        if (sTotal != null) WorkoutForegroundService.setsTotal = sTotal;

        Integer restDur = call.getInt("restDuration");
        if (restDur != null) WorkoutForegroundService.restDuration = restDur;

        Double w = call.getDouble("weight");
        if (w != null) WorkoutForegroundService.weightKg = w.floatValue();
    }
}
