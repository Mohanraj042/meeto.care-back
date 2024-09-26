import mongoose from "mongoose";
import { autoIncrement } from 'mongoose-plugin-autoinc';


export interface InvoiceDocument extends mongoose.Document {
  _id?: any;
  userId?: string;
  panelId?: string;
  companyId?: string;
  orderNumber?: string;
  invoiceId?: number;
  invoiceType?: string;
  invoiceNumber?: string;
  invoiceDate?: Date;
  description?: string;
  unitPrice?: number;
  discount?: number;
  finalPrice?: number;
  quantity?: number;
  netAmount?: number;
  gstRate?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  taxAmount?: number;
  totalAmount?: number;
  amountInWords?: string;
  isReverseChargeApplicable?: boolean;
  soldBy?: string;
  billingAddress?: any[];
  shippingAddress?: any[];
  placeOfSupply?: string;
  placeOfDelivery?: string;
  digitallySignedBy?: string;
  signatureDate?: Date;
  isDeleted?: boolean;
  status?: number;
  modifiedOn?: Date;
  modifiedBy?: string;
  createdOn?: Date;
  createdBy?: string;

}

const invoiceSchema = new mongoose.Schema({
     _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
     userId: {type: String, required: true,ref: "User"},
     panelId: {type: String, ref: "Panel"},
     companyId: {type: String, ref: "Company"},
     orderNumber: {type: String, ref: "Order"},
     invoiceId: {type: Number, required: true},
     invoiceType: {type: String, required: true},
     invoiceNumber: {type: String, required: true},
     invoiceDate: {type: Date, required: true},
     description: {type: String, required: true},
     finalPrice: {type: Number, required: true},
     unitPrice: {type: Number, required: true},
     discount: {type: Number, required: true},
     quantity: {type: Number, required: true},
     netAmount: {type: Number, required: true},
     gstRate : {type: Number, required: true},
     cgst: {type: Number, required: true},
     sgst: {type: Number, required: true},
     igst: {type: Number, required: true},
     taxAmount: {type: Number, required: true},
     totalAmount: {type: Number, required: true},
     amountInWords: {type: String, required: true},
     isReverseChargeApplicable: {type: Boolean, required: true},
     soldBy: {type: String, required: true},
     sellerName: [{
                      name:{type: String, required: true},
                      mobileNumber:{type: String, required: true},
                      address:{type: String, required: true},
                      city:{type: String, required: true},
                      state:{type: String, required: true},
                      pincode:{type: Number, required: true},
                      landmark:{type: String, required: true},
                      alternativeMobileNumber:{type: String, required: true},
                      locality:{type: String, required: true},
                      useMyCurretAddress:{type: Boolean, required: true},
                    }],
                  
     billingAddress:[{
                       name:{type:String},
                       mobileNumber:{type:String},
                       address:{type:String},
                       city:{type:String},
                       state:{type:String},
                       pincode:{type:Number},
                       landmark:{type:String},
                       alternativeMobileNumber:{type:String},
                       locality:{type:String},
                     useMyCurretAddress:{type:Boolean},}],
     shippingAddress:[{
                       fullName:{type:String},  
                       mobileNumber:{type:String},
                       address:{type:String},
                       city:{type:String},
                       state:{type:String},
                       pincode:{type:Number},
                       landmark:{type:String},
                       alternativeMobileNumber:{type:String},
                       locality:{type:String},
                     useMyCurretAddress:{type:Boolean},}],
     placeOfSupply: {type: String, required: true},
     placeOfDelivery: {type: String, required: true},
     digitallySignedBy: {type: String, required: true},
     signatureDate: {type: Date, required: true},
     isDeleted: {type: Boolean, required: true},
     status: {type: Number, required: true},
     modifiedOn: {type: Date, required: true},
     createdAt: { type: Date, default: Date.now, index: true },
     modifiedBy: {type: String, required: true},
     createdOn: {type: Date, required: true},
     createdBy: {type: String, required: true},
});


invoiceSchema.plugin(autoIncrement, {
  model: 'Invoice',
  field: 'invoiceId',
  startAt: 1,
  incrementBy: 1
});

export const Invoice = mongoose.model('Invoice', invoiceSchema);

