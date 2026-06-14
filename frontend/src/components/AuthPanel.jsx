import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPanel() {
  const { user, login, register, error, clearError } = useAuth();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [mode, clearError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError(null);
    clearError();

    if (!username.trim() || !password.trim()) {
      setLocalError('Username and password are required.');
      return;
    }

    if (mode === 'register' && !email.trim()) {
      setLocalError('Email is required for registration.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(username.trim(), password.trim());
      } else {
        await register(username.trim(), email.trim(), password.trim());
      }
    } catch (err) {
      setLocalError(err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((current) => (current === 'login' ? 'register' : 'login'));
  };

  if (user) {
    return null;
  }

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <header className="panel-header">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Your Account'}</h2>
          <p>{mode === 'login' ? 'Sign in to manage your finances.' : 'Register for a new FinDash account.'}</p>
        </header>

        {(localError || error) && (
          <div className="error-banner">
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="auth-username">Username</label>
            <input
              id="auth-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className={`btn-primary ${mode === 'register' ? 'btn-register' : 'btn-primary'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {mode === 'login'
              ? "Don't have an account?"
              : 'Already registered?'}
            <button type="button" onClick={toggleMode} className="link-button">
              {mode === 'login' ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
