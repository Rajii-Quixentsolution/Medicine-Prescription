// client/src/services/api.ts
const API_BASE_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleUnauthorized = (response: Response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.reload();
  }
};

const api = {
  get: async (url: string) => {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    handleUnauthorized(response);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return response.json();
  },

  post: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    handleUnauthorized(response);
    if (!response.ok) throw new Error(`Failed to post to ${url}`);
    return response.json();
  },

  put: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    handleUnauthorized(response);
    if (!response.ok) throw new Error(`Failed to put to ${url}`);
    return response.json();
  },

  delete: async (url: string) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    handleUnauthorized(response);
    if (!response.ok) throw new Error(`Failed to delete ${url}`);
    return response.json();
  },
};

export const authAPI = {
  login: async (credentials: any) => {
    return api.post(`${API_BASE_URL}/auth/login`, credentials);
  },
};

// Store API calls
export const storeAPI = {
  getAll: async () => {
    return api.get(`${API_BASE_URL}/stores`);
  },
  
  create: async (storeData: { name: string }) => {
    return api.post(`${API_BASE_URL}/stores`, storeData);
  },
  
  update: async (id: string, storeData: { name: string }) => {
    return api.put(`${API_BASE_URL}/stores/${id}`, storeData);
  },
  
  delete: async (id: string) => {
    return api.delete(`${API_BASE_URL}/stores/${id}`);
  }
};

// Medicine API calls
export const medicineAPI = {
  getAll: async () => {
    return api.get(`${API_BASE_URL}/medicines`);
  },
  
  create: async (medicineData: {
    name: string;
    storeId: string;
    expirydate: string;
    stock: number;
  }) => {
    return api.post(`${API_BASE_URL}/medicines`, medicineData);
  },
  
  update: async (id: string, medicineData: any) => {
    return api.put(`${API_BASE_URL}/medicines/${id}`, medicineData);
  },
  
  delete: async (id: string) => {
    return api.delete(`${API_BASE_URL}/medicines/${id}`);
  }
};

// Billing API calls  
export const billingAPI = {
  getAll: async () => {
    return api.get(`${API_BASE_URL}/billings`);
  },
  
  create: async (billingData: {
    medicineId: string;
    storeId: string;
    frequency: 'morning' | 'evening';
    name: string;
    number: string;
    description?: string; // Added description field
  }) => {
    return api.post(`${API_BASE_URL}/billings`, billingData);
  },
  
  update: async (id: string, billingData: {
    medicineId?: string;
    storeId?: string;
    frequency?: 'morning' | 'evening';
    name?: string;
    number?: string;
    description?: string; // Added description field
  }) => {
    return api.put(`${API_BASE_URL}/billings/${id}`, billingData);
  },
  
  delete: async (id: string) => {
    return api.delete(`${API_BASE_URL}/billings/${id}`);
  }
};

// User API calls
export const userAPI = {
  getAll: async () => {
    return api.get(`${API_BASE_URL}/users`);
  },
  
  create: async (userData: any) => {
    return api.post(`${API_BASE_URL}/users`, userData);
  },
  
  update: async (id: string, userData: any) => {
    return api.put(`${API_BASE_URL}/users/${id}`, userData);
  },
  
  delete: async (id: string) => {
    return api.delete(`${API_BASE_URL}/users/${id}`);
  },

  me: async () => {
    return api.get(`${API_BASE_URL}/auth/me`);
  }
};
