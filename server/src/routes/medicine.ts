import express, { Request, Response } from 'express';
import Medicine from '../models/Medicine';
import Store from '../models/Store';
import Billing from '../models/Billing';
import { AuthRequest, auth, isAdmin } from '../middleware/auth';
const router = express.Router();

// Get all medicines with store information
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    let medicines;
    if (user.type === 'admin') {
      medicines = await Medicine.find().populate('storeId', 'name');
    }
    else {
      medicines = await Medicine.find({ storeId: user.storeId }).populate('storeId', 'name');
    }
    res.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

// Get medicines by store
router.get('/store/:storeId', async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    
    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const medicines = await Medicine.find({ storeId }).populate('storeId', 'name');
    res.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines for store:', error);
    res.status(500).json({ error: 'Failed to fetch medicines for store' });
  }
});

// Get a single medicine by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id).populate('storeId', 'name');
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (error) {
    console.error('Error fetching medicine:', error);
    res.status(500).json({ error: 'Failed to fetch medicine' });
  }
});

// Create a new medicine
router.post('/', auth, isAdmin, async (req: Request, res: Response) => {
  try {
    const { name, storeId, expirydate, stock } = req.body;
    
    // Validate required fields
    if (!name || !storeId || !expirydate || stock === undefined) {
      return res.status(400).json({ 
        error: 'All fields (name, storeId, expirydate, stock) are required' 
      });
    }
    
    // Validate stock is non-negative
    if (stock < 0) {
      return res.status(400).json({ error: 'Stock must be a non-negative number' });
    }
    
    // Check if store exists
    const existingStore = await Store.findById(storeId);
    if (!existingStore) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    // Validate expiry date
    const expiry = new Date(expirydate);
    if (isNaN(expiry.getTime())) {
      return res.status(400).json({ error: 'Invalid expiry date format' });
    }
    
    // Check if expiry date is in the past
    if (expiry < new Date()) {
      return res.status(400).json({ error: 'Expiry date cannot be in the past' });
    }
    
    const medicine = await Medicine.create({
      name: name.trim(),
      storeId,
      expirydate: expiry,
      stock,
    });
    
    const populatedMedicine = await Medicine.findById(medicine._id).populate('storeId', 'name');
    
    res.status(201).json(populatedMedicine);
  } catch (error) {
    console.error('Error creating medicine:', error);
    res.status(500).json({ error: 'Failed to create medicine' });
  }
});

// Update a medicine
router.put('/:id', auth, isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, storeId, expirydate, stock } = req.body;
    
    // Validate stock is non-negative if provided
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ error: 'Stock must be a non-negative number' });
    }
    
    // Check if store exists if storeId is provided
    if (storeId) {
      const existingStore = await Store.findById(storeId);
      if (!existingStore) {
        return res.status(404).json({ error: 'Store not found' });
      }
    }
    
    // Validate expiry date if provided
    let expiry;
    if (expirydate) {
      expiry = new Date(expirydate);
      if (isNaN(expiry.getTime())) {
        return res.status(400).json({ error: 'Invalid expiry date format' });
      }
      
      if (expiry < new Date()) {
        return res.status(400).json({ error: 'Expiry date cannot be in the past' });
      }
    }
    
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (storeId !== undefined) updateData.storeId = storeId;
    if (expirydate !== undefined) updateData.expirydate = expiry;
    if (stock !== undefined) updateData.stock = stock;
    
    const medicine = await Medicine.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('storeId', 'name');
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json(medicine);
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(500).json({ error: 'Failed to update medicine' });
  }
});

// Update medicine stock
router.patch('/:id/stock', auth, isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ error: 'Valid stock number is required' });
    }
    
    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    ).populate('storeId', 'name');
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json(medicine);
  } catch (error) {
    console.error('Error updating medicine stock:', error);
    res.status(500).json({ error: 'Failed to update medicine stock' });
  }
});

// Delete a medicine
router.delete('/:id', auth, isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if medicine has related prescriptions
    const prescriptions = await Billing.find({ medicineId: id });
    
    if (prescriptions.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete medicine with existing prescriptions. Please delete prescriptions first.' 
      });
    }
    
    const medicine = await Medicine.findByIdAndDelete(id);
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json({ message: 'Medicine deleted successfully', medicine });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({ error: 'Failed to delete medicine' });
  }
});

export default router;
