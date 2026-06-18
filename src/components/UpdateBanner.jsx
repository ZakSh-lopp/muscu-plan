export default function UpdateBanner({ update, onDismiss }) {
  if (!update) return null;

  function handleInstall() {
    // Opens in Android default browser → downloads APK → prompts install
    if (window.open) window.open(update.downloadUrl, '_system');
    else location.href = update.downloadUrl;
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: 'var(--accent)', color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px',
      paddingTop: 'calc(10px + env(safe-area-inset-top))',
      boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
    }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13 }}>
          &#8593; Mise à jour {update.version} disponible
        </div>
        <div style={{ fontSize: 11, opacity: 0.85 }}>
          Build actuel : v{update.currentBuild}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleInstall} style={{
          background: 'white', color: 'var(--accent)',
          fontWeight: 700, fontSize: 13,
          padding: '6px 14px', borderRadius: 20,
          border: 'none', cursor: 'pointer',
        }}>
          Installer
        </button>
        <button onClick={onDismiss} style={{
          background: 'transparent', color: 'white',
          fontSize: 18, border: 'none', cursor: 'pointer', padding: '0 4px',
        }}>
          &#10005;
        </button>
      </div>
    </div>
  );
}
