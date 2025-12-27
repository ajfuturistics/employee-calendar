import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'OWNER' | 'HR' | 'EMPLOYEE';
  workspaceId: mongoose.Types.ObjectId;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth later
    role: {
      type: String,
      enum: ['OWNER', 'HR', 'EMPLOYEE'],
      default: 'EMPLOYEE',
    },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
