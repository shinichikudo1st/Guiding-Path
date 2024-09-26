import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const teacherSchema = z.object({
  name: z.string().optional(),
  department: z.string().optional(),
  contact: z.string().optional(),
});

const isEmpty = (obj) => Object.keys(obj).length === 0;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, department, contact } = teacherSchema.parse(body);

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

    const teacherData = {};

    if (department !== "") {
      teacherData.department = department;
    }

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

    if (!isEmpty(teacherData)) {
      await prisma.teachers.update({
        where: {
          teacher_id: sessionData.id,
        },
        data: {
          ...teacherData,
        },
      });
    }

    return NextResponse.json({ message: "User Updated" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
