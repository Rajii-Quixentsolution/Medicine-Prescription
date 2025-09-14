// client/src/components/Header.tsx
import React, { useState } from 'react';
import { IUser } from '../types';

type ActiveTab = 'stores' | 'medicines' | 'prescriptions' | 'users';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLogout: () => void;
  currentUser: IUser | null;
}

// Header styles - Light theme only
const headerStyles = {
  header: {
    background: 'white',
    borderBottom: '3px solid #194F7F',
    padding: '1rem 2rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  headerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  headerLogo: {
    height: '60px',
    width: 'auto',
  },
  headerTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    margin: 0,
    color: '#194F7F',
    letterSpacing: '-0.025em',
    transition: 'color 0.3s ease',
  },
  logoutBtn: {
    background: '#194F7F',
    color: 'white',
    border: '2px solid #194F7F',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  logoutBtnHover: {
    background: '#0f3a5f',
    borderColor: '#0f3a5f',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(25, 79, 127, 0.3)',
  },
  headerNav: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap' as const,
  },
  navBtn: {
    background: '#f8fafc',
    color: '#64748b',
    border: '2px solid #e2e8f0',
    padding: '0.875rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  navBtnHover: {
    background: '#e2e8f0',
    color: '#194F7F',
    borderColor: '#cbd5e1',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(25, 79, 127, 0.15)',
  },
  navBtnActive: {
    background: '#194F7F',
    color: 'white',
    borderColor: '#194F7F',
    boxShadow: '0 4px 12px rgba(25, 79, 127, 0.3)',
  },
  navBtnActiveHover: {
    background: '#0f3a5f',
    borderColor: '#0f3a5f',
    boxShadow: '0 6px 16px rgba(25, 79, 127, 0.4)',
  },
};

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onLogout, currentUser }) => {
  const [isHovered, setIsHovered] = useState<{[key: string]: boolean}>({});

  // Hover effect handlers
  const handleMouseEnter = (btn: string) => {
    setIsHovered(prev => ({ ...prev, [btn]: true }));
  };

  const handleMouseLeave = (btn: string) => {
    setIsHovered(prev => ({ ...prev, [btn]: false }));
  };

  return (
    <header style={headerStyles.header}>
      <div style={headerStyles.container}>
        <div style={headerStyles.headerTop}>
          <div style={headerStyles.headerBrand}>
            <img 
              src="/quixent_updated_logo.png" 
              alt="Quixent Logo" 
              style={headerStyles.headerLogo}
            />
            <h1 style={headerStyles.headerTitle}>MEDICAL BILLING MANAGEMENT</h1>
          </div>
          <button 
            style={{
              ...headerStyles.logoutBtn,
              ...(isHovered.logout ? headerStyles.logoutBtnHover : {})
            }}
            onMouseEnter={() => handleMouseEnter('logout')}
            onMouseLeave={() => handleMouseLeave('logout')}
            onClick={onLogout}
          >
            LOGOUT
          </button>
        </div>
        
        <nav style={headerStyles.headerNav}>
          <button
            onClick={() => setActiveTab('stores')}
            style={{
              ...headerStyles.navBtn,
              ...(activeTab === 'stores' ? headerStyles.navBtnActive : {}),
              ...(isHovered.stores ? (activeTab === 'stores' ? headerStyles.navBtnActiveHover : headerStyles.navBtnHover) : {})
            }}
            onMouseEnter={() => handleMouseEnter('stores')}
            onMouseLeave={() => handleMouseLeave('stores')}
          >
            STORE MANAGEMENT
          </button>
          <button
            onClick={() => setActiveTab('medicines')}
            style={{
              ...headerStyles.navBtn,
              ...(activeTab === 'medicines' ? headerStyles.navBtnActive : {}),
              ...(isHovered.medicines ? (activeTab === 'medicines' ? headerStyles.navBtnActiveHover : headerStyles.navBtnHover) : {})
            }}
            onMouseEnter={() => handleMouseEnter('medicines')}
            onMouseLeave={() => handleMouseLeave('medicines')}
          >
            MEDICINE INVENTORY
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            style={{
              ...headerStyles.navBtn,
              ...(activeTab === 'prescriptions' ? headerStyles.navBtnActive : {}),
              ...(isHovered.prescriptions ? (activeTab === 'prescriptions' ? headerStyles.navBtnActiveHover : headerStyles.navBtnHover) : {})
            }}
            onMouseEnter={() => handleMouseEnter('prescriptions')}
            onMouseLeave={() => handleMouseLeave('prescriptions')}
          >
            PRESCRIPTION BILLING
          </button>
          {currentUser?.type === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              style={{
                ...headerStyles.navBtn,
                ...(activeTab === 'users' ? headerStyles.navBtnActive : {}),
                ...(isHovered.users ? (activeTab === 'users' ? headerStyles.navBtnActiveHover : headerStyles.navBtnHover) : {})
              }}
              onMouseEnter={() => handleMouseEnter('users')}
              onMouseLeave={() => handleMouseLeave('users')}
            >
              USER MANAGEMENT
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;