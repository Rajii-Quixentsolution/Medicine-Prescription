import React, { useState, CSSProperties } from 'react';
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

  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: '15px',
    boxSizing: 'border-box' as const
  };

  const formStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '6px',
    textAlign: 'center' as const,
    width: '100%',
    maxWidth: '320px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #dddfe2'
  };

  const logoContainerStyle: CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '10px 0',
    borderRadius: '6px',
    marginBottom: '15px'
  };

  const logoStyle: CSSProperties = {
    width: '180px',
    height: 'auto',
    display: 'block',
    objectFit: 'contain'
  };

  const titleStyle = {
    color: '#194F7F',
    marginBottom: '20px',
    fontWeight: 600,
    fontSize: '18px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px'
  };

  const inputGroupStyle = {
    marginBottom: '15px',
    textAlign: 'left' as const
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    color: '#606770',
    fontWeight: 500
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid #dddfe2',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    color: '#1c1e21',
    boxSizing: 'border-box' as const,
    fontSize: '14px'
  };

  const inputFocusStyle: CSSProperties = {
    outline: 'none',
    borderColor: '#194F7F',
    boxShadow: '0 0 0 2px rgba(25, 79, 127, 0.25)'
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#194F7F',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'background-color 0.2s ease-in-out'
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#0f3a5f'
  };

  const errorStyle = {
    color: '#ff4d4d',
    margin: '10px 0',
    fontSize: '13px'
  };

  const footerStyle = {
    marginTop: '20px',
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#606770'
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <div style={logoContainerStyle}>
          <img
            src="/quixent_updated_logo.png"
            alt="Quixent Logo"
            style={logoStyle}
          />
        </div>
        
        <h1 style={titleStyle}>MEDICAL BILLING MANAGEMENT</h1>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <div style={inputGroupStyle}>
          <div style={labelStyle}>Username or Email</div>
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
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => {
              const input = e.target as HTMLInputElement;
              Object.keys(inputStyle).forEach(key => {
                input.style[key as any] = '';
              });
              Object.assign(input.style, inputStyle);
            }}
          />
        </div>

        <div style={inputGroupStyle}>
          <div style={labelStyle}>Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => {
              const input = e.target as HTMLInputElement;
              Object.keys(inputStyle).forEach(key => {
                input.style[key as any] = '';
              });
              Object.assign(input.style, inputStyle);
            }}
          />
        </div>

        <button 
          type="submit" 
          style={isHovered ? buttonHoverStyle : buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Login
        </button>

        <div style={footerStyle}>
          Secure access to your medical billing dashboard
        </div>
      </form>
    </div>
  );
};

export default Login;