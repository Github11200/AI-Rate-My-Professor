import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  console.log(await req.json());

  // const { id } = await req.json();
  // console.log(id);

  return new Response("id");
}
