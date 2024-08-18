import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { sessionData } = await getSession();

  if (!sessionData || !sessionData.id) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const userWithStudentDetails = await prisma.users.findUnique({
      where: {
        user_id: sessionData.id,
      },
      include: {
        student: {
          select: {
            student_id: true,
            grade_level: true,
            program: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "User Data Retrieved", userInfo: userWithStudentDetails },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
