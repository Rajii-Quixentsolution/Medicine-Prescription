export interface IStore {
  _id: string;
  name: string;
  createdAt?: string;
}

export interface IMedicine {
  _id: string;
  name: string;
  storeId: IStore;
  expirydate: string;
  stock: number;
}

export interface IBilling {
  _id: string;
  medicineId: IMedicine;
  storeId: IStore;
  frequency: 'morning' | 'evening';
  name: string;
  number: string;
  description?: string; // Added description field
  createdAt?: string;
}
