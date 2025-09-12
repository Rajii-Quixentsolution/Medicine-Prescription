import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, FileText, Clock, Printer } from 'lucide-react';
import { IStore, IMedicine, IBilling } from '../types'; // Import shared interfaces
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the plugin

interface BillingFormData {
  medicineId: string;
  storeId: string;
  frequency: 'morning' | 'evening';
  name: string;
  number: string;
  description: string; // Added description field
}

interface BillingOperations {
  create: (billingData: BillingFormData) => Promise<any>;
  update: (id: string, billingData: BillingFormData) => Promise<any>;
  delete: (id: string) => Promise<void>;
}

interface BillingProps {
  stores: IStore[];
  medicines: IMedicine[];
  billings: IBilling[];
  setBillings: React.Dispatch<React.SetStateAction<IBilling[]>>;
  billingOperations: BillingOperations;
}

const Billing: React.FC<BillingProps> = ({ 
  stores, 
  medicines, 
  billings, 
  setBillings, 
  billingOperations 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBilling, setEditingBilling] = useState<IBilling | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BillingFormData>({
    medicineId: '',
    storeId: '',
    frequency: 'morning',
    name: '',
    number: '',
    description: '' // Initialize description
  });

  const getStoreName = (store: IStore) => {
    return store?.name || 'Unknown Store';
  };

  const getMedicineName = (medicine: IMedicine) => {
    return medicine?.name || 'Unknown Medicine';
  };

  // Filter medicines by selected store
  const getAvailableMedicines = () => {
    if (!formData.storeId) return [];
    return medicines.filter(medicine => medicine.storeId._id === formData.storeId);
  };

  const filteredBillings = billings.filter(billing =>
    billing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    billing.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getMedicineName(billing.medicineId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getStoreName(billing.storeId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.medicineId || !formData.storeId || !formData.name.trim() || !formData.number.trim()) {
      return;
    }

    setLoading(true);
    try {
      if (editingBilling) {
        await billingOperations.update(editingBilling._id, formData);
      } else {
        await billingOperations.create(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving billing record:', error);
      alert('Failed to save billing record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (billing: IBilling) => {
    setEditingBilling(billing);
    setFormData({
      medicineId: billing.medicineId._id, // Access _id for form input
      storeId: billing.storeId._id, // Access _id for form input
      frequency: billing.frequency,
      name: billing.name,
      number: billing.number,
      description: billing.description || '' // Set description for editing
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this billing record?')) {
      setLoading(true);
      try {
        await billingOperations.delete(id);
      } catch (error) {
        console.error('Error deleting billing record:', error);
        alert('Failed to delete billing record. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      medicineId: '', 
      storeId: '', 
      frequency: 'morning', 
      name: '', 
      number: '',
      description: ''
    });
    setEditingBilling(null);
    setShowModal(false);
  };

  const handlePrint = (billing: IBilling) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Prescription/Billing Receipt', 14, 25);
    
    // Add a line
    doc.line(14, 30, 196, 30);
    
    // Patient details
    doc.setFontSize(14);
    doc.text('Patient Information:', 14, 45);
    
    doc.setFontSize(12);
    doc.text(`Patient Name: ${billing.name}`, 20, 55);
    doc.text(`Contact/Prescription No: ${billing.number}`, 20, 65);
    
    // Handle long descriptions with text wrapping
    if (billing.description) {
      doc.text('Description/Problem:', 20, 75);
      const splitDescription = doc.splitTextToSize(billing.description, 160);
      doc.text(splitDescription, 20, 85);
    } else {
      doc.text('Description/Problem: N/A', 20, 75);
    }
    
    // Prescription details
    doc.setFontSize(14);
    doc.text('Prescription Details:', 14, 115);
    
    doc.setFontSize(12);
    doc.text(`Medicine: ${getMedicineName(billing.medicineId)}`, 20, 125);
    doc.text(`Store: ${getStoreName(billing.storeId)}`, 20, 135);
    doc.text(`Frequency: ${billing.frequency}`, 20, 145);
    doc.text(`Date: ${billing.createdAt ? new Date(billing.createdAt).toLocaleDateString() : 'N/A'}`, 20, 155);
    
    // Create a simple table manually for prescription
    doc.setFontSize(14);
    doc.text('Prescription Summary:', 14, 175);
    
    // Table headers
    doc.setFontSize(10);
    doc.rect(14, 185, 90, 10); // Medicine column
    doc.rect(104, 185, 50, 10); // Frequency column
    
    doc.text('Medicine', 16, 192);
    doc.text('Frequency', 106, 192);
    
    // Table data
    doc.rect(14, 195, 90, 10);
    doc.rect(104, 195, 50, 10);
    
    const medicineName = getMedicineName(billing.medicineId);
    doc.text(medicineName.length > 35 ? medicineName.substring(0, 35) + '...' : medicineName, 16, 202);
    doc.text(billing.frequency.charAt(0).toUpperCase() + billing.frequency.slice(1), 106, 202);
    
    // Add footer
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 280);
    
    doc.save(`receipt-${billing.name}-${billing.number}.pdf`);
  };

  // Handle store change and reset medicine selection
  const handleStoreChange = (storeId: string) => {
    setFormData({ ...formData, storeId, medicineId: '' });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Billing Management</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          Add Billing
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by patient name, number, medicine or store..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded-lg">
          Processing request...
        </div>
      )}

      {/* Billing Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact/Prescription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medicine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Store
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frequency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBillings.length > 0 ? (
              filteredBillings.map((billing) => (
                <tr key={billing._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {billing.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {billing.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {billing.description || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getMedicineName(billing.medicineId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStoreName(billing.storeId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      billing.frequency === 'morning' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {billing.frequency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {billing.createdAt ? new Date(billing.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handlePrint(billing)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      disabled={loading}
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(billing)}
                      className="text-purple-600 hover:text-purple-900 mr-3"
                      disabled={loading}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(billing._id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  {searchTerm ? 'No billing records found matching your search' : 'No billing records found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingBilling ? 'Edit Billing Record' : 'Add New Billing Record'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter patient name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number 
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter contact "
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Problem)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., What disease is this prescription for?"
                  rows={3}
                  disabled={loading}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store
                </label>
                <select
                  value={formData.storeId}
                  onChange={(e) => handleStoreChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                  disabled={loading}
                >
                  <option value="">Select a store</option>
                  {stores.map(store => (
                    <option key={store._id} value={store._id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine
                </label>
                <select
                  value={formData.medicineId}
                  onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                  disabled={!formData.storeId || loading}
                >
                  <option value="">Select a medicine</option>
                  {getAvailableMedicines().map(medicine => (
                    <option key={medicine._id} value={medicine._id}>
                      {medicine.name}
                    </option>
                  ))}
                </select>
                {!formData.storeId && (
                  <p className="text-sm text-gray-500 mt-1">Please select a store first</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'morning' | 'evening' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                  disabled={loading}
                >
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                </select>
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (editingBilling ? 'Update' : 'Add')} Billing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing; 