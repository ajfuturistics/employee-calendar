import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMembership extends Document {
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  role: 'OWNER' | 'HR' | 'EMPLOYEE';
}

const MembershipSchema: Schema<IMembership> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    role: {
      type: String,
      enum: ['OWNER', 'HR', 'EMPLOYEE'],
      default: 'EMPLOYEE',
    },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness of user per workspace
MembershipSchema.index({ userId: 1, workspaceId: 1 }, { unique: true });

const Membership: Model<IMembership> =
  mongoose.models.Membership || mongoose.model<IMembership>('Membership', MembershipSchema);

export default Membership;
