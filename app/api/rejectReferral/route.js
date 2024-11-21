import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.referrals.update({
      where: {
        referral_id: parseInt(id),
      },
      data: {
        status: "rejected",
      },
    });

    return NextResponse.json(
      { message: "Referral rejected successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
