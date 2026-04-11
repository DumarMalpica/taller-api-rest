import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { success, message } = await login(username, password);
    if (!success) {
      setError(message);
    }
    setIsLoading(false);
  };

  const handleDemoFill = (type) => {
    if (type === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('user');
      setPassword('user123');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%', padding: '20px' }}>
      <div className="glass-panel animate-enter" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--clr-primary)', borderRadius: '50%', display: 'inline-flex', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
              <LogIn color="white" size={32} />
            </div>
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--clr-text-muted)' }}>Sign in to manage your system</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--clr-danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <span style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--clr-text-muted)' }}>
              <User size={18} />
            </span>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Username" 
              style={{ paddingLeft: '2.5rem', marginBottom: 0 }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <span style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--clr-text-muted)' }}>
              <Lock size={18} />
            </span>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Password" 
              style={{ paddingLeft: '2.5rem', marginBottom: 0 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--clr-bg-elevated)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', textAlign: 'center', marginBottom: '1rem' }}>Or use demo credentials</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={() => handleDemoFill('admin')} className="btn" style={{ flex: 1, background: 'var(--clr-bg-elevated)', color: 'var(--clr-text-main)', fontSize: '0.8rem', padding: '0.5rem' }}>Admin Demo</button>
            <button type="button" onClick={() => handleDemoFill('user')} className="btn" style={{ flex: 1, background: 'var(--clr-bg-elevated)', color: 'var(--clr-text-main)', fontSize: '0.8rem', padding: '0.5rem' }}>User Demo</button>
          </div>
        </div>
      </div>
    </div>
  );
}
