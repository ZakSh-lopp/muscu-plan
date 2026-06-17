import { useState, useCallback } from 'react';
import { useStorage, STORAGE_KEYS } from './useStorage';

// Clé de stockage pour l'heure de notification choisie
const NOTIF_TIME_KEY = 'muscu_notif_time';
const NOTIF_ENABLED_KEY = 'muscu_notif_enabled';

async function requestPermission() {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return false;
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const perm = await LocalNotifications.requestPermissions();
    return perm.display === 'granted';
  } catch (e) { return false; }
}

async function scheduleDaily(hour, minute) {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return;
    const { LocalNotifications } = await import('@capacitor/local-notifications');

    // Annuler les notifs existantes avant de replanifier
    await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });

    const messages = [
      "C'est l'heure de t'entrainer ! Rappelle-toi pourquoi tu as commence.",
      "Seance du jour - tu es capable, go !",
      "Le muscle se construit avec la regularite. C'est parti !",
      "Une seance de plus = un pas vers ton objectif.",
    ];
    const body = messages[Math.floor(Math.random() * messages.length)];

    await LocalNotifications.schedule({
      notifications: [{
        id: 1001,
        title: "Muscu Plan - Seance du jour",
        body,
        schedule: {
          on: { hour, minute },
          every: 'day',
          allowWhileIdle: true,
        },
        sound: null,
        actionTypeId: '',
        extra: null,
      }],
    });
  } catch (e) { console.warn('Notification schedule error:', e); }
}

async function cancelDaily() {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return;
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });
  } catch (e) {}
}

export function useNotifications() {
  const [notifTime, setNotifTime] = useStorage(NOTIF_TIME_KEY, '09:00');
  const [notifEnabled, setNotifEnabled] = useStorage(NOTIF_ENABLED_KEY, false);
  const [loading, setLoading] = useState(false);

  const enable = useCallback(async (time) => {
    setLoading(true);
    const granted = await requestPermission();
    if (!granted) {
      setLoading(false);
      return false;
    }
    const [h, m] = time.split(':').map(Number);
    await scheduleDaily(h, m);
    setNotifTime(time);
    setNotifEnabled(true);
    setLoading(false);
    return true;
  }, [setNotifTime, setNotifEnabled]);

  const disable = useCallback(async () => {
    await cancelDaily();
    setNotifEnabled(false);
  }, [setNotifEnabled]);

  const update = useCallback(async (time) => {
    if (!notifEnabled) return;
    const [h, m] = time.split(':').map(Number);
    await scheduleDaily(h, m);
    setNotifTime(time);
  }, [notifEnabled, setNotifTime]);

  return { notifEnabled, notifTime, loading, enable, disable, update };
}
