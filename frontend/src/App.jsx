import React from 'react';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPanel from './components/AuthPanel';

function AppContent() {
  const { user, logout } = useAuth();

  return (
    <div className="app-wrapper">
      {/* Dashboard Top Header */}
      <header className="app-header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="logo-text">
            <h1>FinDash</h1>
            <p>Full Stack Fintech Ledger Dashboard</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              <span style={{ color: '#fff', fontWeight: 600 }}>Hello, {user.username}</span>
              <button type="button" className="link-button" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <span style={{
              background: 'var(--color-primary-glow)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              SQLite Active
            </span>
          )}
        </div>
      </header>

      {/* Main Page Area */}
      <main>
        {user ? <Dashboard /> : <AuthPanel />}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        paddingTop: '2rem',
        borderTop: '1px solid var(--card-border)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)'
      }}>
        FinDash &copy; 2026. Made with React, Vite & Django REST Framework.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
