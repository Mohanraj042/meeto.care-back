import mongoose from "mongoose";

export interface CompanyDocument extends mongoose.Document {
    _id?: any;
    email?: string;
    otp?: number;
    name?: string;
    mobileNumber?: number;
    profileImage?: string;
    companyName?: string;
    companyAddress?: string;
    sellerAddress?: any;
    typesOfBusiness?: string;
    city?: string;
    state?: string;
    fcm_Token?: string;
    isDeleted?: boolean;
    status?: number;
    modifiedOn?: Date;
    modifiedBy?: string;
    createdOn?: Date;
    createdBy?: string;
}

const companySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    email: { type: String,unique:true, required: true },
    otp: { type: Number },
    name: { type: String },
    mobileNumber: { type: Number },
    profileImage: { type: String },
    companyName: { type: String },
    companyAddress: { type: String },
    sellerAddress:[{
        name:{type:String},
        mobileNumber:{type:String},
        street:{type:String},
        city:{type:String},
        state:{type:String},
        pincode:{type:Number},
        landmark:{type:String},
        alternativeMobileNumber:{type:String},
        locality:{type:String},
        useMyCurretAddress:{type:Boolean},}],
    typesOfBusiness: { type: String },
    city: { type: String },
    state: { type: String },
    fcm_Token: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
});

export const Company = mongoose.model("Company", companySchema);