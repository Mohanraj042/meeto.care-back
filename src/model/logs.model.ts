import * as mongoose from "mongoose";
export interface LogsDocument extends mongoose.Document {
    _id?: any;
    userId?: any;
    time?: number;
    date?: Date;
    activity?: string;
    ipAddess?: string;
    description?: string;
    url?: string;
    processStatus?: Boolean;
    statusCode?: number;
    method?: string;
    isDeleted?: boolean;
    status?: number;
    level?: string;
    mandapam?: any;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
};

const logsSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    time: { type: Number },
    date: { type: Date },
    ipAddess: { type: String },
    statusCode: { type: Number },
    activity: { type: String },
    url: { type: String },
    description: { type: String },
    processStatus: { type: Boolean },
    method: { type: String },
    level: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});



export const Logs = mongoose.model("Logs", logsSchema);
