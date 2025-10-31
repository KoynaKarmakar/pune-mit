// src/scripts/seedDb.ts
import "dotenv/config";
import dbConnect from "../lib/mongodb";
import PastProject from "../models/PastProject";
import { generateEmbedding } from "../services/embedding.service";
import mongoose from "mongoose";

const pastProjectsData = [
  {
    title: "Liquidation of standing pillars at W-4 Panel in Jhanjra ECL",
    summary:
      "A project focused on the safe and efficient extraction of coal from standing pillars in underground mines.",
  },
  {
    title:
      "Resource survey characterisation and blending of low volatile coking coal",
    summary:
      "An investigation into the properties of low volatile coking coal to optimize its use in steel manufacturing.",
  },
  {
    title: "Dry Beneficiation of High Ash Indian Thermal Coal",
    summary:
      "A study on using air-fluidization techniques to reduce the ash content in high-ash thermal coal without using water.",
  },
];

async function seedDatabase() {
  await dbConnect();
  console.log("Clearing old past project data...");
  await PastProject.deleteMany({});

  for (const project of pastProjectsData) {
    console.log(`Embedding: "${project.title}"`);
    const embedding = await generateEmbedding(project.summary);
    await new PastProject({ ...project, summaryEmbedding: embedding }).save();
  }

  console.log("\n✅ Database seeding complete!");
  await mongoose.disconnect();
}

seedDatabase().catch(console.error);
