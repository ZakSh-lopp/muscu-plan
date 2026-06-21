package com.zakaria.muscuplan;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.core.app.RemoteInput;

import com.getcapacitor.JSObject;

public class WorkoutBroadcastReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (action == null) return;

        WorkoutNotificationPlugin plugin = WorkoutNotificationPlugin.instance;

        switch (action) {

            case WorkoutForegroundService.ACTION_SET_DONE: {
                // Incrémenter les séries localement + démarrer le repos
                WorkoutForegroundService.setsDone = Math.min(
                    WorkoutForegroundService.setsDone + 1,
                    WorkoutForegroundService.setsTotal
                );
                WorkoutForegroundService.isResting = true;
                WorkoutForegroundService.restSeconds = WorkoutForegroundService.restDuration;
                if (WorkoutForegroundService.instance != null) {
                    WorkoutForegroundService.instance.updateNotification();
                }
                if (plugin != null) plugin.fireEvent("setDone", new JSObject());
                break;
            }

            case WorkoutForegroundService.ACTION_NEXT: {
                if (plugin != null) plugin.fireEvent("nextExercise", new JSObject());
                break;
            }

            case WorkoutForegroundService.ACTION_SKIP_REST: {
                WorkoutForegroundService.isResting = false;
                WorkoutForegroundService.restSeconds = 0;
                if (WorkoutForegroundService.instance != null) {
                    WorkoutForegroundService.instance.updateNotification();
                }
                if (plugin != null) plugin.fireEvent("restSkipped", new JSObject());
                break;
            }

            case WorkoutForegroundService.ACTION_INPUT_KG: {
                Bundle results = RemoteInput.getResultsFromIntent(intent);
                if (results == null) break;
                CharSequence kgSeq = results.getCharSequence(WorkoutForegroundService.KEY_KG);
                if (kgSeq == null) break;
                String kgStr = kgSeq.toString().trim().replace(",", ".");
                try {
                    float kg = Float.parseFloat(kgStr);
                    WorkoutForegroundService.weightKg = kg;
                    if (WorkoutForegroundService.instance != null) {
                        WorkoutForegroundService.instance.updateNotification();
                    }
                    if (plugin != null) {
                        JSObject data = new JSObject();
                        data.put("weight", kg);
                        plugin.fireEvent("weightChanged", data);
                    }
                } catch (NumberFormatException ignored) {}
                break;
            }

            case WorkoutForegroundService.ACTION_INPUT_REPS: {
                Bundle results = RemoteInput.getResultsFromIntent(intent);
                if (results == null) break;
                CharSequence repsSeq = results.getCharSequence(WorkoutForegroundService.KEY_REPS);
                if (repsSeq == null) break;
                try {
                    int reps = Integer.parseInt(repsSeq.toString().trim());
                    if (plugin != null) {
                        JSObject data = new JSObject();
                        data.put("reps", reps);
                        plugin.fireEvent("repsChanged", data);
                    }
                } catch (NumberFormatException ignored) {}
                break;
            }
        }
    }
}
