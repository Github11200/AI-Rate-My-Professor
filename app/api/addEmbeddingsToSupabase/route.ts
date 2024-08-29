

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { MistralAIEmbeddings } from "@langchain/mistralai";

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

interface ProfessorObject {
  name: string;
  subject: string;
  rating: number;
  description: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  const userId = data.userId;
  const professor = data.professor as ProfessorObject;

  const client = createClient(url, supabaseKey);

  await SupabaseVectorStore.fromTexts(
    [professor.description],
    [{ userId: userId, name: professor.name, rating: professor.rating }],
    new MistralAIEmbeddings(),
    {
      client,
      tableName: "professors",
      queryName: "match_documents",
    }
  );

  return new Response("Added document");
}