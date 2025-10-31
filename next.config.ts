import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    MONGO_URI: process.env.MONGO_URI,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    MAX_RESUBMISSION_LIMIT: process.env.MAX_RESUBMISSION_LIMIT,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,
  },
};
