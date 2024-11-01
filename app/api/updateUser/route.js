import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const isEmpty = (obj) => Object.keys(obj).length === 0;

const updateUserSchema = z.object({
  name: z.string().optional(),
  grade_level: z.string().optional(),
  program: z.string().optional(),
  department: z.string().optional(),
  contact: z.string().optional(),
});

export async function POST(request) {
  const body = await request.json();
  const { name, grade_level, program, department, contact } =
    updateUserSchema.parse(body);

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

  if (department !== "") {
    studentData.department = department;
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
