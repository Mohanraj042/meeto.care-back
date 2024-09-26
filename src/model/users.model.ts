import mongoose, { Document } from 'mongoose';

export interface UsersDocument extends Document {
    _id?: any;
    email?: string;
    name?: string;
    fullName?: string;
    otp?: number; 
    profileImage?: string;
    gender?: string;
    mobileNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: number;
    landmark?: string;
    canceledOrders?:any[];
    alternativeMobileNumber?: string;
    locality?: string;
    useMyCurretAddress?: boolean;
    fcm_Token?: string;
    questionCount?: number;
    doctorId?: any[]; // Update this line to match the property name
    isDeleted?: boolean;
    status?: number;
    modifiedOn?: Date;
    modifiedBy?: string;
    createdOn?: Date;
    createdBy?: string;
};

const usersSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    email: { type: String,unique:true, required: true},
    doctorId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
    name: { type: String },
    fullName: { type: String },
    otp: { type:Number },
    questionCount:{type:Number,default:0},
    fcm_Token:{type:String},
    profileImage: { type: String },
    gender: { type: String },
    mobileNumber: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: Number },
    landmark: { type: String },
    canceledOrders: [{ type: mongoose.Types.ObjectId, ref: 'Order' }],
    alternativeMobileNumber: { type: String },
    locality: { type: String },
    useMyCurretAddress: { type: Boolean },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },
});

export const Users = mongoose.model('User', usersSchema);