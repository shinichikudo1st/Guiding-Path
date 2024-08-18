import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

const isEmpty = (obj) => Object.keys(obj).length === 0;

export async function POST(request) {
  const { name, grade_level, program, contact } = await request.json();

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  const updateData = {};

  if (name !== "") {
    updateData.name = name;
  }

  if (contact !== "") {
    updateData.contact = contact;
  }

  const studentData = {};

  if (grade_level !== "") {
    studentData.grade_level = grade_level;
  }

  if (program !== "") {
    studentData.program = program;
  }

  try {
    if (!isEmpty(updateData)) {
      await prisma.users.update({
        where: {
          user_id: sessionData.id,
        },
        data: {
          ...updateData,
        },
      });
    }

    if (!isEmpty(studentData)) {
      await prisma.students.update({
        where: {
          student_id: sessionData.id,
        },
        data: {
          ...studentData,
        },
      });
    }

    return NextResponse.json({ message: "User Updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
