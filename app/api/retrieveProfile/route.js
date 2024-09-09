import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    let data;

    if (sessionData.role === "student") {
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

      const { name, user_id, contact, student, profilePicture } =
        userWithStudentDetails;
      const { grade_level, program } = student || {};

      data = {
        name: name,
        year: grade_level,
        course: program,
        idNumber: user_id,
        contact: contact,
        profilePicture: profilePicture,
      };
    } else if (sessionData.role === "counselor") {
      const userWithCounselorDetails = await prisma.users.findUnique({
        where: {
          user_id: sessionData.id,
        },
        include: {
          counselor: {
            select: {
              counselor_id: true,
              department: true,
            },
          },
        },
      });

      const { name, user_id, contact, counselor, profilePicture } =
        userWithCounselorDetails;
      const { department } = counselor || {};

      data = {
        name: name,
        department: department,
        idNumber: user_id,
        contact: contact,
        profilePicture: profilePicture,
      };
    }

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
