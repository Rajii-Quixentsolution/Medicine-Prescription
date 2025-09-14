import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Store as StoreIcon } from 'lucide-react';
import { IUser } from '../types';

interface IStore {
  _id: string;
  name: string;
  createdAt?: string;
}

interface StoreFormData {
  name: string;
}

interface StoreOperations {
  create: (storeData: { name: string }) => Promise<any>;
  update: (id: string, storeData: { name: string }) => Promise<any>;
  delete: (id: string) => Promise<void>;
}

interface StoreProps {
  stores: IStore[];
  setStores: React.Dispatch<React.SetStateAction<IStore[]>>;
  storeOperations: StoreOperations;
  currentUser: IUser | null;
}

const Store: React.FC<StoreProps> = ({ stores, setStores, storeOperations, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState<IStore | null>(null);
  const [formData, setFormData] = useState<StoreFormData>({ name: '' });
  const [loading, setLoading] = useState(false);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      if (editingStore) {
        await storeOperations.update(editingStore._id, { name: formData.name });
      } else {
        await storeOperations.create({ name: formData.name });
      }
      resetForm();
    } catch (error) {
      console.error('Operation failed:', error);
      alert('Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (store: IStore) => {
    setEditingStore(store);
    setFormData({ name: store.name });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      setLoading(true);
      try {
        await storeOperations.delete(id);
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Delete failed. This store may have associated medicines or prescriptions.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingStore(null);
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <StoreIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Store Management</h1>
        </div>
        {currentUser?.type === 'admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            <Plus className="w-4 h-4" />
            Add Store
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search stores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Store Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              {currentUser?.type === 'admin' && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <tr key={store._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {store.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.createdAt}
                  </td>
                  {currentUser?.type === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(store)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        disabled={loading}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(store._id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No stores found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingStore ? 'Edit Store' : 'Add New Store'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter store name"
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (editingStore ? 'Update' : 'Add')} Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
