// client/src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import StoreComponent from './components/Store';
import MedicineComponent from './components/Medicine';
import PrescriptionBilling from './components/Billing';
import { storeAPI, medicineAPI, billingAPI, userAPI } from './services/api';
import { IStore, IMedicine, IBilling, IUser } from './types'; // Import shared interfaces
import Login from './components/Login';
import UserComponent from './components/User';
import Header from './components/Header';

type ActiveTab = 'stores' | 'medicines' | 'prescriptions' | 'users';

function App() {
  // State hooks
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState<ActiveTab>('stores');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Shared state for all components
  const [stores, setStores] = useState<IStore[]>([]);
  const [medicines, setMedicines] = useState<IMedicine[]>([]);
  const [billings, setBillings] = useState<IBilling[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

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
          currentUser={currentUser}
        />;
      case 'medicines':
        return <MedicineComponent 
          stores={stores} 
          medicines={medicines} 
          setMedicines={setMedicines}
          medicineOperations={medicineOperations}
          currentUser={currentUser}
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
          currentUser={currentUser}
        />;
    }
  };

  return (
    <div className="App">
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      
      <main>
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App;
