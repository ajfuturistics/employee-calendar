import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILeave extends Document {
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  type: 'CASUAL' | 'SICK' | 'PAID' | 'UNPAID' | 'ANNUAL' | 'MATERNITY' | 'PATERNITY' | 'BEREAVEMENT' | 'STUDY' | 'OTHER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  rejectionReason?: string;
}

const LeaveSchema: Schema<ILeave> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: {
      type: String,
      enum: ['CASUAL', 'SICK', 'PAID', 'UNPAID', 'ANNUAL', 'MATERNITY', 'PATERNITY', 'BEREAVEMENT', 'STUDY', 'OTHER'],
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    reason: { type: String },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

const Leave: Model<ILeave> =
  mongoose.models.Leave || mongoose.model<ILeave>('Leave', LeaveSchema);

export default Leave;
