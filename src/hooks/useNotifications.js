import { useState, useCallback } from 'react';
import { useStorage } from './useStorage';

const NOTIF_TIME_KEY    = 'muscu_notif_time';
const NOTIF_ENABLED_KEY = 'muscu_notif_enabled';
const SUPPL_ENABLED_KEY = 'muscu_suppl_notif_enabled';
const CHANNEL_ID        = 'muscu-main';

function isNative() {
  return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}
function getPlugin() {
  if (!isNative()) return null;
  return window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications
    ? window.Capacitor.Plugins.LocalNotifications
    : null;
}

async function ensureChannel(P) {
  try {
    await P.createChannel({
      id: CHANNEL_ID, name: 'Muscu Plan',
      description: 'Rappels seance et supplements',
      importance: 5, visibility: 1,
      sound: 'default', vibration: true, lights: true,
    });
  } catch (e) { console.warn('createChannel:', e); }
}

async function ensurePermission(P) {
  try {
    const check = await P.checkPermissions();
    if (check.display === 'granted') return true;
    const req = await P.requestPermissions();
    return req.display === 'granted';
  } catch { return false; }
}

async function scheduleDaily(hour, minute) {
  const P = getPlugin(); if (!P) return;
  try {
    await ensureChannel(P);
    await P.cancel({ notifications: [{ id: 1001 }] });
    const msgs = [
      "C'est l'heure de t'entrainer ! Rappelle-toi pourquoi tu as commence.",
      "Seance du jour - tu es capable, go !",
      "Le muscle se construit avec la regularite. C'est parti !",
    ];
    await P.schedule({ notifications: [{
      id: 1001, channelId: CHANNEL_ID,
      title: 'Muscu Plan - Seance du jour',
      body: msgs[Math.floor(Math.random() * msgs.length)],
      schedule: { on: { hour, minute }, allowWhileIdle: true },
      sound: 'default', actionTypeId: '', extra: null,
    }]});
  } catch (e) { console.warn('scheduleDaily:', e); }
}

async function cancelDaily() {
  const P = getPlugin(); if (!P) return;
  try { await P.cancel({ notifications: [{ id: 1001 }] }); } catch {}
}

export async function sendTestNotification() {
  const P = getPlugin();
  if (!P) return 'Pas sur mobile';
  try {
    await ensureChannel(P);
    const ok = await ensurePermission(P);
    if (!ok) return 'Permission refusee — active dans Parametres Android > Muscu Plan > Notifications';
    await P.cancel({ notifications: [{ id: 9999 }] });
    await P.schedule({ notifications: [{
      id: 9999, channelId: CHANNEL_ID,
      title: 'Muscu Plan - Test',
      body: 'Les notifications fonctionnent !',
      schedule: { at: new Date(Date.now() + 5000), allowWhileIdle: true },
      sound: 'default', actionTypeId: '', extra: null,
    }]});
    return 'ok';
  } catch (e) { return String(e); }
}

const SUPPL_NOTIFS = [
  { id: 2001, hour: 8,  minute: 0, title: 'Supplements matin',  body: 'Creatine + Omega 3 + Vitamine D3 !' },
  { id: 2002, hour: 13, minute: 0, title: 'Supplement midi',    body: 'Pense a ton Omega 3 du midi.' },
  { id: 2003, hour: 21, minute: 0, title: 'Supplements soir',   body: 'Omega 3 + Zinc/Magnesium avant de dormir !' },
];

async function scheduleSupplements() {
  const P = getPlugin(); if (!P) return;
  try {
    await ensureChannel(P);
    await P.cancel({ notifications: SUPPL_NOTIFS.map(n => ({ id: n.id })) });
    await P.schedule({ notifications: SUPPL_NOTIFS.map(n => ({
      id: n.id, channelId: CHANNEL_ID,
      title: `Muscu Plan - ${n.title}`, body: n.body,
      schedule: { on: { hour: n.hour, minute: n.minute }, allowWhileIdle: true },
      sound: 'default', actionTypeId: '', extra: null,
    }))});
  } catch (e) { console.warn('scheduleSupplements:', e); }
}

async function cancelSupplements() {
  const P = getPlugin(); if (!P) return;
  try { await P.cancel({ notifications: SUPPL_NOTIFS.map(n => ({ id: n.id })) }); } catch {}
}

export function useNotifications() {
  const [notifTime, setNotifTime]       = useStorage(NOTIF_TIME_KEY, '09:00');
  const [notifEnabled, setNotifEnabled] = useStorage(NOTIF_ENABLED_KEY, false);
  const [supplEnabled, setSupplEnabled] = useStorage(SUPPL_ENABLED_KEY, false);
  const [loading, setLoading] = useState(false);

  const enable = useCallback(async (time) => {
    setLoading(true);
    const P = getPlugin();
    if (!P) { setLoading(false); return false; }
    const granted = await ensurePermission(P);
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
    const P = getPlugin();
    if (!P) { setLoading(false); return false; }
    const granted = await ensurePermission(P);
    if (!granted) { setLoading(false); return false; }
    await scheduleSupplements();
    setSupplEnabled(true); setLoading(false); return true;
  }, [setSupplEnabled]);

  const disableSupplements = useCallback(async () => {
    await cancelSupplements(); setSupplEnabled(false);
  }, [setSupplEnabled]);

  return { notifEnabled, notifTime, loading, enable, disable, update, supplEnabled, enableSupplements, disableSupplements };
}
