import mongoose from "mongoose";

export interface PostDocument extends mongoose.Document {
    _id?: any;
    video?: string;
    name:string;
    title?: string;
    content?: string;
    userId?: any;
    doctorId?:any;
    likes?: any;
    likeCount?: number;
    commentCount?: number;
    shareCount?: number;
    comment?: any[];
    block?: any[];
    report?: any[];
    hashtag?: string;
    mention?: any;
    type?: string;
    date?: number;
    month?: number;
    year?: number;
    isDeleted?: boolean;
    status?: number;
    modifiedOn?: Date;
    modifiedBy?: string;
    createdOn?: Date;
    createdBy?: string;
};

const postSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    doctorId: { type: mongoose.Types.ObjectId, ref: 'Doctor' },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    video: { type: String },
    name: { type: String },
    content: { type: String },
    title: { type: String },
    likeCount: { type: Number, default: 0 },
    likes: [{
        user: { type: mongoose.Types.ObjectId, refPath: 'likes.modleType' },
        modelType: { type: String, enum: ['User', 'Doctor', 'Company'], required: true },
    }],
    commentCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    comment: [
        {
            user: { type: mongoose.Types.ObjectId, refPath: 'comment.modelType' },
            modelType: { type: String, enum: ['User', 'Doctor', 'Company'], required: true },
            comments: { type: String, default: "" },
            createdOn: { type: Date },
        }
    ],
    block: [{
        user: { type: mongoose.Types.ObjectId, refPath: 'block.modelType' },
        modelType: { type: String, enum: ['User', 'Doctor', 'Company'], required: true },
    }],
    report: [{
        type: { type: String },
        user: { type: mongoose.Types.ObjectId, ref: 'report.modelType' },
        modelType: { type: String, enum: ['User', 'Doctor', 'Company'], required: true },
        description: { type: String },
        createdOn: { type: Date }
    }],
    hashtag: { type: String },
    mention: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    type: { type: String },
    date: { type: Number },
    month: { type: Number },
    year: { type: Number },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdOn: { type: Date },
    createdAt: { type: Date, default: Date.now, index: true },
    createdBy: { type: String }
})

export const Post = mongoose.model("Post", postSchema)