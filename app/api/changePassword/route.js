import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { password } = await request.json();

  const { sessionData } = await getSession();

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    await prisma.users.update({
      where: {
        user_id: sessionData.id,
      },
      data: {
        hashedPassword: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Password Changed" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
