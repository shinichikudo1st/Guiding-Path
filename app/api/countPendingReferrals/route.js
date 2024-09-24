import { NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";
import { getSession } from "@/app/utils/authentication";

export async function GET() {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pendingReferrals = await prisma.referrals.count({
      where: {
        status: "pending",
        counselor_id: sessionData.id,
      },
    });

    return NextResponse.json({ pendingReferrals }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending referrals:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
