import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Search, Mail, Store } from 'lucide-react';
import { userAPI } from '../services/api';
import { IStore, IUser } from '../types';

interface UserComponentProps {
  stores: IStore[];
}

const UserComponent: React.FC<UserComponentProps> = ({ stores }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  // Form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeId, setStoreId] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userAPI.getAll();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getStoreName = (storeId: any) => {
    if (typeof storeId === 'string') {
      const store = stores.find(s => s._id === storeId);
      return store?.name || 'Unknown Store';
    }
    return storeId?.name || 'Unknown Store';
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getStoreName(user.storeId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !storeId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const newUser = await userAPI.create({ 
        email, 
        pwd: password, 
        storeId, 
        type: 'user' 
      });
      setUsers([...users, newUser]);
      resetForm();
      setError(null);
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !email.trim() || !storeId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const updatedUser = await userAPI.update(editingUser._id, {
        email,
        pwd: password || undefined,
        storeId,
      });
      setUsers(users.map(user => (user._id === editingUser._id ? updatedUser : user)));
      resetForm();
      setError(null);
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(id);
        setUsers(users.filter(user => user._id !== id));
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleEditClick = (user: IUser) => {
    setEditingUser(user);
    setEmail(user.email);
    const userStoreId = typeof user.storeId === 'string' ? user.storeId : user.storeId._id;
    setStoreId(userStoreId);
    setPassword('');
    setShowModal(true);
    setError(null);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setStoreId('');
    setEditingUser(null);
    setShowModal(false);
    setError(null);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by email or store..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  <div className="flex items-center gap-1">
                    <Store className="w-4 h-4" />
                    Store
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] sticky right-0 bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStoreName(user.storeId)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium sticky right-0 bg-white">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No users found matching your search' : 'No users found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password {editingUser ? '(leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={editingUser ? "Enter new password" : "Enter password"}
                  required={!editingUser}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store *
                </label>
                <select
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a store</option>
                  {stores.map(store => (
                    <option key={store._id} value={store._id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingUser ? 'Update' : 'Add'} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserComponent;