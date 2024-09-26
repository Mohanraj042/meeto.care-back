import mongoose from 'mongoose';

export interface NotificationDocment extends mongoose.Document {
  _id?: any;
  title?: string;
  description?: string;
  date?: Date;
  from?: any;
  to?: any;
  isViewed?: Boolean;
  isDeleted?: Boolean;
  status?: number;
  createdOn?: Date;
  createdBy?: string;
  modifiedOn?: Date;
  modifiedBy?: string;
}

const notificationSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
  description: { type: String },
  date: { type: Date },
  title: { type: String },
  from: {
      user: { type: mongoose.Types.ObjectId, refPath: "from.modelType" },
      modelType: { type: String, enum: ['Company', 'User', 'Doctor'], required: true }
  },
  to: {
      user: { type: mongoose.Types.ObjectId, refPath: "to.modelType" },
      modelType: { type: String, enum: ['Doctor', 'User', 'Company'], required: true }
  },
  isViewed: { type: Boolean, default: false },
  status: { type: Number, default: 1 },
  isDeleted: { type: Boolean, default: false },
  createdOn: { type: Date },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now, index: true },
  modifiedOn: { type: Date },
  modifiedBy: { type: String },
})

export const Notification = mongoose.model ('Notification', notificationSchema)