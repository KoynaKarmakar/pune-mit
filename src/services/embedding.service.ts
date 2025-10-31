import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const result = await model.embedContent({
      content: { parts: [{ text }], role: "user" },
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate text embedding.");
  }
}
