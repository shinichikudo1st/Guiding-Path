import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { sessionData } = await getSession();

  if (!sessionData) {
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

    const { name, user_id, contact, student } = userWithStudentDetails;
    const { grade_level, program } = student || {};

    const data = {
      name: name,
      year: grade_level,
      course: program,
      idNumber: user_id,
      contact: contact,
    };

    return NextResponse.json(
      { message: "User Data Retrieved", userInfo: data },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
