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

  // Define style types
  type InputStyle = CSSProperties & {
    '&:focus'?: CSSProperties;
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 100px)',
    backgroundColor: '#f0f2f5',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: '20px',
    boxSizing: 'border-box' as const
  };

  // Add keyframes for fadeInUp animation
  const keyframesStyle = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  const formStyle = {
    backgroundColor: '#ffffff',
    padding: '40px 30px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid #dddfe2'
  };

  const logoContainerStyle: CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '20px 0',
    borderRadius: '8px',
    marginBottom: '30px'
  };

  const logoStyle: CSSProperties = {
    width: '250px',
    height: 'auto',
    display: 'block',
    objectFit: 'contain'
  };

  const titleStyle = {
    color: '#194F7F',
    marginBottom: '35px',
    fontWeight: 700,
    fontSize: '24px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  };

  const inputGroupStyle = {
    marginBottom: '20px',
    textAlign: 'left' as const
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#606770',
    fontWeight: 500
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '12px',
    border: '1px solid #dddfe2',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#1c1e21',
    boxSizing: 'border-box' as const,
    fontSize: '16px'
  };

  const inputFocusStyle: CSSProperties = {
    outline: 'none',
    borderColor: '#194F7F',
    boxShadow: '0 0 0 2px rgba(25, 79, 127, 0.25)'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#194F7F',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s ease-in-out'
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#0f3a5f'
  };

  const errorStyle = {
    color: '#ff4d4d',
    margin: '15px 0',
    fontSize: '14px'
  };

  const footerStyle = {
    marginTop: '32px',
    textAlign: 'center' as const,
    fontSize: '14px',
    color: '#606770'
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <style>{keyframesStyle}</style>
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
    </div>
  );
};

export default Login;