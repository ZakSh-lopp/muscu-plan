import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

// ── Capacitor StatusBar + SafeArea (Android edge-to-edge) ───────────────────
// Sur Android 14+ (ex: Samsung A35), Capacitor 6 active edge-to-edge par défaut :
// le WebView s'étend sous la status bar et la nav bar.
// On initialise le StatusBar plugin pour définir le style,
// puis on laisse CSS env(safe-area-inset-top/bottom) gérer les insets.
async function initNative() {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return;

    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#09090900' }); // transparent

    // Forcer les insets CSS à être disponibles via viewport-fit=cover
    // (déjà dans index.html — cet appel déclenche le recalcul sur Samsung)
    document.documentElement.style.setProperty('--native-ready', '1');
  } catch (e) {
    // Pas en contexte natif ou plugin absent — rien à faire
  }
}

initNative();

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      const e = this.state.error;
      return (
        <div style={{ padding: 24, background: '#0d0000', color: '#ff6b6b', minHeight: '100vh', fontFamily: 'monospace', fontSize: 13 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Erreur React</div>
          <div style={{ marginBottom: 8 }}><b>{e.name}:</b> {e.message}</div>
          <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap', lineHeight: 1.6, marginTop: 12 }}>{e.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
