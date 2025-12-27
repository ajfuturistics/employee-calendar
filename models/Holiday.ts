import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHoliday extends Document {
  workspaceId: mongoose.Types.ObjectId;
  name: string;
  date: Date;
  isNational: boolean;
}

const HolidaySchema: Schema<IHoliday> = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    isNational: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Holiday: Model<IHoliday> =
  mongoose.models.Holiday || mongoose.model<IHoliday>('Holiday', HolidaySchema);

export default Holiday;
