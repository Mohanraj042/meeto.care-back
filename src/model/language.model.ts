import mongoose from "mongoose";

export interface LanguageModel {
    id: number;
    code: string;
    name: string;
  }

  const languageShema = new mongoose.Schema({
    id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
  });

  export const Language = mongoose.model("Language", languageShema);