// client/src/App.tsx
import React, { useState, useEffect, CSSProperties } from 'react';
import './App.css';
import StoreComponent from './components/Store';
import MedicineComponent from './components/Medicine';
import PrescriptionBilling from './components/Billing';
import { storeAPI, medicineAPI, billingAPI, userAPI } from './services/api';
import { IStore, IMedicine, IBilling, IUser } from './types'; // Import shared interfaces
import Login from './components/Login';
import UserComponent from './components/User';

type ActiveTab = 'stores' | 'medicines' | 'prescriptions' | 'users';

// Header styles
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
  headerDark: {
    background: '#1f2937',
    borderBottom: '3px solid #3b82f6',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
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
  headerTitleDark: {
    color: '#60a5fa',
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

function App() {
  // State hooks
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState<ActiveTab>('stores');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHovered, setIsHovered] = useState<{[key: string]: boolean}>({});
  
  // Shared state for all components
  const [stores, setStores] = useState<IStore[]>([]);
  const [medicines, setMedicines] = useState<IMedicine[]>([]);
  const [billings, setBillings] = useState<IBilling[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  
  // Dark mode effect
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // Load all data when component mounts
  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const user = await userAPI.me();
          setCurrentUser(user);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUser();
      loadAllData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load all data in parallel
      const [storesData, medicinesData, billingsData] = await Promise.all([
        storeAPI.getAll(),
        medicineAPI.getAll(), 
        billingAPI.getAll()
      ]);
      
      setStores(storesData);
      setMedicines(medicinesData);
      setBillings(billingsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please make sure the backend server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  // Store operations
  const storeOperations = {
    create: async (storeData: { name: string }) => {
      try {
        const newStore = await storeAPI.create(storeData);
        setStores(prev => [...prev, newStore]);
        return newStore;
      } catch (error) {
        console.error('Error creating store:', error);
        throw error;
      }
    },
    update: async (id: string, storeData: { name: string }) => {
      try {
        const updatedStore = await storeAPI.update(id, storeData);
        setStores(prev => prev.map(store => 
          store._id === id ? updatedStore : store
        ));
        return updatedStore;
      } catch (error) {
        console.error('Error updating store:', error);
        throw error;
      }
    },
    delete: async (id: string) => {
      try {
        await storeAPI.delete(id);
        setStores(prev => prev.filter(store => store._id !== id));
      } catch (error) {
        console.error('Error deleting store:', error);
        throw error;
      }
    }
  };

  // Medicine operations
  const medicineOperations = {
    create: async (medicineData: any) => {
      try {
        const newMedicine = await medicineAPI.create(medicineData);
        setMedicines(prev => [...prev, newMedicine]);
        return newMedicine;
      } catch (error) {
        console.error('Error creating medicine:', error);
        throw error;
      }
    },
    update: async (id: string, medicineData: any) => {
      try {
        const updatedMedicine = await medicineAPI.update(id, medicineData);
        setMedicines(prev => prev.map(medicine => 
          medicine._id === id ? updatedMedicine : medicine
        ));
        return updatedMedicine;
      } catch (error) {
        console.error('Error updating medicine:', error);
        throw error;
      }
    },
    delete: async (id: string) => {
      try {
        await medicineAPI.delete(id);
        setMedicines(prev => prev.filter(medicine => medicine._id !== id));
      } catch (error) {
        console.error('Error deleting medicine:', error);
        throw error;
      }
    }
  };

  // Billing operations
  const billingOperations = {
    create: async (billingData: any) => {
      try {
        const newBilling = await billingAPI.create(billingData);
        setBillings(prev => [...prev, newBilling]);
        return newBilling;
      } catch (error) {
        console.error('Error creating billing:', error);
        throw error;
      }
    },
    update: async (id: string, billingData: any) => {
      try {
        const updatedBilling = await billingAPI.update(id, billingData);
        setBillings(prev => prev.map(billing => 
          billing._id === id ? updatedBilling : billing
        ));
        return updatedBilling;
      } catch (error) {
        console.error('Error updating billing:', error);
        throw error;
      }
    },
    delete: async (id: string) => {
      try {
        await billingAPI.delete(id);
        setBillings(prev => prev.filter(billing => billing._id !== id));
      } catch (error) {
        console.error('Error deleting billing:', error);
        throw error;
      }
    }
  };

  if (!token) {
    return <Login />;
  }

  if (loading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <div>Loading data from server...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          textAlign: 'center'
        }}>
          <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
          <button 
            onClick={loadAllData}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'stores':
        return <StoreComponent 
          stores={stores} 
          setStores={setStores}
          storeOperations={storeOperations}
        />;
      case 'medicines':
        return <MedicineComponent 
          stores={stores} 
          medicines={medicines} 
          setMedicines={setMedicines}
          medicineOperations={medicineOperations}
        />;
      case 'prescriptions':
        return <PrescriptionBilling 
          stores={stores}
          medicines={medicines}
          billings={billings}
          setBillings={setBillings}
          billingOperations={billingOperations}
        />;
      case 'users':
        return <UserComponent stores={stores} />;
      default:
        return <StoreComponent 
          stores={stores} 
          setStores={setStores}
          storeOperations={storeOperations}
        />;
    }
  };

  // Combine styles based on dark mode
  const headerStyle = {
    ...headerStyles.header,
    ...(isDarkMode ? headerStyles.headerDark : {})
  };

  const titleStyle = {
    ...headerStyles.headerTitle,
    ...(isDarkMode ? headerStyles.headerTitleDark : {})
  };

  // Hover effect handlers
  const handleMouseEnter = (btn: string) => {
    setIsHovered(prev => ({ ...prev, [btn]: true }));
  };

  const handleMouseLeave = (btn: string) => {
    setIsHovered(prev => ({ ...prev, [btn]: false }));
  };

  return (
    <div className="App">
      <header style={headerStyle}>
        <div style={headerStyles.container}>
          <div style={headerStyles.headerTop}>
            <div style={headerStyles.headerBrand}>
              <img 
                src="/quixent_updated_logo.png" 
                alt="Quixent Logo" 
                style={headerStyles.headerLogo}
              />
              <h1 style={titleStyle}>MEDICAL BILLING MANAGEMENT</h1>
            </div>
            {token && (
              <button 
                style={{
                  ...headerStyles.logoutBtn,
                  ...(isHovered.logout ? headerStyles.logoutBtnHover : {})
                }}
                onMouseEnter={() => handleMouseEnter('logout')}
                onMouseLeave={() => handleMouseLeave('logout')}
                onClick={handleLogout}
              >
                LOGOUT
              </button>
            )}
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
      
      <main>
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App;
