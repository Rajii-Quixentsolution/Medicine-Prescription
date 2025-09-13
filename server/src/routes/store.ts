import express, { Request, Response } from 'express';
import Store from '../models/Store';
import Medicine from '../models/Medicine';
import Billing from '../models/Billing';
import { AuthRequest, auth, isAdmin } from '../middleware/auth';

const router = express.Router();

// Get all stores
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    let stores;
    if (user.type === 'admin') {
      stores = await Store.find();
    }
    else {
      stores = await Store.find({ _id: user.storeId });
    }
    res.json(stores);
  }
  catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Get a single store by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    res.json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ error: 'Failed to fetch store' });
  }
});

// Get medicines by store
router.get('/:id/medicines', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if store exists
    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const medicines = await Medicine.find({ storeId: id });
    res.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines for store:', error);
    res.status(500).json({ error: 'Failed to fetch medicines for store' });
  }
});

// Create a new store
router.post('/', auth, isAdmin, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Store name is required' });
    }
    
    // Check if store name already exists
    const existingStore = await Store.findOne({ name: name.trim() });
    
    if (existingStore) {
      return res.status(400).json({ error: 'Store name already exists' });
    }
    
    const store = await Store.create({ name: name.trim() });
    
    res.status(201).json(store);
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({ error: 'Failed to create store' });
  }
});

// Update a store
router.put('/:id', auth, isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Store name is required' });
    }
    
    // Check if another store has the same name
    const existingStore = await Store.findOne({ 
      name: name.trim(), 
      _id: { $ne: id } 
    });
    
    if (existingStore) {
      return res.status(400).json({ error: 'Store name already exists' });
    }
    
    const store = await Store.findByIdAndUpdate(
      id, 
      { name: name.trim() }, 
      { new: true }
    );
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(store);
  } catch (error) {
    console.error('Error updating store:', error);
    res.status(500).json({ error: 'Failed to update store' });
  }
});

// Delete a store
router.delete('/:id', auth, isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if store has medicines
    const medicines = await Medicine.find({ storeId: id });
    
    if (medicines.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete store with existing medicines. Please delete medicines first.' 
      });
    }
    
    // Check if store has billing records
    const billings = await Billing.find({ storeId: id });
    
    if (billings.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete store with existing prescriptions. Please delete prescriptions first.' 
      });
    }
    
    const store = await Store.findByIdAndDelete(id);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({ message: 'Store deleted successfully', store });
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({ error: 'Failed to delete store' });
  }
});

export default router;
