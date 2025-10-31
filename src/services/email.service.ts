import nodemailer from "nodemailer";
import { IProposal } from "@/models/Proposal";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends a confirmation email to the applicant after their proposal is submitted
 * and the AI evaluation is complete.
 */
export async function sendSubmissionConfirmationEmail(
  applicantEmail: string,
  proposal: IProposal
): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: applicantEmail,
    subject: `Proposal Submitted Successfully: "${proposal.projectTitle}"`,
    html: `
      <h1>Thank You for Your Submission</h1>
      <p>Dear Applicant,</p>
      <p>Your research proposal, titled "<b>${proposal.projectTitle}</b>", has been successfully submitted and is now under initial review.</p>
      <p><b>Proposal ID:</b> ${proposal._id}</p>
      <p>You will be notified of any status updates. You can track your proposal's progress on your dashboard.</p>
      <br>
      <p>Sincerely,</p>
      <p>The NaCCER R&D Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Submission confirmation email sent to: ${applicantEmail}`);
  } catch (error) {
    console.error(
      `Error sending confirmation email to ${applicantEmail}:`,
      error
    );
  }
}

/**
 * Sends a notification email to a TSC member alerting them that a new
 * proposal is ready for their review.
 */
export async function sendNewProposalForReviewEmail(
  reviewerEmail: string,
  proposal: IProposal
): Promise<void> {
  const reviewLink = `${process.env.NEXTAUTH_URL}/proposals/${proposal._id}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: reviewerEmail,
    subject: `New R&D Proposal for Review: "${proposal.projectTitle}"`,
    html: `
      <h1>New Proposal Ready for Review</h1>
      <p>Dear TSC Member,</p>
      <p>A new research proposal, titled "<b>${proposal.projectTitle}</b>", has been submitted and requires your review.</p>
      <p><b>Proposal ID:</b> ${proposal._id}</p>
      <p><b>AI-Generated Score:</b> ${proposal.aiScore}%</p>
      <p>Please click the link below to access the detailed evaluation report and submit your review.</p>
      <a href="${reviewLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">View Proposal</a>
      <br><br>
      <p>Thank you,</p>
      <p>NaCCER R&D Portal</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `New proposal notification sent to TSC member: ${reviewerEmail}`
    );
  } catch (error) {
    console.error(
      `Error sending notification email to ${reviewerEmail}:`,
      error
    );
  }
}

/**
 * Sends an email to the applicant informing them that their proposal was
 * automatically rejected based on the initial AI screening.
 */
export async function sendAutoRejectionEmail(
  applicantEmail: string,
  proposal: IProposal
): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: applicantEmail,
    subject: `Update on Your Proposal: "${proposal.projectTitle}"`,
    html: `
      <h1>Update on Your R&D Proposal</h1>
      <p>Dear Applicant,</p>
      <p>Thank you for submitting your proposal, "<b>${proposal.projectTitle}</b>".</p>
      <p>After an initial automated screening, your proposal did not meet the minimum criteria for further review at this time. The AI-generated score was <b>${proposal.aiScore}%</b>, which is below the required threshold of 65%.</p>
      <p>We encourage you to review the feedback and recommendations provided in the AI evaluation on your dashboard and consider resubmitting in the future.</p>
      <br>
      <p>Sincerely,</p>
      <p>The NaCCER R&D Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Auto-rejection email sent to: ${applicantEmail}`);
  } catch (error) {
    console.error(
      `Error sending auto-rejection email to ${applicantEmail}:`,
      error
    );
  }
}
