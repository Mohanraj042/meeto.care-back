import * as mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
    _id?: any;
    userName?: string;
    mobile?: number;
    email?: string;
    password?: string;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
};

const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    userName: { type: String },
    mobile: { type: Number },
    email: { type: String, lowercase: true, trim: true },
    password: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});


export const Admin = mongoose.model("Admin", userSchema);