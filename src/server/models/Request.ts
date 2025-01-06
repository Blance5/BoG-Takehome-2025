import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
  requestorName: string;
  itemRequested: string;
  requestCreatedDate: Date;
  lastEditedDate?: Date;
  status: 'pending' | 'completed' | 'approved' | 'rejected';
}

const RequestSchema = new Schema<IRequest>({
  requestorName: { type: String, required: true, minlength: 3, maxlength: 30 },
  itemRequested: { type: String, required: true, minlength: 2, maxlength: 100 },
  requestCreatedDate: { type: Date, default: Date.now, required: true },
  lastEditedDate: { type: Date },
  status: {
    type: String,
    enum: ['pending', 'completed', 'approved', 'rejected'],
    default: 'pending',
    required: true,
  },
});

export default mongoose.model<IRequest>('Request', RequestSchema);
