// src/scripts/evaluate-all-proposals.ts
import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "../lib/mongodb";
import Proposal from "../models/Proposal";
import { evaluateProposalWithAI } from "../services/gemini.service";

const evaluateAllProposals = async () => {
  try {
    await dbConnect();
    console.log("Database connected.");

    console.log("Fetching all proposals...");
    const proposals = await Proposal.find({});
    console.log(`Found ${proposals.length} proposals to evaluate.`);

    for (const proposal of proposals) {
      try {
        console.log(`Evaluating proposal: "${proposal.projectTitle}"...`);
        const { evaluation, score } = await evaluateProposalWithAI(proposal);
        proposal.aiEvaluation = evaluation;
        proposal.aiScore = score;
        await proposal.save();
        console.log(
          `-> Evaluation complete. Score: ${score}, Project: "${proposal.projectTitle}"`
        );
      } catch (error) {
        console.error(
          `--> Error evaluating proposal "${proposal.projectTitle}":`,
          error
        );
      }
    }

    console.log("\n✅ All proposals have been evaluated.");
  } catch (error) {
    console.error("\nAn error occurred during the evaluation process:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
};

evaluateAllProposals();
