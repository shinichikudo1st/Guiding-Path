import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userInfo = await prisma.users.findUnique({
      where: {
        user_id: sessionData.id,
      },
      select: {
        name: true,
        role: true,
        profilePicture: true,
      },
    });

    const user = {
      name: userInfo.name,
      role: userInfo.role,
      profilePicture: userInfo.profilePicture,
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
