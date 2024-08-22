import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { MistralAIEmbeddings } from "@langchain/mistralai";

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

export async function POST(req: NextRequest, res: NextResponse) {
  const { prompt, userId, topK } = await req.json();

  const client = createClient(url, supabaseKey);
  const embeddings = new MistralAIEmbeddings();

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "professors",
  });

  const result = await vectorStore.similaritySearch(prompt, topK, {
    userId: userId,
  });

  return new Response(JSON.stringify(result));
}
