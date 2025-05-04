import React from "react";
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Simple error boundary component to catch rendering errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: any, errorInfo: any) {
    console.error("React Error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          border: '1px solid #f00',
          borderRadius: '4px',
          background: '#fff' 
        }}>
          <h2>Something went wrong</h2>
          <p>The application failed to load properly. Try refreshing the page.</p>
          <details style={{ marginTop: '10px' }}>
            <summary>Error details</summary>
            <pre style={{ 
              background: '#f7f7f7', 
              padding: '10px', 
              overflowX: 'auto' 
            }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found! Make sure there is a div with id='root' in your HTML.");
}
