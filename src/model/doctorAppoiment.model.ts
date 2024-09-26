import mongoose from "mongoose";

export interface DoctorAppointmentDocument extends mongoose.Document {
    _id?: any;
    userId?: any;
    doctorId?: any;
    name?: string;
    mobileNumber?: number;
    scheduleTime?: string;
    scheduleDate?: string[];
    scheduleStatus?:string;
    ticketNumber?: string;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const doctorSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    userId: { type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    doctorId:{ type:mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
    name: { type: String },
    mobileNumber: { type: Number },
    scheduleTime: { type: String },
    scheduleDate: [{ type: String }],
    scheduleStatus:{type:String},
    ticketNumber: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },
});

export const DoctorAppointment = mongoose.model('DoctorAppoiment', doctorSchema);