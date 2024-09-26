import mongoose from "mongoose";

export interface PanelReviewDocument extends mongoose.Document {
    _id?: any;
    panelId?: any;
    name?: string;
    title?: string;
    images?: string[];
    comment?: string;
    rating?: number;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const panelReviewSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    panelId: { type: mongoose.Types.ObjectId, ref: "Panel" },
    name: { type: String },
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

export const PanelReview = mongoose.model("PanelReview", panelReviewSchema)