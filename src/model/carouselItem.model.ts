import mongoose from "mongoose";

export interface CarouselItemDocument extends mongoose.Document {
  
    _id?: any;
    companyId?: string,
    title?: string,
    content?: string,
    image?: string,
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
    createdAt?: Date;
    
}

const CarouselItemSchema = new mongoose.Schema({

    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    companyId: { type: String, required: true, ref: 'Company' },
    title: { type: String },
    content: { type: String },
    image: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});


export const CarouselItem = mongoose.model("Carousel", CarouselItemSchema);