import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import storeRoutes from './routes/store';
import medicineRoutes from './routes/medicine';
import billingRoutes from './routes/billing';

dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Routes
app.use('/api/stores', storeRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/billings', billingRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Doctor Prescription Website API is running!');
});

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: any) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medicine_prescription';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
