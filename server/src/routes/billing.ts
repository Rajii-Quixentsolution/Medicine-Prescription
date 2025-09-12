import express, { Request, Response } from 'express';
import Billing from '../models/Billing';
import Medicine from '../models/Medicine';
import Store from '../models/Store';

const router = express.Router();

// Get all prescriptions with medicine and store information
router.get('/', async (req: Request, res: Response) => {
  try {
    const prescriptions = await Billing.find()
      .populate('medicineId', 'name expirydate stock batchNumber') // Added batchNumber
      .populate('storeId', 'name')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// Get prescriptions by store
router.get('/store/:storeId', async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    
    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const prescriptions = await Billing.find({ storeId })
      .populate('medicineId', 'name expirydate stock batchNumber') // Added batchNumber
      .populate('storeId', 'name')
      .sort({ createdAt: -1 });
      
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions for store:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions for store' });
  }
});

// Get prescriptions by medicine
router.get('/medicine/:medicineId', async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params;
    
    // Check if medicine exists
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    const prescriptions = await Billing.find({ medicineId })
      .populate('medicineId', 'name expirydate stock batchNumber') // Added batchNumber
      .populate('storeId', 'name')
      .sort({ createdAt: -1 });
      
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions for medicine:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions for medicine' });
  }
});

// Get prescriptions by patient name
router.get('/patient/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    
    const prescriptions = await Billing.find({ 
      name: { $regex: name, $options: 'i' } // Case-insensitive search
    })
      .populate('medicineId', 'name expirydate stock batchNumber') // Added batchNumber
      .populate('storeId', 'name')
      .sort({ createdAt: -1 });
      
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions for patient:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions for patient' });
  }
});

// Get a single prescription by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const prescription = await Billing.findById(id)
      .populate('medicineId', 'name expirydate stock batchNumber') // Added batchNumber
      .populate('storeId', 'name');
    
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    
    res.json(prescription);
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({ error: 'Failed to fetch prescription' });
  }
});

// Create new prescription
router.post('/', async (req: Request, res: Response) => {
  try {
    const { medicineId, storeId, frequency, name, number, description } = req.body;

    // Validate required fields
    if (!medicineId || !storeId || !frequency || !name || !number) {
      return res.status(400).json({ 
        error: 'All fields (medicineId, storeId, frequency, name, number) are required' 
      });
    }

    // Validate frequency
    if (!['morning', 'evening'].includes(frequency)) {
      return res.status(400).json({ 
        error: 'Frequency must be either "morning" or "evening"' 
      });
    }

    // Check if medicine exists
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Verify medicine belongs to the store
    if (medicine.storeId.toString() !== storeId) {
      return res.status(400).json({ 
        error: 'Medicine does not belong to the specified store' 
      });
    }

    // Check if medicine is in stock
    if (medicine.stock <= 0) {
      return res.status(400).json({ error: 'Medicine is out of stock' });
    }

    const prescription = await Billing.create({
      medicineId,
      storeId,
      frequency,
      name: name.trim(),
      number: number.trim(),
      description: description ? description.trim() : undefined,
    });

    // Decrement medicine stock
    medicine.stock -= 1;
    await medicine.save();

    const populatedPrescription = await Billing.findById(prescription._id)
      .populate('medicineId', 'name expirydate stock batchNumber') // Added batchNumber
      .populate('storeId', 'name');

    res.status(201).json(populatedPrescription);
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ error: 'Failed to create prescription' });
  }
});

// Update a prescription
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { medicineId, storeId, frequency, name, number, description } = req.body;

    // Validate frequency if provided
    if (frequency && !['morning', 'evening'].includes(frequency)) {
      return res.status(400).json({ 
        error: 'Frequency must be either "morning" or "evening"' 
      });
    }

    // Check if medicine exists if medicineId is provided
    if (medicineId) {
      const medicine = await Medicine.findById(medicineId);
      if (!medicine) {
        return res.status(404).json({ error: 'Medicine not found' });
      }
    }

    // Check if store exists if storeId is provided
    if (storeId) {
      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }
    }

    // If both medicineId and storeId are provided, verify they match
    if (medicineId && storeId) {
      const medicine = await Medicine.findById(medicineId);
      if (medicine && medicine.storeId.toString() !== storeId) {
        return res.status(400).json({ 
          error: 'Medicine does not belong to the specified store' 
        });
      }
    }

    const updateData: any = {};
    if (medicineId !== undefined) updateData.medicineId = medicineId;
    if (storeId !== undefined) updateData.storeId = storeId;
    if (frequency !== undefined) updateData.frequency = frequency;
    if (name !== undefined) updateData.name = name.trim();
    if (number !== undefined) updateData.number = number.trim();
    if (description !== undefined) updateData.description = description.trim();

    const prescription = await Billing.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate('medicineId', 'name expirydate stock batchNumber') // Added batchNumber
      .populate('storeId', 'name');

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ error: 'Failed to update prescription' });
  }
});

// Delete a prescription
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const prescription = await Billing.findById(id);

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    await Billing.findByIdAndDelete(id);

    res.json({ message: 'Prescription deleted successfully', prescription });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({ error: 'Failed to delete prescription' });
  }
});

export default router;