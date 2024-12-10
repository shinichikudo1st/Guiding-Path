import { getSession } from "@/app/utils/authentication";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = {
    name: sessionData.name,
    role: sessionData.role,
    profilePicture: sessionData.profilePicture,
  };

  return NextResponse.json({ user }, { status: 200 });
}