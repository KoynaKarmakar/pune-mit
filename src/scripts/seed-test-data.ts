// src/scripts/seed-final.ts
import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "../lib/mongodb";
import User from "../models/User";
import Proposal from "../models/Proposal";
import PastProject from "../models/PastProject";
import { hashPassword } from "../lib/password";
import { generateEmbedding } from "../services/embedding.service";
import { evaluateProposalWithAI } from "../services/gemini.service";

const seedDatabase = async () => {
  try {
    await dbConnect();
    console.log("Database connected.");

    // 1. Clear existing data
    console.log("Clearing old data...");
    await User.deleteMany({});
    await Proposal.deleteMany({});
    await PastProject.deleteMany({});
    console.log("Old data cleared.");

    // 2. Create Users
    console.log("Creating users...");
    const hashedPassword = await hashPassword("password123");

    const users = await User.insertMany([
      // Applicants
      {
        name: "Dr. Arin Sharma",
        email: "arin.sharma@test.com",
        password: hashedPassword,
        role: "applicant",
      },
      {
        name: "Priya Singh",
        email: "priya.singh@test.com",
        password: hashedPassword,
        role: "applicant",
      },
      // TSC Members (Reviewers)
      {
        name: "Prof. Rajesh Kumar",
        email: "rajesh.kumar@test.com",
        password: hashedPassword,
        role: "tsc_member",
      },
      {
        name: "Dr. Meena Iyer",
        email: "meena.iyer@test.com",
        password: hashedPassword,
        role: "tsc_member",
      },
      // NaCCER Admin
      {
        name: "Admin User",
        email: "admin@test.com",
        password: hashedPassword,
        role: "nacer_admin",
      },
    ]);

    const [applicant1, applicant2, tscMember1, tscMember2, adminUser] = users;
    console.log("Users created successfully.");

    // 3. Create Past Projects for Novelty Check
    console.log("Creating past projects for vector search...");
    const pastProjectsData = [
      {
        title: "Advanced Coal Dust Suppression Techniques",
        summary:
          "An investigation into polymer-based agents for mitigating airborne coal dust in underground mines, showing a 40% reduction in particulate matter.",
      },
      {
        title: "AI-Powered Predictive Maintenance for Conveyor Belts",
        summary:
          "Developed a machine learning model to predict conveyor belt failures, resulting in a 25% decrease in unscheduled downtime and significant cost savings.",
      },
      {
        title: "High-Efficiency Coal Gasification for Syngas Production",
        summary:
          "Optimized a fluidized bed gasifier to improve the conversion efficiency of high-ash Indian coal into syngas, achieving a 15% increase in cold gas efficiency.",
      },
      {
        title: "Geospatial Mapping of Methane Emissions in Jharia Coalfield",
        summary:
          "Utilized satellite imagery and on-ground sensors to create a comprehensive map of methane hotspots, enabling targeted mitigation efforts.",
      },
    ];

    for (const project of pastProjectsData) {
      const embedding = await generateEmbedding(
        `Title: ${project.title}. Summary: ${project.summary}`
      );
      await new PastProject({ ...project, summaryEmbedding: embedding }).save();
    }
    console.log("Past projects created and embedded.");

    // 4. Create Proposals for All Scenarios
    console.log("Creating a comprehensive set of proposals...");

    // PROPOSAL 1: A simple draft
    const draftProposal = new Proposal({
      applicant: applicant1._id,
      projectTitle: "Initial Concept for Drone-based Mine Inspection",
      status: "draft",
    });
    await draftProposal.save();
    console.log(` -> Created: Draft Proposal`);

    // PROPOSAL 2: A weak proposal destined for auto-rejection
    let autoRejectedProposal = new Proposal({
      applicant: applicant2._id,
      projectTitle: "A Basic Idea for Water Purification",
      definitionOfIssue: "Water is sometimes dirty.",
      objectives: "Make water clean.",
      justification: "Clean water is good.",
      workPlan: "Will figure it out.",
      methodology: "Use a filter.",
      benefitToIndustry: "Less pollution.",
      investigatorCV: { educationalQualifications: "B.Sc." },
      literatureSurvey: "Some articles were read.",
      rdComponents: "A new type of filter is proposed.",
      budget: { capital: { equipment: 1 }, revenue: { consumables: 0.5 } },
    });
    console.log(` -> Simulating submission for: Auto-Rejected Proposal`);
    let evalResult = await evaluateProposalWithAI(autoRejectedProposal);
    autoRejectedProposal.aiEvaluation = evalResult.evaluation;
    autoRejectedProposal.aiScore = evalResult.score;
    autoRejectedProposal.aiSummary = evalResult.summary;
    autoRejectedProposal.aiRecommendations = evalResult.recommendations;
    autoRejectedProposal.status =
      evalResult.score < 65 ? "rejected" : "under_review";
    await autoRejectedProposal.save();
    console.log(
      `    - AI Score: ${evalResult.score}, Status: ${autoRejectedProposal.status}`
    );

    // PROPOSAL 3: A strong proposal for manual review
    let underReviewProposal = new Proposal({
      applicant: applicant1._id,
      projectTitle:
        "Developing a Real-Time Geotechnical Stability Monitoring System for Underground Mines",
      definitionOfIssue:
        "Current methods for monitoring strata stability, like convergence indicators, are often manual and provide delayed warnings, increasing the risk of roof falls.",
      objectives:
        "1. Develop and integrate an array of IoT-enabled stress and strain sensors. 2. Create a machine learning model to predict potential failures based on sensor data patterns. 3. Build a real-time dashboard with alerts for mine safety officers.",
      justification:
        "This project will significantly enhance mine safety by providing predictive, real-time alerts, potentially preventing accidents and saving lives.",
      workPlan:
        "Phase 1 (3 months): Sensor selection and lab testing. Phase 2 (6 months): In-mine deployment and data collection. Phase 3 (5 months): ML model development and training. Phase 4 (4 months): Dashboard development and integration testing.",
      methodology:
        "We will use a combination of fiber Bragg grating (FBG) sensors for strain and MEMS-based sensors for micro-seismic activity. Data will be transmitted wirelessly to a central server. The predictive model will be a Long Short-Term Memory (LSTM) neural network.",
      benefitToIndustry:
        "Reduces risk of catastrophic roof falls, decreases operational downtime from safety incidents, and provides a data-driven approach to mine safety management.",
      investigatorCV: {
        educationalQualifications: "Ph.D. in Mining Engineering, IIT Kharagpur",
        pastExperience: "10+ years in geotechnical research at CIMFR.",
      },
      literatureSurvey:
        "Extensive review of existing monitoring technologies shows a gap in predictive, real-time systems for Indian mining conditions. Papers from SME, AusIMM, and others have been consulted.",
      rdComponents:
        "The novelty lies in the fusion of multi-sensor data (FBG, seismic, thermal) and the application of a bespoke LSTM model for failure prediction in complex geological strata.",
      budget: {
        capital: { equipment: 45 },
        revenue: { salaries: 25, consumables: 10, travel: 5 },
        contingency: 8.5,
      },
    });
    console.log(
      ` -> Simulating submission for: Strong Proposal (Under Review)`
    );
    evalResult = await evaluateProposalWithAI(underReviewProposal);
    underReviewProposal.aiEvaluation = evalResult.evaluation;
    underReviewProposal.aiScore = evalResult.score;
    underReviewProposal.aiSummary = evalResult.summary;
    underReviewProposal.aiRecommendations = evalResult.recommendations;
    underReviewProposal.status = "under_review";
    await underReviewProposal.save();
    console.log(
      `    - AI Score: ${evalResult.score}, Status: ${underReviewProposal.status}`
    );

    // PROPOSAL 4: A proposal that has been approved
    let approvedProposal = new Proposal({
      applicant: applicant2._id,
      projectTitle: "Valorization of Coal Fly Ash into High-Value Zeolites",
      status: "approved",
      definitionOfIssue:
        "Coal fly ash is a voluminous industrial byproduct with significant disposal and environmental challenges. Current utilization methods are low-value.",
      objectives:
        "To develop a cost-effective, two-step hydrothermal process to synthesize ZSM-5 zeolite from coal fly ash.",
      justification:
        "This project converts a waste product into a high-demand industrial catalyst, creating a new revenue stream and promoting a circular economy.",
      aiScore: 92,
      reviewHistory: [
        {
          reviewerName: tscMember1.name,
          comment: "Excellent proposal with clear commercial viability.",
          decision: "Approved",
          timestamp: new Date(),
        },
      ],
    });
    await approvedProposal.save();
    console.log(` -> Created: Approved Proposal`);

    // PROPOSAL 5: A proposal that needs revision
    let revisionProposal = new Proposal({
      applicant: applicant1._id,
      projectTitle:
        "Bio-remediation of Acid Mine Drainage (AMD) using Sulphate-Reducing Bacteria",
      status: "revision_requested",
      resubmissionCount: 1,
      definitionOfIssue:
        "Acid Mine Drainage (AMD) is a major environmental pollutant from coal mining, and conventional treatment methods are costly and produce secondary sludge.",
      objectives:
        "Isolate and cultivate indigenous sulphate-reducing bacteria (SRB) strains and design a pilot-scale bioreactor for AMD treatment.",
      justification:
        "A successful bioremediation process offers an eco-friendly and cost-effective alternative to chemical treatment of AMD.",
      aiScore: 78,
      reviewHistory: [
        {
          reviewerName: tscMember2.name,
          comment:
            "The proposed timeline for isolating and cultivating bacteria seems overly optimistic. Please provide a more detailed breakdown and justification for Phase 1.",
          decision: "Revision Requested",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
      ],
    });
    await revisionProposal.save();
    console.log(` -> Created: Revision Requested Proposal`);

    // PROPOSAL 6: A proposal rejected by a reviewer
    let rejectedByReviewer = new Proposal({
      applicant: applicant2._id,
      projectTitle: "Coal-to-Hydrogen via Microwave-Assisted Pyrolysis",
      status: "rejected",
      definitionOfIssue:
        "Conventional hydrogen production methods are energy-intensive. Coal pyrolysis offers an alternative, but yields are often low.",
      objectives:
        "To investigate the effect of microwave heating on hydrogen yield during coal pyrolysis.",
      justification:
        "This could lead to a more efficient method of producing hydrogen, a clean energy carrier.",
      aiScore: 81,
      reviewHistory: [
        {
          reviewerName: tscMember1.name,
          comment:
            "The safety protocols for handling hydrogen at high temperatures in a microwave environment are not adequately addressed. The risk assessment is insufficient.",
          decision: "Rejected",
          timestamp: new Date(),
        },
      ],
    });
    await rejectedByReviewer.save();
    console.log(` -> Created: Rejected by Reviewer Proposal`);

    // PROPOSAL 7: A terminated proposal (exceeded revision limit)
    let terminatedProposal = new Proposal({
      applicant: applicant1._id,
      projectTitle: "Carbon Capture using Metal-Organic Frameworks (MOFs)",
      status: "terminated",
      resubmissionCount: 2, // Assuming MAX_RESUBMISSIONS is 2
      aiScore: 75,
      reviewHistory: [
        {
          reviewerName: tscMember1.name,
          comment: "The budget for MOF synthesis seems too low. Please revise.",
          decision: "Revision Requested",
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        },
        {
          reviewerName: tscMember2.name,
          comment:
            "The revised budget is still unrealistic. The proposal also lacks a clear plan for regenerating the MOFs after carbon capture.",
          decision: "Terminate",
          timestamp: new Date(),
        },
      ],
    });
    await terminatedProposal.save();
    console.log(` -> Created: Terminated Proposal`);

    console.log("\n✅ All data has been seeded successfully!");
  } catch (error) {
    console.error("\n❌ An error occurred during seeding:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
};

seedDatabase();
