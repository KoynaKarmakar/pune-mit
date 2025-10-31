import mongoose, { Schema, models, Document } from "mongoose";

export interface IPastProject extends Document {
  title: string;
  summary: string;
  summaryEmbedding: number[];
}

const PastProjectSchema = new Schema<IPastProject>({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  summaryEmbedding: { type: [Number], required: true },
});

export default models.PastProject ||
  mongoose.model<IPastProject>("PastProject", PastProjectSchema);
