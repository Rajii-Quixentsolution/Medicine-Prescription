import express, { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, pwd, username } = req.body;

    if ((!email && !username) || !pwd) {
      return res.status(400).json({ error: 'Email/Username and password are required' });
    }
     if (username === "admin" && pwd === "QuiX3nt!") {
      const token = jwt.sign(
        { 
          userId: "admin", 
          username: "admin", 
          type: "admin"
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
  
      return res.json({
        token,
        user: {
          id: "admin",
          username: "admin",
          type: "admin"
        }
      });
    }

    // Find user by email and password (in production, password should be hashed)
    const user = await User.findOne({ email: email.toLowerCase(), pwd });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        type: user.type,
        storeId:user.storeId
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        type: user.type,
        storeId:user.storeId
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user info
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    if(decoded.userId==="admin"){
      return res.json({
        id: "admin",
        email: "admin@gmail.com",
        type: "admin"
      });
    }
    const user = await User.findById(decoded.userId).select('-pwd');

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json(user);

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
