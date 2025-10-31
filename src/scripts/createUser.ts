import "dotenv/config";
import inquirer from "inquirer";
import dbConnect from "../lib/mongodb";
import User from "../models/User";
import { hashPassword } from "../lib/password";
import mongoose from "mongoose";

const questions = [
  {
    type: "input",
    name: "name",
    message: "Enter the user's full name:",
    validate: (input: string) => (input ? true : "Name cannot be empty."),
  },
  {
    type: "input",
    name: "email",
    message: "Enter the user's email address:",
    validate: (input: string) =>
      /.+@.+\..+/.test(input) ? true : "Please enter a valid email.",
  },
  {
    type: "password",
    name: "password",
    message: "Enter a temporary password for the user:",
    mask: "*",
    validate: (input: string) =>
      input.length >= 8 ? true : "Password must be at least 8 characters.",
  },
  {
    type: "list",
    name: "role",
    message: "Select the user role:",
    choices: ["nacer_admin", "tsc_member", "applicant"],
    default: "applicant",
  },
];

async function createUser() {
  try {
    console.log("--- Create New User Script ---");
    const answers = await inquirer.prompt(questions);

    console.log("\nConnecting to the database...");
    await dbConnect();
    console.log("Database connected.");

    const { name, email, password, role } = answers;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error(
        `\nError: A user with the email "${email}" already exists.`
      );
      await mongoose.disconnect();
      return;
    }

    console.log("Hashing password...");
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    console.log(
      `\n✅ Success! User "${name}" with role "${role}" created successfully.`
    );
  } catch (error) {
    console.error("\nAn error occurred:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
}

createUser();
