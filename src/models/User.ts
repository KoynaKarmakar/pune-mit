import mongoose, { Schema, models, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "applicant" | "nacer_admin" | "tsc_member";
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["applicant", "nacer_admin", "tsc_member"],
      default: "applicant",
    },
  },
  { timestamps: true }
);

export default models.User || mongoose.model<IUser>("User", UserSchema);
