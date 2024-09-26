import mongoose,{Types}from 'mongoose';

export interface ConversationDocument extends mongoose.Document {
  userId: Types.ObjectId;
  doctorId: Types.ObjectId;
  messages: Types.ObjectId[];
}

const conversationSchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, required: true, ref: 'User' },
  doctorId: { type: Types.ObjectId, required: true, ref: 'Doctor' },
  messages: [{ type: Types.ObjectId, ref: 'chat' }],
});

export const Conversation = mongoose.model('conversation', conversationSchema);
