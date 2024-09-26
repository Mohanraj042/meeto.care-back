import mongoose from "mongoose";

export interface CategoryDocument extends mongoose.Document {
    _id?: any;
    companyId?: any;
    categoryName?: string;
    categoryImage?: string;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const categorySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    companyId: { type: mongoose.Types.ObjectId, ref: "Company" },
    categoryName: { type: String },
    categoryImage: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },
    modifiedOn: { type: Date },
});

export const Category = mongoose.model("Category", categorySchema);