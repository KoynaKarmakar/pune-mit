import "dotenv/config";
import mongoose from "mongoose";
import fetch from "node-fetch";

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// --- CONFIGURATION ---
const BASE_URL = "http://localhost:3000/api";
const TEST_DB_URI = process.env.MONGO_TEST_URI;

if (!TEST_DB_URI) {
  throw new Error("MONGO_TEST_URI is not defined in .env.local");
}

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
};

// --- TEST DATA ---
const adminUser = {
  name: "Test Admin",
  email: "admin@test.com",
  password: "password123",
  role: "nacer_admin",
};
const tscUser = {
  name: "Test Reviewer",
  email: "tsc@test.com",
  password: "password123",
  role: "tsc_member",
};
const applicantUser = {
  name: "Test Applicant",
  email: "applicant@test.com",
  password: "password123",
};

let adminCookie = "";
let tscCookie = "";
let applicantCookie = "";
let proposalId = "";

// --- HELPER FUNCTIONS ---
async function cleanupDatabase() {
  console.log(
    COLORS.yellow,
    "\n--- 🧹 Cleaning up test database... ---",
    COLORS.reset
  );
  const connection = await mongoose.connect(TEST_DB_URI!);
  await connection.connection.db.dropDatabase();
  await mongoose.disconnect();
  console.log(COLORS.green, "Test database cleaned.", COLORS.reset);
}

async function testEndpoint(name: string, testFn: () => Promise<void>) {
  console.log(COLORS.cyan, `\n--- 🧪 Starting Test: ${name} ---`, COLORS.reset);
  try {
    await testFn();
    console.log(COLORS.green, `--- ✅ PASSED: ${name} ---`, COLORS.reset);
  } catch (error) {
    console.error(COLORS.red, `--- ❌ FAILED: ${name} ---`, COLORS.reset);
    console.error(error);
    // await cleanupDatabase();
    process.exit(1);
  }
}

async function getAuthCookie(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/callback/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email, password, csrfToken: "test" }), // CSRF token is mocked for script
    redirect: "manual",
  });
  const cookie = res.headers.get("set-cookie") || "";
  if (!cookie) throw new Error(`Authentication failed for ${email}`);
  return cookie;
}

// --- TEST SUITE ---
async function runTests() {
  //   await cleanupDatabase();

  // await testEndpoint("User Registration", async () => {
  //   const res = await fetch(`${BASE_URL}/auth/register`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(applicantUser),
  //   });
  //   if (res.status !== 201)
  //     throw new Error(`Registration failed with status ${res.status}`);
  // });

  // await testEndpoint("Admin User Creation (via Script)", async () => {
  //   // In a real scenario, you'd run your createUser.ts script for this
  //   const connection = await mongoose.connect(TEST_DB_URI!);
  //   const { hashPassword } = await import("../lib/password");
  //   const hashedPassword = await hashPassword(adminUser.password);
  //   await new (require("../models/User").default)({
  //     ...adminUser,
  //     password: hashedPassword,
  //   }).save();
  //   await new (require("../models/User").default)({
  //     ...tscUser,
  //     password: hashedPassword,
  //   }).save();
  //   await mongoose.disconnect();
  // });

  await testEndpoint("User Login and Session Cookie Retrieval", async () => {
    adminCookie = await getAuthCookie(adminUser.email, adminUser.password);
    tscCookie = await getAuthCookie(tscUser.email, tscUser.password);
    applicantCookie = await getAuthCookie(
      applicantUser.email,
      applicantUser.password
    );
  });

  await testEndpoint("Applicant Creates a Proposal Draft", async () => {
    const res = await fetch(`${BASE_URL}/proposals`, {
      method: "POST",
      headers: { Cookie: applicantCookie },
    });
    const data = await res.json();
    console.log({ data });
    if (res.status !== 201 || !data._id)
      throw new Error(`Draft creation failed`);
    proposalId = data._id;
  });

  await testEndpoint("Applicant Updates and Submits Proposal", async () => {
    const proposalData = {
      projectTitle: "Test AI Novelty Project",
      objectives: "To test the vector search and AI evaluation pipeline.",
      rdComponents: "This is a unique test.",
      submitForReview: true,
    };
    const res = await fetch(`${BASE_URL}/proposals/${proposalId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: applicantCookie },
      body: JSON.stringify(proposalData),
    });
    const data = await res.json();
    if (res.status !== 200 || data.status !== "under_review")
      throw new Error(`Submission failed`);
  });

  await testEndpoint("TSC Member Submits a Review", async () => {
    const reviewData = {
      comment: "Looks promising, but needs more detail on the budget.",
      decision: "Revision Requested",
    };
    const res = await fetch(`${BASE_URL}/proposals/${proposalId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: tscCookie },
      body: JSON.stringify(reviewData),
    });
    const data = await res.json();
    if (res.status !== 200 || data.status !== "revision_requested")
      throw new Error(`Review submission failed`);
  });

  console.log(
    COLORS.green,
    "\n🎉 All tests passed successfully!",
    COLORS.reset
  );
  //   await cleanupDatabase();
}

// Run the entire suite
runTests();
