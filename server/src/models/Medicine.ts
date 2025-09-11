import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicine extends Document {
  name: string;
  storeId: mongoose.Schema.Types.ObjectId;
  expirydate: Date;
  stock: number;
}

const MedicineSchema: Schema = new Schema({
  name: { type: String, required: true },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  expirydate: { type: Date, required: true },
  stock: { type: Number, required: true, min: 0 },
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for better query performance
MedicineSchema.index({ storeId: 1 });
MedicineSchema.index({ name: 1 });

export default mongoose.model<IMedicine>('Medicine', MedicineSchema);
