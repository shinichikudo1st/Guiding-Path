import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { counselorPassword, userID } = await request.json();

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const counselor = await prisma.users.findUnique({
    where: {
      user_id: sessionData.id,
    },
  });

  const match = await bcrypt.compare(
    counselorPassword,
    counselor.hashedPassword
  );

  if (!match) {
    return NextResponse.json({ message: "Wrong password" }, { status: 401 });
  }

  try {
    await prisma.users.update({
      where: {
        user_id: userID,
      },
      data: {
        status: "archived",
      },
    });

    return NextResponse.json(
      { message: "User archived successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Archive user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
