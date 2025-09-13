import mongoose, { Document, Schema } from 'mongoose';

export interface IStore extends Document {
  name: string;
  userId: mongoose.Schema.Types.ObjectId[]; // Array of user IDs who can access this store
}

const StoreSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  userId: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }]
}, {
  timestamps: true
});

// Index for better query performance
StoreSchema.index({ userId: 1 });

export default mongoose.model<IStore>('Store', StoreSchema);