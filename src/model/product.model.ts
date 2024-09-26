import mongoose from "mongoose";

export interface ProductDocument extends mongoose.Document {
    _id?: any;
    panelId?: any;
    companyId?: any;
    categoryName?: string,
    categoryImage?: string,
    productName?: string;
    productDescription?: string;
    productImage?: string;
    productGif?: string;
    topImage?: string;
    sideImage?: string;
    frontImage?: string;
    backImage?: string;
    specifications?: string;
    originalPrice: number;
    discountPercentage: number;
    discountedPrice: number;
    quantity?: number;
    gstRate?: number;
    gstAmount?: number;
    benefits?: string;
    finalPrice?: number;
    selling?: string;
    rating?: number;
    userId?: any;
    comment?: string;
    title?: string;
    images?: any;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const productSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    panelId: { type: mongoose.Types.ObjectId, ref: "Panel" },
    companyId: { type: mongoose.Types.ObjectId, ref: "Company" },
    categoryName: { type: String },
    categoryImage: { type: String },
    productName: { type: String },
    productDescription: { type: String },
    topImage: { type: String },
    sideImage: { type: String },
    frontImage: { type: String },
    backImage: { type: String },
    productGif: { type: String },
    specifications: [{
        heading: { type: String },
        points: [{ type: String }]
    }],
    selling: { type: String, default: "normal" },
    originalPrice: { type: Number },
    discountPercentage: { type: Number },
    discountedPrice: { type: Number, default: 0 },
    productImage: { type: String },
    quantity: { type: Number },
    gstRate: { type: Number },
    gstAmount: { type: Number },
    benefits: [{ type: String }],
    finalPrice: { type: Number },
    rating: { type: Number },
    comment: { type: String },
    title: { type: String },
    images: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },

});

export const Product = mongoose.model("Product", productSchema);