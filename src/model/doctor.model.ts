import mongoose from "mongoose";
 
export interface DoctorDocument extends mongoose.Document {
    _id?: string;
    userId?: string;
    doctorName?: string;
    email?: string;
    otp?: number;
    phone?: number;
    doctorBio?:string;
    qualification?: any;
    experience?: any;
    specialization?: string;
    profileImage?: string;
    language?: string;
    gender?: string;
    address?: string;
    scheduleTime?: string;
    scheduleDays?: string;
    overAllQualification?: string;
    overAllExperience?: string;
    city?: string;
    state?: string;
    pincode?: number;
    landLineNumber?: number;
    fcmToken?: string;
    reviews?:any[];
    averageRating?: number;
    services?: string;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}
 
const doctorSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    doctorName: { type: String },
    userId: { type: String, ref: 'User'},
    email: { type: String ,unique:true, required: true},
    otp: { type: Number },
    phone: { type: Number },
    specialization:[ { type: String}],
    profileImage: { type: String },
    language: { type: String },
    gender: { type: String },
    doctorBio: { type: String },
    qualification: [{
        college:{ type: String },
        degree:{ type: String },
        specialization:{ type: String },
        from:{ type: String },
        to:{ type: String },
        yearOfPassing:{ type: String },
        percentage:{ type: String },
        currentlyStudying:{ type: Boolean },
        grade:{ type: String }
    }],
    experience:[{ 
        role:{ type: String },
        organization: { type: String },
        from:{ type: String },
        to:{ type: String },
        currentlyWorking:{ type: Boolean },
        location:{ type: String },
        skills:{ type: String }
    }],
    address: { type: String },
    scheduleTime: { type: String },
    scheduleDays: { type: String },
    overAllQualification: { type: String },
    overAllExperience: { type: String },
    city: { type: String},
    state: { type: String },
    pincode: { type: Number },
    landLineNumber: { type: Number },
    fcmToken: { type: String},
    reviews: [
              { userId:{type:String,ref:'User'},
                rating:{type:Number},
                comment:{type:String}}],
    averageRating: { type: Number, default: 0 },
    services: [{ type: String }],            
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdAt : { type: Date, default: Date.now,index:true },
})
 
 
export const Doctor = mongoose.model("Doctor", doctorSchema);