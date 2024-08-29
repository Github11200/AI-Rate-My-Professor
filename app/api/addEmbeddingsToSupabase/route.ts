import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { MistralAIEmbeddings } from "@langchain/mistralai";

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
if (!supabaseKey) throw new Error("Expected SUPABASE_SERVICE_ROLE_KEY");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
if (!url) throw new Error("Expected env var SUPABASE_URL");

interface ProfessorObject {
  name: string;
  subject: string;
  rating: number;
  reviews: string[];
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { professor } = await req.json();

    const client = createClient(url, supabaseKey);

    await SupabaseVectorStore.fromTexts(
      professor.map((p: ProfessorObject) => p.reviews[0]),
      professor.map((p: ProfessorObject) => {
        return {
          name: p.name,
          subject: p.subject,
          rating: p.rating,
        };
      }),
      new MistralAIEmbeddings(),
      {
        client,
        tableName: "professors",
        queryName: "match_documents",
      }
    );

    return new Response("Professor added to Supabase successfully");
  } catch (error) {
    console.error("Error occurred while adding embeddings to Supabase:", error);
    return new Response("Error occurred while adding embeddings to Supabase", {
      status: 500,
    });
  }
}
