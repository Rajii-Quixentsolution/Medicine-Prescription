import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  pwd: string;
  type: 'admin' | 'user';
  storeId:mongoose.Schema.Types.ObjectId,
}

const UserSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  pwd: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['admin', 'user'], 
    required: true,
    default: 'user'
  },
  storeId:{
    type:Schema.Types.ObjectId,
    ref:"Store"
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
