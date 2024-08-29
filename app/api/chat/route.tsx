import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY as string, // Assuming this is your GEMINI_API_KEY
});

const systemPrompt = `
You are an intelligent assistant designed to help students find professors based on their specific needs and preferences. Your task is to respond to user queries by identifying the top 3 professors that best match their criteria. Use the Retrieval-Augmented Generation (RAG) approach to ensure the most relevant and up-to-date information is provided.

Guidelines:

1. You will be given a list of professors that have been scraped from the Rate my professors website, and then a similarty search has been performed on them, thsi will be your context

2. Only answer based on the context given, if the user asks for a fun enthusiastic professor, you a professor of that type based only from the context, and provide information such as their name, rating, etc.

3. If the context provided does not help, please let the user know, do not make up information or hallucinate

The data given to you will be the context which consists of the professor's reviews, name, and rating, ignore the subject.

After that you will be given the prompt from the user, in which you will summarize the information in a informative and concise manner and present that to the user.
`;

interface ContextObject {
  metadata: {
    name: string;
    rating: number;
  };
  pageContent: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userPrompt, context } = await request.json();

    let prompt = `<CONTEXT>
    ${context.map((object: ContextObject, index: number) => {
      return `Professor ${index + 1}: ${object.metadata.name} has a rating of ${
        object.metadata.rating
      } and the reviews are as follows: ${object.pageContent}\n\n`;
    })}

    <PROMPT>
    ${userPrompt}
    `;

    // Generate the response using the RAG approach with the fetched professors
    const res = await model.invoke([
      ["system", systemPrompt],
      ["human", prompt],
    ]);

    return new Response(res.content as BodyInit);
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
