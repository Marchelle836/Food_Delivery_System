import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginRequest } from '../types/auth';
import '../App.css';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
  e.preventDefault();
  
  if (!formData.email || !formData.password) {
    setError('Email dan password harus diisi');
    return;
  }

  setLoading(true);
  setError('');

  try {
    console.log('🔄 Attempting login with:', formData.email);
    const response = await login(formData);
    console.log('✅ Login response:', response);
    
    // Cek token di localStorage setelah login
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log('🔐 Token stored:', token ? 'YES' : 'NO');
    console.log('👤 User stored:', user ? 'YES' : 'NO');
    
    navigate(from, { replace: true });
  } catch (error: any) {
    console.error('❌ Login error:', error);
    setError(error.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h1>🍽️ Sistem Pemesanan Restoran</h1>
          <h2>Login</h2>
          <p>Silakan masuk untuk melanjutkan</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email Anda"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password Anda"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Demo: gunakan email: admin@example.com, password: password</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;