import mongoose, { Document, Schema } from 'mongoose';

export interface IStore extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      unique: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IStore>('Store', StoreSchema);
