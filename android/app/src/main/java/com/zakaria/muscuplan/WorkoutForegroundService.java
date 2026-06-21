package com.zakaria.muscuplan;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;

import androidx.core.app.NotificationCompat;
import androidx.core.app.RemoteInput;

public class WorkoutForegroundService extends Service {

    public static final String CHANNEL_ID    = "workout_fg_channel";
    public static final int    NOTIF_ID      = 5001;
    public static final String KEY_KG        = "key_kg";
    public static final String KEY_REPS      = "key_reps";
    public static final String ACTION_SET_DONE   = "com.zakaria.muscuplan.ACTION_SET_DONE";
    public static final String ACTION_NEXT       = "com.zakaria.muscuplan.ACTION_NEXT";
    public static final String ACTION_SKIP_REST  = "com.zakaria.muscuplan.ACTION_SKIP_REST";
    public static final String ACTION_INPUT_KG   = "com.zakaria.muscuplan.ACTION_INPUT_KG";
    public static final String ACTION_INPUT_REPS = "com.zakaria.muscuplan.ACTION_INPUT_REPS";

    // Shared mutable state — updated from JS via WorkoutNotificationPlugin
    public static WorkoutForegroundService instance = null;
    public static String exerciseName    = "Séance en cours";
    public static int    exerciseNum     = 1;
    public static int    totalExercises  = 1;
    public static int    setsDone        = 0;
    public static int    setsTotal       = 4;
    public static float  weightKg        = 0f;
    public static int    restDuration    = 90;
    public static boolean isResting      = false;
    public static int    restSeconds     = 0;
    public static int    sessionSeconds  = 0;

    private final Handler  handler      = new Handler(Looper.getMainLooper());
    private final Runnable tickRunnable = new Runnable() {
        @Override public void run() {
            sessionSeconds++;
            if (isResting && restSeconds > 0) {
                restSeconds--;
                if (restSeconds == 0) {
                    isResting = false;
                    if (WorkoutNotificationPlugin.instance != null) {
                        WorkoutNotificationPlugin.instance.fireEvent(
                            "restEnded", new com.getcapacitor.JSObject()
                        );
                    }
                }
            }
            updateNotification();
            handler.postDelayed(this, 1000);
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        createChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startForeground(NOTIF_ID, buildNotification());
        handler.removeCallbacks(tickRunnable);
        handler.postDelayed(tickRunnable, 1000);
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        instance = null;
        handler.removeCallbacks(tickRunnable);
    }

    @Override
    public IBinder onBind(Intent intent) { return null; }

    public void updateNotification() {
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm != null) nm.notify(NOTIF_ID, buildNotification());
    }

    private void createChannel() {
        NotificationChannel ch = new NotificationChannel(
            CHANNEL_ID, "Séance en cours", NotificationManager.IMPORTANCE_LOW
        );
        ch.setDescription("Suivi temps réel de la séance");
        ch.setShowBadge(false);
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm != null) nm.createNotificationChannel(ch);
    }

    private Notification buildNotification() {
        // --- Titre et corps ---
        int sesMin = sessionSeconds / 60, sesSec = sessionSeconds % 60;
        String sessionFmt = String.format("%02d:%02d", sesMin, sesSec);

        String title, body;
        if (isResting) {
            int rMin = restSeconds / 60, rSec = restSeconds % 60;
            title = String.format("⏱ Repos %02d:%02d — %s", rMin, rSec, exerciseName);
        } else {
            title = String.format("🏋️ %s (%d/%d)", exerciseName, exerciseNum, totalExercises);
        }
        body = String.format("%d/%d séries%s · %s",
            setsDone, setsTotal,
            weightKg > 0 ? String.format(" · %.1f kg", weightKg) : "",
            sessionFmt
        );

        // --- Intent principal : ouvre l'app ---
        Intent openApp = new Intent(this, MainActivity.class);
        openApp.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent openPi = PendingIntent.getActivity(
            this, 0, openApp,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // --- RemoteInput : Kg ---
        RemoteInput riKg = new RemoteInput.Builder(KEY_KG)
            .setLabel("Poids (kg)")
            .build();
        Intent kgIntent = new Intent(ACTION_INPUT_KG).setPackage(getPackageName());
        PendingIntent kgPi = PendingIntent.getBroadcast(
            this, 101, kgIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE
        );
        NotificationCompat.Action kgAction = new NotificationCompat.Action.Builder(
            R.drawable.ic_stat_workout, "Kg", kgPi
        ).addRemoteInput(riKg).build();

        // --- RemoteInput : Reps ---
        RemoteInput riReps = new RemoteInput.Builder(KEY_REPS)
            .setLabel("Reps effectuées")
            .build();
        Intent repsIntent = new Intent(ACTION_INPUT_REPS).setPackage(getPackageName());
        PendingIntent repsPi = PendingIntent.getBroadcast(
            this, 102, repsIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE
        );
        NotificationCompat.Action repsAction = new NotificationCompat.Action.Builder(
            R.drawable.ic_stat_workout, "Reps", repsPi
        ).addRemoteInput(riReps).build();

        // --- Bouton : ✓ Série ---
        Intent doneIntent = new Intent(ACTION_SET_DONE).setPackage(getPackageName());
        PendingIntent donePi = PendingIntent.getBroadcast(
            this, 103, doneIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        NotificationCompat.Action doneAction = new NotificationCompat.Action.Builder(
            R.drawable.ic_stat_workout, "✓ Série", donePi
        ).build();

        // --- Bouton : Suivant ---
        Intent nextIntent = new Intent(ACTION_NEXT).setPackage(getPackageName());
        PendingIntent nextPi = PendingIntent.getBroadcast(
            this, 104, nextIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        NotificationCompat.Action nextAction = new NotificationCompat.Action.Builder(
            R.drawable.ic_stat_workout, "Suivant ▶", nextPi
        ).build();

        // --- Bouton : Passer repos ---
        Intent skipIntent = new Intent(ACTION_SKIP_REST).setPackage(getPackageName());
        PendingIntent skipPi = PendingIntent.getBroadcast(
            this, 105, skipIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        NotificationCompat.Action skipAction = new NotificationCompat.Action.Builder(
            R.drawable.ic_stat_workout, "Passer ▶▶", skipPi
        ).build();

        // --- Build ---
        NotificationCompat.Builder nb = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_workout)
            .setContentTitle(title)
            .setContentText(body)
            .setContentIntent(openPi)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setSilent(true)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .addAction(kgAction)
            .addAction(repsAction);

        if (isResting) {
            nb.addAction(skipAction);
        } else {
            nb.addAction(doneAction);
        }
        if (setsDone >= setsTotal) {
            nb.addAction(nextAction);
        }

        return nb.build();
    }
}
