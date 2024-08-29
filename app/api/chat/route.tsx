import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
if (!supabaseUrl) throw new Error(`Expected NEXT_PUBLIC_SUPABASE_URL`);
console.log("Supabase URL initialized:", supabaseUrl);

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);
console.log("Supabase Service Role Key initialized.");

const supabase = createClient(supabaseUrl, supabaseKey);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY as string, // Assuming this is your GEMINI_API_KEY
});
console.log("ChatGoogleGenerativeAI model initialized.");

const systemPrompt = `
You are an intelligent assistant designed to help students find professors based on their specific needs and preferences. Your task is to respond to user queries by identifying the top 3 professors that best match their criteria. Use the Retrieval-Augmented Generation (RAG) approach to ensure the most relevant and up-to-date information is provided.

Guidelines:

1. Understand the Query: Carefully analyze the user’s query to determine the criteria they are looking for in a professor. This could include factors like teaching style, research interests, course difficulty, student feedback, and more.

2. Retrieve Information: Search through the database of professors to find those who best match the criteria specified by the user.

3. Generate Responses: Provide the top 3 professors that align with the user’s query. Include relevant details such as the professor’s name, department, courses they teach, a brief overview of student ratings, and any specific attributes that make them a good match.

4. Be Concise and Informative: Ensure that the response is clear, concise, and directly addresses the user’s query. If there are any additional factors that the user should consider, mention them briefly.

5. Provide Further Assistance: If the user has follow-up questions or needs more specific information, be ready to assist with further tailored suggestions.

Response Structure:

- Professor 1:
  - Name: [Professor Name]
  - Department: [Department Name]
  - Courses: [List of Courses]
  - Student Feedback: [Brief summary of ratings and feedback]
  - Special Attributes: [Teaching style, research interests, etc.]

- Professor 2:  
  [Same structure as above]

- Professor 3:  
  [Same structure as above]
`;

export async function POST(request: Request) {
  try {
    const { description } = await request.json();
    console.log("Received description:", description);

    // Fetch professors from the database that match the description
    const { data: professors, error } = await supabase
      .from("professors")
      .select("*")
      .ilike("description", `%${description}%`);

    if (error) {
      console.error("Error retrieving professors from the database:", error);
      return NextResponse.json({
        error: "Error retrieving professors from the database",
      });
    }

    console.log("Number of professors found:", professors.length);

    if (professors.length === 0) {
      console.log("No matching professors found.");
      return NextResponse.json({
        message: "No matching professors found.",
      });
    }

    // Construct the prompt for the RAG model with the retrieved professors' data
    const humanPrompt = `Find professors matching: ${description}. 
    Here is the list of available professors: 
    ${professors.map((professor, index) => `
      Professor ${index + 1}:
      Name: ${professor.name}
      Department: ${professor.subject}
      Rating: ${professor.rating}
      Description: ${professor.description}`).join("\n")}
    `;

    console.log("Constructed human prompt:", humanPrompt);

    // Generate the response using the RAG approach with the fetched professors
    const res = await model.invoke([
      ["system", systemPrompt],
      ["human", humanPrompt],
    ]);

    console.log("Model response:", res.content);
    return new Response(res.content as BodyInit);
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
