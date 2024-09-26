import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateCounselorSchema = z.object({
  name: z.string().optional(),
  department: z.string().optional(),
  contact: z.string().optional(),
});

const isEmpty = (obj) => Object.keys(obj).length === 0;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, department, contact } = updateCounselorSchema.parse(body);

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

    const counselorData = {};

    if (department !== "") {
      counselorData.department = department;
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

    if (!isEmpty(counselorData)) {
      await prisma.counselors.update({
        where: {
          counselor_id: sessionData.id,
        },
        data: {
          ...counselorData,
        },
      });
    }

    return NextResponse.json({ message: "User Updated" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
