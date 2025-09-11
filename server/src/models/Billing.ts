import mongoose, { Document, Schema } from 'mongoose';

export interface IBilling extends Document {
  medicineId: mongoose.Schema.Types.ObjectId;
  storeId: mongoose.Schema.Types.ObjectId;
  frequency: 'morning' | 'evening';
  name: string;  // Patient/customer name
  number: string; // Contact number or prescription number
  description?: string; // Added description field for prescription
}

const BillingSchema: Schema = new Schema({
  medicineId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Medicine', 
    required: true 
  },
  storeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Store', 
    required: true 
  },
  frequency: { 
    type: String, 
    enum: ['morning', 'evening'], 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  number: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: false,
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
BillingSchema.index({ medicineId: 1 });
BillingSchema.index({ storeId: 1 });
BillingSchema.index({ name: 1 });

export default mongoose.model<IBilling>('Billing', BillingSchema);
