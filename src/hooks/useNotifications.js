import { useState, useCallback } from 'react';
import { useStorage } from './useStorage';

const NOTIF_TIME_KEY = 'muscu_notif_time';
const NOTIF_ENABLED_KEY = 'muscu_notif_enabled';
const SUPPL_ENABLED_KEY = 'muscu_suppl_notif_enabled';

async function getPlugin() {
  const { Capacitor } = await import('@capacitor/core');
  if (!Capacitor.isNativePlatform()) return null;
  const { LocalNotifications } = await import('@capacitor/local-notifications');
  return LocalNotifications;
}

async function ensurePermission() {
  try {
    const P = await getPlugin();
    if (!P) return false;
    // 1. Verifier d'abord si deja accordee (cas: accordee manuellement dans les parametres)
    const check = await P.checkPermissions();
    if (check.display === 'granted') return true;
    // 2. Sinon demander
    const req = await P.requestPermissions();
    return req.display === 'granted';
  } catch (e) {
    console.warn('permission error:', e);
    return false;
  }
}

async function scheduleDaily(hour, minute) {
  try {
    const P = await getPlugin();
    if (!P) return;
    await P.cancel({ notifications: [{ id: 1001 }] });
    const messages = [
      "C'est l'heure de t'entrainer ! Rappelle-toi pourquoi tu as commence.",
      "Seance du jour - tu es capable, go !",
      "Le muscle se construit avec la regularite. C'est parti !",
      "Une seance de plus = un pas vers ton objectif.",
    ];
    await P.schedule({ notifications: [{
      id: 1001,
      title: "Muscu Plan - Seance du jour",
      body: messages[Math.floor(Math.random() * messages.length)],
      schedule: { on: { hour, minute }, every: 'day', allowWhileIdle: true },
      sound: null, actionTypeId: '', extra: null,
    }]});
  } catch (e) { console.warn('scheduleDaily error:', e); }
}

async function cancelDaily() {
  try { const P = await getPlugin(); if (P) await P.cancel({ notifications: [{ id: 1001 }] }); } catch {}
}

const SUPPL_NOTIFS = [
  { id: 2001, hour: 8,  minute: 0, title: 'Supplements matin',  body: 'Creatine + Omega 3 + Vitamine D3 !' },
  { id: 2002, hour: 13, minute: 0, title: 'Supplement midi',    body: 'Pense a ton Omega 3 du midi.' },
  { id: 2003, hour: 21, minute: 0, title: 'Supplements soir',   body: 'Omega 3 + Zinc/Magnesium avant de dormir !' },
];

async function scheduleSupplements() {
  try {
    const P = await getPlugin();
    if (!P) return;
    await P.cancel({ notifications: SUPPL_NOTIFS.map(n => ({ id: n.id })) });
    await P.schedule({ notifications: SUPPL_NOTIFS.map(n => ({
      id: n.id, title: `Muscu Plan - ${n.title}`, body: n.body,
      schedule: { on: { hour: n.hour, minute: n.minute }, every: 'day', allowWhileIdle: true },
      sound: null, actionTypeId: '', extra: null,
    }))});
  } catch (e) { console.warn('scheduleSupplements error:', e); }
}

async function cancelSupplements() {
  try { const P = await getPlugin(); if (P) await P.cancel({ notifications: SUPPL_NOTIFS.map(n => ({ id: n.id })) }); } catch {}
}

export function useNotifications() {
  const [notifTime, setNotifTime] = useStorage(NOTIF_TIME_KEY, '09:00');
  const [notifEnabled, setNotifEnabled] = useStorage(NOTIF_ENABLED_KEY, false);
  const [supplEnabled, setSupplEnabled] = useStorage(SUPPL_ENABLED_KEY, false);
  const [loading, setLoading] = useState(false);

  const enable = useCallback(async (time) => {
    setLoading(true);
    const granted = await ensurePermission();
    if (!granted) { setLoading(false); return false; }
    const [h, m] = time.split(':').map(Number);
    await scheduleDaily(h, m);
    setNotifTime(time); setNotifEnabled(true);
    setLoading(false); return true;
  }, [setNotifTime, setNotifEnabled]);

  const disable = useCallback(async () => {
    await cancelDaily(); setNotifEnabled(false);
  }, [setNotifEnabled]);

  const update = useCallback(async (time) => {
    if (!notifEnabled) return;
    const [h, m] = time.split(':').map(Number);
    await scheduleDaily(h, m); setNotifTime(time);
  }, [notifEnabled, setNotifTime]);

  const enableSupplements = useCallback(async () => {
    setLoading(true);
    const granted = await ensurePermission();
    if (!granted) { setLoading(false); return false; }
    await scheduleSupplements();
    setSupplEnabled(true); setLoading(false); return true;
  }, [setSupplEnabled]);

  const disableSupplements = useCallback(async () => {
    await cancelSupplements(); setSupplEnabled(false);
  }, [setSupplEnabled]);

  return { notifEnabled, notifTime, loading, enable, disable, update, supplEnabled, enableSupplements, disableSupplements };
}
