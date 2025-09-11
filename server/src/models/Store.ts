import mongoose, { Document, Schema } from 'mongoose';

export interface IStore extends Document {
  name: string;
}

const StoreSchema: Schema = new Schema({
  name: { type: String, required: true },
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

export default mongoose.model<IStore>('Store', StoreSchema);