import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      const e = this.state.error;
      return (
        <div style={{
          padding: 24, background: '#0d0000', color: '#ff6b6b',
          minHeight: '100vh', fontFamily: 'monospace', fontSize: 13,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            Erreur React (Error Boundary)
          </div>
          <div style={{ marginBottom: 8 }}><b>{e.name}:</b> {e.message}</div>
          <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap', lineHeight: 1.6, marginTop: 12 }}>
            {e.stack}
          </pre>
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
