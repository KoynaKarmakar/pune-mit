import mongoose, { Schema, models, Document } from "mongoose";
import { IUser } from "./User";

const InvestigatorCVSchema = new Schema(
  {
    educationalQualifications: { type: String, default: "" },
    pastExperience: { type: String, default: "" },
    researchProjectsHandled: { type: String, default: "" },
    commercialApplications: { type: String, default: "" },
    papersPublished: { type: String, default: "" },
  },
  { _id: false }
);

const TimelineSchema = new Schema(
  {
    activity: { type: String, default: "" },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { _id: false }
);

const BudgetSchema = new Schema(
  {
    capital: {
      landBuilding: { type: Number, default: 0 },
      equipment: { type: Number, default: 0 },
    },
    revenue: {
      salaries: { type: Number, default: 0 },
      consumables: { type: Number, default: 0 },
      travel: { type: Number, default: 0 },
      workshopSeminar: { type: Number, default: 0 },
    },
    contingency: { type: Number, default: 0 },
    institutionalOverhead: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
  },
  { _id: false }
);

const ReviewHistorySchema = new Schema({
  reviewerName: String,
  comment: String,
  decision: String,
  timestamp: { type: Date, default: Date.now },
});

export interface IProposal extends Document {
  _id: string;
  applicant: IUser["_id"];
  status:
    | "draft"
    | "submitted"
    | "under_review"
    | "revision_requested"
    | "approved"
    | "rejected"
    | "terminated";
  resubmissionCount: number;
  projectTitle: string;
  definitionOfIssue: string;
  objectives: string;
  justification: string;
  workPlan: string;
  methodology: string;
  organizationOfWork: string;
  benefitToIndustry: string;
  timeline: {
    activity?: string;
    startDate?: Date;
    endDate?: Date;
  }[];
  budget: object;
  // Fields from Section 16 & 18
  investigatorCV: {
    educationalQualifications?: string;
    pastExperience?: string;
    researchProjectsHandled?: string;
    commercialApplications?: string;
    papersPublished?: string;
  };
  literatureSurvey: string;
  rdComponents: string; // The "Novelty" component
  // System-generated fields
  aiEvaluation?: object;
  aiScore?: number;
  aiSummary?: string;
  aiRecommendations?: string[];
  updatedAt: string;
  reviewHistory: any[];
}

const ProposalSchema = new Schema<IProposal>(
  {
    applicant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "revision_requested",
        "approved",
        "rejected",
        "terminated",
      ],
      default: "draft",
    },
    resubmissionCount: { type: Number, default: 0 },
    // Form-I fields
    projectTitle: { type: String, default: "" },
    definitionOfIssue: { type: String, default: "" },
    objectives: { type: String, default: "" },
    justification: { type: String, default: "" },
    workPlan: { type: String, default: "" },
    methodology: { type: String, default: "" },
    organizationOfWork: { type: String, default: "" },
    benefitToIndustry: { type: String, default: "" },
    timeline: [TimelineSchema],
    budget: { type: BudgetSchema, default: () => ({}) },
    // Section 16 & 18 fields
    investigatorCV: { type: InvestigatorCVSchema, default: () => ({}) },
    literatureSurvey: { type: String, default: "" },
    rdComponents: { type: String, default: "" },
    // System fields
    aiEvaluation: { type: Object },
    aiScore: { type: Number },
    aiSummary: { type: String },
    aiRecommendations: [{ type: String }],
    reviewHistory: [ReviewHistorySchema],
  },
  { timestamps: true }
);

export default models.Proposal ||
  mongoose.model<IProposal>("Proposal", ProposalSchema);
