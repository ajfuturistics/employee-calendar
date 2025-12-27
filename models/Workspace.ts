import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkspace extends Document {
  name: string;
  inviteCode: string;
  timezone: string;
  ownerId: mongoose.Types.ObjectId;
}

const WorkspaceSchema: Schema<IWorkspace> = new Schema(
  {
    name: { type: String, required: true },
    inviteCode: { type: String, required: true, unique: true },
    timezone: { type: String, default: 'UTC' },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Workspace: Model<IWorkspace> =
  mongoose.models.Workspace || mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);

export default Workspace;
