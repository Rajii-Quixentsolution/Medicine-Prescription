import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const credentials: { email?: string; username?: string; pwd?: string } = { pwd: password };
      if (username) {
        credentials.username = username;
      } else {
        credentials.email = email;
      }
      const data = await authAPI.login(credentials);
      localStorage.setItem('token', data.token);
      window.location.reload();
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="mb-6">
            {/* Quixent Logo - Made Bigger */}
            <img
              src="/quixent_updated_logo.png"
              alt="Quixent Logo"
              className="w-auto h-24 mx-auto mb-4"
            />
          </div>
                    
          <h2 className="text-xl font-semibold text-blue-800 mb-1">MEDICAL BILLING</h2>
          <h2 className="text-xl font-semibold text-blue-800 mb-8">MANAGEMENT</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Username or Email</label>
          <input
            type="text"
            value={email || username}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'admin') {
                setUsername(value);
                setEmail('');
              } else {
                setEmail(value);
                setUsername('');
              }
            }}
            placeholder="Enter your username or email"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
        >
          Login
        </button>

        {/* Optional: Footer text */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Secure access to your medical billing dashboard
        </div>
      </form>
    </div>
  );
};

export default Login;