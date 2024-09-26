import mongoose from 'mongoose';

export interface FaqDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  doctorIds: mongoose.Types.ObjectId[];
  question?: string;
  answers?:any[];
  hisPaid?: boolean;
  isDeleted?: boolean;
  status?: number;
  createdOn?: Date;
  createdBy?: string;
  modifiedOn?: Date;
  modifiedBy?: string;
}

const faqSchema = new mongoose.Schema({
  _id: { type:mongoose.Schema.Types.ObjectId, required: true, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Doctor' },
  question: { type: String },
  answers:[{ doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, answer: { type: String } }],
  hisPaid: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  status: { type: Number, default: 1 },
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now, index: true },
  modifiedOn: { type: Date },
  modifiedBy: { type: String },
});
export const Faq = mongoose.model('Faq',faqSchema);