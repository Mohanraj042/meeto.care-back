import mongoose from "mongoose";


export interface ProductRatingDocument extends mongoose.Document {
    _id?: any;
    productId?: any;
    userId?: any;
    panelId?: any;
    companyId?: any;
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

const productRatingSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    productId: { type: mongoose.Types.ObjectId, ref: "Product" },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    panelId:{ type: mongoose.Types.ObjectId, ref: "Panel" },
    companyId: { type: mongoose.Types.ObjectId, ref: "Company" },
    title: { type: String },
    images: [{ type: String }],
    comment: { type: String },
    rating: { type: Number },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})

export const ProductRating = mongoose.model("ProductRating", productRatingSchema)