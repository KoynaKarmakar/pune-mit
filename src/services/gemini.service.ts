import { GoogleGenerativeAI } from "@google/generative-ai";
import { IProposal } from "@/models/Proposal";
import PastProject from "@/models/PastProject"; // Make sure this model is created
import { generateEmbedding } from "./embedding.service"; // Make sure this service is created

/**
 * Performs a vector search against the PastProjects collection in MongoDB to find similar projects.
 * @param embedding The vector embedding of the new proposal's summary.
 * @returns An object containing details about the most similar past project found.
 */
async function performVectorSearch(embedding: number[]): Promise<any> {
  try {
    // This is the core MongoDB Aggregation query for vector search
    const similarProjects = await PastProject.aggregate([
      {
        $vectorSearch: {
          index: "vector_index", // The name of the index you created in Atlas
          path: "summaryEmbedding",
          queryVector: embedding,
          numCandidates: 100, // Number of candidates to consider
          limit: 1, // Return only the top 1 most similar project
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          score: { $meta: "vectorSearchScore" }, // Get the similarity score
        },
      },
    ]);

    if (similarProjects.length > 0) {
      const topMatch = similarProjects[0];
      return {
        is_potentially_novel: topMatch.score < 0.9, // Novel if similarity is less than 90%
        most_similar_project_title: topMatch.title,
        similarity_score: topMatch.score.toFixed(4), // Format score for readability
      };
    }
  } catch (error) {
    console.error("Vector search failed:", error);
  }

  // Default response if no similar projects are found or if an error occurs
  return {
    is_potentially_novel: true,
    most_similar_project_title:
      "No similar past projects found in the database.",
    similarity_score: 0,
  };
}

/**
 * Constructs the detailed prompt for the Gemini model, including novelty check results.
 * @param proposalData The raw data of the proposal.
 * @param noveltyResult The result from the vector search.
 * @returns The complete prompt string.
 */
function constructPrompt(proposalData: object, noveltyResult: any): string {
  const enrichedData = {
    ...proposalData,
    noveltyCheckResult: noveltyResult, // Add novelty context
  };
  const proposalJson = JSON.stringify(enrichedData, null, 2);

  const checklist = `
    ### 1. Detailed Reading & Structural Compliance
    - **1.1 Structural Adherence:** Does the proposal seem to follow a standard proforma structure with all key headings?
    - **1.2 Conciseness and Word Limits:** Is the language concise and does it appear to respect word limits?
    - **1.3 SMART Objectives:** Are the objectives written in a pointed language and appear Specific, Measurable, Achievable, Relevant, and Time-bound?
    - **1.4 Work Plan Visualization:** Is there a structured timeline provided?
    - **1.5 Completeness of Annexures:** Is the investigator CV section fully filled out?

    ### 2. Financial Assessment
    - **2.1 Budgetary Justification:** Is there a clear justification for the budget?
    - **2.2 Cost Reasonableness:** Does the proposal provide a basis for the cost estimates?
    - **2.3 Compliance with Funding Norms:** Does the budget mention or imply adherence to norms like cost-sharing?
    - **2.4 Alignment with Industry Benefit:** Does the financial plan seem geared towards a commercial application?

    ### 3. Technical Feasibility
    - **3.1 Methodology and Work Plan Coherence:** Is the methodology clear, sound, and logically linked to the objectives?
    - **3.2 Achievability and Risk Assessment:** Does the plan seem realistic and achievable?
    - **3.3 Team Expertise and Institutional Capacity:** Based on the CV details, does the team appear to have the necessary expertise?
    - **3.4 Benefit to the Coal Industry:** Is the value proposition to the coal industry clearly and compellingly articulated?

    ### 4. Novelty & Innovation
    - **4.1 Literature Survey Thoroughness:** Does the proposal include a comprehensive literature survey?
    - **4.2 Identification of Research Gap:** Does the proposal clearly define a specific research gap?
    - **4.3 Articulation of Novelty:** Based on the 'rdComponents' and the 'noveltyCheckResult', is the novelty clearly described and does it pinpoint a unique selling proposition (USP)?
    - **4.4 Advancement Beyond Existing Solutions:** Does the proposal demonstrate how it will advance the field beyond current practices, especially considering the most similar past project found?
    `;

  return `
    You are an expert AI-based auto-evaluation system for R&D proposals. Your task is to meticulously evaluate the following research proposal based on a strict checklist.

    **Proposal Data (in JSON format):**
    ${proposalJson}

    **Evaluation Checklist & Instructions:**
    Evaluate the proposal against the following checklist. For the Novelty & Innovation section, pay close attention to the 'noveltyCheckResult' field included in the data. For each item, you MUST provide:
    1. "covered": a boolean value (true/false).
    2. "justification": a brief, one-sentence explanation for your decision based ONLY on the provided proposal data.

    --- CHECKLIST START ---
    ${checklist}
    --- CHECKLIST END ---

    **Output Instruction:**
    Your entire response MUST be a single, valid JSON object. Do not include any text, notes, or markdown formatting before or after the JSON.
    `;
}

/**
 * Main function to evaluate a proposal using AI, including a novelty check.
 * @param proposal The Mongoose document of the proposal.
 * @returns An object containing the detailed evaluation and the final score.
 */
export async function evaluateProposalWithAI(proposal: IProposal) {
  // 1. Create a concise summary of the proposal for embedding
  const summaryText = `Title: ${proposal.projectTitle}. Objectives: ${proposal.objectives}. Novelty: ${proposal.rdComponents}`;

  // 2. Generate a vector embedding for the summary
  const embedding = await generateEmbedding(summaryText);

  // 3. Perform a vector search to check for novelty against past projects
  const noveltyResult = await performVectorSearch(embedding);

  // 4. Construct the prompt with the proposal data and the novelty check results
  const prompt = constructPrompt(proposal.toObject(), noveltyResult);

  // 5. Call the Gemini model for the final evaluation
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  let responseText = result.response.text();

  if (responseText.startsWith("```json")) {
    responseText = responseText.slice(7, -3).trim();
  }

  let evaluation;
  try {
    evaluation = JSON.parse(responseText);
  } catch (e) {
    console.error("Error parsing Gemini response:", responseText);
    throw new Error("Failed to parse AI response as JSON.");
  }

  // 6. Calculate the final score based on the 'covered' items
  let totalItems = 0;
  let coveredItems = 0;
  for (const category of Object.values(evaluation)) {
    for (const item of Object.values(category as object)) {
      totalItems++;
      if ((item as { covered: boolean }).covered) {
        coveredItems++;
      }
    }
  }
  const score =
    totalItems > 0 ? Math.round((coveredItems / totalItems) * 100) : 0;

  return { evaluation, score };
}
