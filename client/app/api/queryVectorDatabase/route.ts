import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { MistralAIEmbeddings } from "@langchain/mistralai";

// Initialize Supabase client with the correct environment variables
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
if (!supabaseKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");

export async function POST(req: NextRequest, res: NextResponse) {
  const { prompt, userId, topK } = await req.json();

  // Create Supabase client
  const client = createClient(url, supabaseKey);

  // Initialize embeddings and vector store
  const embeddings = new MistralAIEmbeddings();
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "professors",
  });

  // Perform similarity search
  const result = await vectorStore.similaritySearch(prompt, topK, {
    userId: userId,
  });

  return new Response(JSON.stringify(result));
}
