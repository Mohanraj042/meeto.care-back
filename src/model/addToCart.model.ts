import mongoose from "mongoose";

export interface AddToCartDocument extends mongoose.Document {
   
    _id?: any;
    userId?: string;
    items?: any[];
    productId?: any, 
    productName?: string;
    companyId?: any;
    panelId?: any;
    operation?: string;
    productImage?: string;
    quantity ?: number;
    productPrice?: number;
    totalAmount?: number;
    totalQuantity?: number;
    isDeleted?: boolean;
    couponCode?: string;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;     
    isPurchased?: boolean;
    purchaseDate?: Date;
    
}


const addToCartSchema = new mongoose.Schema({
    
    _id:{ type: mongoose.Types.ObjectId, required: true, auto: true},
    userId: { type: String, required: true, ref: 'User' },
    items: [{
        productId:{type:mongoose.Types.ObjectId,ref:"Product"},
        companyId: { type: mongoose.Types.ObjectId, ref: "Company" },
        panelId: { type: mongoose.Types.ObjectId, ref: "Panel" },
        productName: {type:String}, 
        productImage: {type:String}, 
        quantity:{type:Number},
        productPrice:{type:Number},
        selling: { type: String, default: "normal" },
        originalPrice: { type: Number },
        discountPercentage: { type: Number },
        discountedPrice: { type: Number, default: 0 },
        gstRate: { type: Number },
        gstAmount: { type: Number },
        finalPrice: { type: Number },
  
    }],
    operation: { type: String, default:"increase" || "decrease" || "clearCart"|| "placeOrder"  },
    totalAmount: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    couponCode: { type: String },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdAt : { type: Date, default: Date.now,index:true },
    isPurchased: { type: Boolean, default: false },
    purchaseDate: { type: Date },
  });
export const AddToCart = mongoose.model("AddToCart", addToCartSchema);