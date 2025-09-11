// client/src/services/api.ts
const API_BASE_URL = 'http://localhost:3001/api';

// Store API calls
export const storeAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/stores`);
    if (!response.ok) throw new Error('Failed to fetch stores');
    return response.json();
  },
  
  create: async (storeData: { name: string }) => {
    const response = await fetch(`${API_BASE_URL}/stores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeData)
    });
    if (!response.ok) throw new Error('Failed to create store');
    return response.json();
  },
  
  update: async (id: string, storeData: { name: string }) => {
    const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeData)
    });
    if (!response.ok) throw new Error('Failed to update store');
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete store');
    return response.json();
  }
};

// Medicine API calls
export const medicineAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/medicines`);
    if (!response.ok) throw new Error('Failed to fetch medicines');
    return response.json();
  },
  
  create: async (medicineData: {
    name: string;
    storeId: string;
    expirydate: string;
    stock: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicineData)
    });
    if (!response.ok) throw new Error('Failed to create medicine');
    return response.json();
  },
  
  update: async (id: string, medicineData: any) => {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicineData)
    });
    if (!response.ok) throw new Error('Failed to update medicine');
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete medicine');
    return response.json();
  }
};

// Billing API calls  
export const billingAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/billings`);
    if (!response.ok) throw new Error('Failed to fetch billings');
    return response.json();
  },
  
  create: async (billingData: {
    medicineId: string;
    storeId: string;
    frequency: 'morning' | 'evening';
    name: string;
    number: string;
    description?: string; // Added description field
  }) => {
    const response = await fetch(`${API_BASE_URL}/billings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billingData)
    });
    if (!response.ok) throw new Error('Failed to create billing');
    return response.json();
  },
  
  update: async (id: string, billingData: {
    medicineId?: string;
    storeId?: string;
    frequency?: 'morning' | 'evening';
    name?: string;
    number?: string;
    description?: string; // Added description field
  }) => {
    const response = await fetch(`${API_BASE_URL}/billings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billingData)
    });
    if (!response.ok) throw new Error('Failed to update billing');
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/billings/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete billing');
    return response.json();
  }
};
