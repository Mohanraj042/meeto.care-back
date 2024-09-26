import mongoose from "mongoose";


export interface DoctorReviewDocument extends mongoose.Document {
    _id?: any;
    doctorId?: any;
    userId?: any;
    fullName?: string;
    title?: string;
    images?: any[];
    comment?: string;
    rating?: number;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const doctorReviewSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    doctorId: { type: mongoose.Types.ObjectId, ref: "Doctor" },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    fullName: { type: String },
    title: { type: String },
    images: [{ type: String }],
    comment: { type: String },
    rating: { type: Number },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },
})

export const DoctorReview = mongoose.model("DoctorReview", doctorReviewSchema)