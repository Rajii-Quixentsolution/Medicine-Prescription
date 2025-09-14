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

// Responsive Header styles
const headerStyles = {
  header: {
    background: 'white',
    borderBottom: '3px solid #194F7F',
    padding: '1rem',
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
    width: '100%',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  headerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexShrink: 0,
    minWidth: '0', // Allow text to shrink
  },
  headerLogo: {
    height: '50px',
    width: 'auto',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
    color: '#194F7F',
    letterSpacing: '-0.025em',
    transition: 'color 0.3s ease',
    lineHeight: 1.2,
    wordBreak: 'break-word' as const,
  },
  logoutBtn: {
    background: '#194F7F',
    color: 'white',
    border: '2px solid #194F7F',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
  logoutBtnHover: {
    background: '#0f3a5f',
    borderColor: '#0f3a5f',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(25, 79, 127, 0.3)',
  },
  mobileMenuBtn: {
    background: 'transparent',
    border: '2px solid #194F7F',
    color: '#194F7F',
    padding: '0.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.25rem',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
  },
  headerNav: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap' as const,
    width: '100%',
    transition: 'all 0.3s ease',
  },
  headerNavMobile: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    width: '100%',
    maxHeight: 0,
    overflow: 'hidden',
    transition: 'max-height 0.3s ease, padding 0.3s ease',
  },
  headerNavMobileOpen: {
    maxHeight: '400px',
    paddingTop: '1rem',
  },
  navBtn: {
    background: '#f8fafc',
    color: '#64748b',
    border: '2px solid #e2e8f0',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    textAlign: 'center' as const,
    whiteSpace: 'nowrap' as const,
    flex: '1',
    minWidth: '120px',
  },
  navBtnMobile: {
    flex: 'none',
    width: '100%',
    minWidth: 'auto',
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

// Media query breakpoints (we'll handle these with JavaScript since we can't use CSS media queries in inline styles)
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onLogout, currentUser }) => {
  const [isHovered, setIsHovered] = useState<{[key: string]: boolean}>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Media queries
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');

  // Hover effect handlers
  const handleMouseEnter = (btn: string) => {
    setIsHovered(prev => ({ ...prev, [btn]: true }));
  };

  const handleMouseLeave = (btn: string) => {
    setIsHovered(prev => ({ ...prev, [btn]: false }));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Dynamic styles based on screen size
  const getResponsiveStyles = () => {
    if (isSmallMobile) {
      return {
        headerTitle: {
          ...headerStyles.headerTitle,
          fontSize: '1rem',
          display: 'none', // Hide title on very small screens
        },
        headerLogo: {
          ...headerStyles.headerLogo,
          height: '40px',
        },
        logoutBtn: {
          ...headerStyles.logoutBtn,
          padding: '0.5rem 0.75rem',
          fontSize: '0.75rem',
        },
        container: {
          ...headerStyles.container,
          padding: '0 0.5rem',
        },
        mobileMenuBtn: {
          ...headerStyles.mobileMenuBtn,
          display: 'flex',
        },
      };
    }
    
    if (isMobile) {
      return {
        headerTitle: {
          ...headerStyles.headerTitle,
          fontSize: '1.25rem',
        },
        headerLogo: {
          ...headerStyles.headerLogo,
          height: '45px',
        },
        logoutBtn: {
          ...headerStyles.logoutBtn,
          padding: '0.5rem 1rem',
        },
        container: {
          ...headerStyles.container,
          padding: '0 1rem',
        },
        mobileMenuBtn: {
          ...headerStyles.mobileMenuBtn,
          display: 'flex',
        },
      };
    }
    
    if (isTablet) {
      return {
        headerTitle: {
          ...headerStyles.headerTitle,
          fontSize: '1.375rem',
        },
        headerLogo: {
          ...headerStyles.headerLogo,
          height: '48px',
        },
        logoutBtn: headerStyles.logoutBtn,
        container: headerStyles.container,
        mobileMenuBtn: {
          ...headerStyles.mobileMenuBtn,
          display: 'none',
        },
      };
    }
    
    return {
      headerTitle: headerStyles.headerTitle,
      headerLogo: headerStyles.headerLogo,
      logoutBtn: headerStyles.logoutBtn,
      container: headerStyles.container,
      mobileMenuBtn: {
        ...headerStyles.mobileMenuBtn,
        display: 'none',
      },
    };
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <header style={headerStyles.header}>
      <div style={{ ...headerStyles.container, ...responsiveStyles.container }}>
        <div style={headerStyles.headerTop}>
          <div style={headerStyles.headerBrand}>
            <img 
              src="/quixent_updated_logo.png" 
              alt="Quixent Logo" 
              style={responsiveStyles.headerLogo}
            />
            {!isSmallMobile && (
              <h1 style={responsiveStyles.headerTitle}>MEDICAL BILLING MANAGEMENT</h1>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isMobile && (
              <button 
                style={responsiveStyles.mobileMenuBtn}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            )}
            <button 
              style={{
                ...responsiveStyles.logoutBtn,
                ...(isHovered.logout ? headerStyles.logoutBtnHover : {})
              }}
              onMouseEnter={() => handleMouseEnter('logout')}
              onMouseLeave={() => handleMouseLeave('logout')}
              onClick={onLogout}
            >
              LOGOUT
            </button>
          </div>
        </div>
        
        <nav 
          style={
            isMobile 
              ? {
                  ...headerStyles.headerNavMobile,
                  ...(mobileMenuOpen ? headerStyles.headerNavMobileOpen : {})
                }
              : headerStyles.headerNav
          }
        >
          <button
            onClick={() => handleTabClick('stores')}
            style={{
              ...headerStyles.navBtn,
              ...(isMobile ? headerStyles.navBtnMobile : {}),
              ...(activeTab === 'stores' ? headerStyles.navBtnActive : {}),
              ...(isHovered.stores ? (activeTab === 'stores' ? headerStyles.navBtnActiveHover : headerStyles.navBtnHover) : {})
            }}
            onMouseEnter={() => handleMouseEnter('stores')}
            onMouseLeave={() => handleMouseLeave('stores')}
          >
            STORE MANAGEMENT
          </button>
          <button
            onClick={() => handleTabClick('medicines')}
            style={{
              ...headerStyles.navBtn,
              ...(isMobile ? headerStyles.navBtnMobile : {}),
              ...(activeTab === 'medicines' ? headerStyles.navBtnActive : {}),
              ...(isHovered.medicines ? (activeTab === 'medicines' ? headerStyles.navBtnActiveHover : headerStyles.navBtnHover) : {})
            }}
            onMouseEnter={() => handleMouseEnter('medicines')}
            onMouseLeave={() => handleMouseLeave('medicines')}
          >
            MEDICINE INVENTORY
          </button>
          <button
            onClick={() => handleTabClick('prescriptions')}
            style={{
              ...headerStyles.navBtn,
              ...(isMobile ? headerStyles.navBtnMobile : {}),
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
              onClick={() => handleTabClick('users')}
              style={{
                ...headerStyles.navBtn,
                ...(isMobile ? headerStyles.navBtnMobile : {}),
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