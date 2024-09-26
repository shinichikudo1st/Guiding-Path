import { NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";
import { getSession } from "@/app/utils/authentication";

export async function GET() {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pendingRequests = await prisma.appointment_Requests.count();

    return NextResponse.json({ pendingRequests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
