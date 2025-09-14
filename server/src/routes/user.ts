import express, { Request, Response } from 'express';
import User from '../models/User';
import { auth, isAdmin } from '../middleware/auth';

const router = express.Router();

// Get all users
router.get('/', auth, isAdmin, async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-pwd');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Create a new user
router.post('/', auth, isAdmin, async (req: Request, res: Response) => {
  try {
    const { email, pwd, type,storeId } = req.body;

    if (!email || !pwd || !type || !storeId) {
      return res.status(400).json({ error: 'Email, password, type and storeId are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ email, pwd, type, storeId });
    await user.save();

    res.status(201).json(user);

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update a user
router.put('/:id', auth, isAdmin, async (req: Request, res: Response) => {
  try {
    const { email, pwd, type, storeId } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.email = email || user.email;
    user.pwd = pwd || user.pwd;
    user.type = type || user.type;
    user.storeId= storeId || user.storeId

    await user.save();

    res.json(user);

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
router.delete('/:id', auth, isAdmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
